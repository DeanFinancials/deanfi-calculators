/**
 * CD (Certificate of Deposit) Calculator
 * 
 * Comprehensive CD calculator with features that go beyond competitor offerings:
 * - Standard CD maturity calculations with multiple compounding frequencies
 * - CD Ladder builder for staggered maturity optimization
 * - Early withdrawal penalty calculations
 * - APY vs APR conversion
 * - Tax-adjusted returns (federal + state)
 * - Inflation-adjusted real returns
 * - Multi-CD scenario comparison
 * 
 * @module investment/cdCalculator
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Compounding frequency options for CDs
 */
export type CDCompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

/**
 * CD term in months (common terms)
 */
export type CDTermMonths = 1 | 3 | 6 | 9 | 12 | 18 | 24 | 36 | 48 | 60;

/**
 * Input parameters for CD calculation
 */
export interface CDInputs {
  /** Initial deposit amount */
  principal: number;
  /** Annual Percentage Yield (APY) as a decimal (e.g., 0.05 for 5%) */
  apy: number;
  /** Term length in months */
  termMonths: number;
  /** Compounding frequency (default: daily) */
  compoundingFrequency?: CDCompoundingFrequency;
  /** Optional: Federal tax rate as decimal for after-tax calculations */
  federalTaxRate?: number;
  /** Optional: State tax rate as decimal for after-tax calculations */
  stateTaxRate?: number;
  /** Optional: Expected inflation rate for real return calculations */
  inflationRate?: number;
}

/**
 * Monthly breakdown of CD growth
 */
export interface CDMonthlyBreakdown {
  /** Month number (1-indexed) */
  month: number;
  /** Starting balance for the month */
  startingBalance: number;
  /** Interest earned during the month */
  interestEarned: number;
  /** Ending balance after interest */
  endingBalance: number;
  /** Cumulative interest earned to date */
  cumulativeInterest: number;
}

/**
 * Result from CD calculation
 */
export interface CDResult {
  /** Initial deposit amount */
  principal: number;
  /** APY used for calculation */
  apy: number;
  /** Term in months */
  termMonths: number;
  /** Final balance at maturity */
  maturityValue: number;
  /** Total interest earned */
  totalInterest: number;
  /** APR (Annual Percentage Rate) before compounding */
  apr: number;
  /** Effective annual rate accounting for compounding */
  effectiveAnnualRate: number;
  /** Interest earned per year (average) */
  interestPerYear: number;
  /** Interest earned per month (average) */
  interestPerMonth: number;
  /** Monthly breakdown of growth */
  monthlyBreakdown: CDMonthlyBreakdown[];
  /** After-tax interest (if tax rates provided) */
  afterTaxInterest?: number;
  /** After-tax maturity value (if tax rates provided) */
  afterTaxMaturityValue?: number;
  /** Total tax on interest (if tax rates provided) */
  taxOnInterest?: number;
  /** Inflation-adjusted (real) return (if inflation rate provided) */
  realReturn?: number;
  /** Inflation-adjusted maturity value (if inflation rate provided) */
  realMaturityValue?: number;
}

/**
 * CD Ladder configuration
 */
export interface CDLadderRung {
  /** Position in ladder (1 = first to mature) */
  position: number;
  /** Deposit amount for this CD */
  amount: number;
  /** Term in months */
  termMonths: number;
  /** APY for this term */
  apy: number;
  /** Maturity date (months from now) */
  maturityMonth: number;
  /** Value at maturity */
  maturityValue: number;
  /** Interest earned */
  interestEarned: number;
}

/**
 * CD Ladder result
 */
export interface CDLadderResult {
  /** Total investment across all CDs */
  totalInvestment: number;
  /** Number of CDs in the ladder */
  numberOfRungs: number;
  /** Individual rungs (CDs) in the ladder */
  rungs: CDLadderRung[];
  /** Total value at final maturity */
  totalMaturityValue: number;
  /** Total interest earned across all CDs */
  totalInterest: number;
  /** Weighted average APY */
  weightedAverageAPY: number;
  /** Average time until access to funds (weighted by amount) */
  averageMaturityMonths: number;
  /** When each rung matures, liquidity becomes available */
  liquiditySchedule: { month: number; amountAvailable: number }[];
}

/**
 * Early withdrawal penalty result
 */
export interface EarlyWithdrawalResult {
  /** Original maturity value if held to term */
  originalMaturityValue: number;
  /** Value at time of early withdrawal (before penalty) */
  valueAtWithdrawal: number;
  /** Penalty amount in dollars */
  penaltyAmount: number;
  /** Net amount received after penalty */
  netAmount: number;
  /** Interest forfeited due to penalty */
  interestForfeited: number;
  /** Interest actually received */
  interestReceived: number;
  /** Effective yield after early withdrawal */
  effectiveYield: number;
  /** Whether withdrawal results in principal loss */
  principalLoss: boolean;
  /** Months held before withdrawal */
  monthsHeld: number;
}

/**
 * Early withdrawal penalty type
 */
export type EarlyWithdrawalPenaltyType = 
  | 'days-simple' // X days of simple interest
  | 'months-interest' // X months of interest
  | 'percent-interest' // X% of earned interest
  | 'custom'; // Custom amount

/**
 * Early withdrawal penalty configuration
 */
export interface EarlyWithdrawalPenalty {
  type: EarlyWithdrawalPenaltyType;
  /** For days-simple: number of days, for months-interest: number of months, for percent-interest: percentage as decimal */
  value: number;
}

/**
 * CD comparison scenario
 */
export interface CDScenario {
  /** Scenario label */
  label: string;
  /** CD inputs for this scenario */
  inputs: CDInputs;
}

/**
 * CD comparison result
 */
export interface CDComparisonResult {
  scenarios: Array<{
    label: string;
    inputs: CDInputs;
    result: CDResult;
  }>;
  /** Index of best scenario by total interest */
  bestByInterest: number;
  /** Index of best scenario by effective yield */
  bestByYield: number;
  /** Interest difference between best and worst */
  interestDifference: number;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Common early withdrawal penalties by term length
 * Based on typical bank policies
 */
export const TYPICAL_PENALTIES: Record<string, EarlyWithdrawalPenalty> = {
  '3-months': { type: 'days-simple', value: 90 },
  '6-months': { type: 'days-simple', value: 90 },
  '12-months': { type: 'months-interest', value: 3 },
  '18-months': { type: 'months-interest', value: 3 },
  '24-months': { type: 'months-interest', value: 6 },
  '36-months': { type: 'months-interest', value: 6 },
  '48-months': { type: 'months-interest', value: 12 },
  '60-months': { type: 'months-interest', value: 12 },
};

/**
 * Current typical CD rates by term (as of late 2024/early 2025)
 * These are averages and should be updated periodically
 */
export const TYPICAL_CD_RATES: Record<CDTermMonths, { low: number; average: number; high: number }> = {
  1: { low: 0.01, average: 0.03, high: 0.05 },
  3: { low: 0.03, average: 0.04, high: 0.05 },
  6: { low: 0.035, average: 0.043, high: 0.05 },
  9: { low: 0.035, average: 0.042, high: 0.048 },
  12: { low: 0.035, average: 0.042, high: 0.05 },
  18: { low: 0.03, average: 0.04, high: 0.048 },
  24: { low: 0.03, average: 0.038, high: 0.045 },
  36: { low: 0.028, average: 0.035, high: 0.042 },
  48: { low: 0.025, average: 0.033, high: 0.04 },
  60: { low: 0.025, average: 0.032, high: 0.04 },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the number of compounding periods per year
 */
export function getCompoundingPeriodsPerYear(frequency: CDCompoundingFrequency): number {
  switch (frequency) {
    case 'daily': return 365;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'semi-annually': return 2;
    case 'annually': return 1;
  }
}

/**
 * Convert APY to APR given compounding frequency
 * APY = (1 + APR/n)^n - 1
 * Therefore: APR = n * ((1 + APY)^(1/n) - 1)
 */
export function apyToApr(apy: number, compoundingFrequency: CDCompoundingFrequency): number {
  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  return n * (Math.pow(1 + apy, 1 / n) - 1);
}

/**
 * Convert APR to APY given compounding frequency
 * APY = (1 + APR/n)^n - 1
 */
export function aprToApy(apr: number, compoundingFrequency: CDCompoundingFrequency): number {
  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  return Math.pow(1 + apr / n, n) - 1;
}

/**
 * Calculate compound interest for a given period
 */
function calculateCompoundInterest(
  principal: number,
  apr: number,
  periodsPerYear: number,
  totalPeriods: number
): number {
  return principal * Math.pow(1 + apr / periodsPerYear, totalPeriods);
}

// =============================================================================
// Main Functions
// =============================================================================

/**
 * Calculate CD maturity value and returns
 * 
 * @param inputs - CD calculation inputs
 * @returns Complete CD calculation result
 */
export function calculateCD(inputs: CDInputs): CDResult {
  const {
    principal,
    apy,
    termMonths,
    compoundingFrequency = 'daily',
    federalTaxRate,
    stateTaxRate,
    inflationRate,
  } = inputs;

  // Validate inputs
  if (principal <= 0) {
    throw new Error('Principal must be greater than 0');
  }
  if (apy < 0 || apy > 1) {
    throw new Error('APY must be between 0 and 1 (e.g., 0.05 for 5%)');
  }
  if (termMonths <= 0) {
    throw new Error('Term must be greater than 0 months');
  }

  // Convert APY to APR for calculation
  const apr = apyToApr(apy, compoundingFrequency);
  const periodsPerYear = getCompoundingPeriodsPerYear(compoundingFrequency);
  
  // Calculate total compounding periods
  const termYears = termMonths / 12;
  const totalPeriods = Math.floor(periodsPerYear * termYears);
  
  // Calculate maturity value
  const maturityValue = calculateCompoundInterest(principal, apr, periodsPerYear, totalPeriods);
  const totalInterest = maturityValue - principal;
  
  // Calculate effective annual rate (should match APY for verification)
  const effectiveAnnualRate = Math.pow(1 + apr / periodsPerYear, periodsPerYear) - 1;
  
  // Calculate average interest per period
  const interestPerYear = totalInterest / termYears;
  const interestPerMonth = totalInterest / termMonths;
  
  // Generate monthly breakdown
  const monthlyBreakdown: CDMonthlyBreakdown[] = [];
  let currentBalance = principal;
  let cumulativeInterest = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const startingBalance = currentBalance;
    // Calculate periods in this month
    const periodsInMonth = periodsPerYear / 12;
    const endingBalance = calculateCompoundInterest(startingBalance, apr, periodsPerYear, periodsInMonth);
    const interestEarned = endingBalance - startingBalance;
    cumulativeInterest += interestEarned;
    
    monthlyBreakdown.push({
      month,
      startingBalance,
      interestEarned,
      endingBalance,
      cumulativeInterest,
    });
    
    currentBalance = endingBalance;
  }

  // Build result object
  const result: CDResult = {
    principal,
    apy,
    termMonths,
    maturityValue,
    totalInterest,
    apr,
    effectiveAnnualRate,
    interestPerYear,
    interestPerMonth,
    monthlyBreakdown,
  };

  // Calculate after-tax values if tax rates provided
  if (federalTaxRate !== undefined || stateTaxRate !== undefined) {
    const combinedTaxRate = (federalTaxRate ?? 0) + (stateTaxRate ?? 0);
    const taxOnInterest = totalInterest * combinedTaxRate;
    const afterTaxInterest = totalInterest - taxOnInterest;
    
    result.taxOnInterest = taxOnInterest;
    result.afterTaxInterest = afterTaxInterest;
    result.afterTaxMaturityValue = principal + afterTaxInterest;
  }

  // Calculate inflation-adjusted (real) returns if inflation rate provided
  if (inflationRate !== undefined) {
    // Real return = (1 + nominal) / (1 + inflation) - 1
    const nominalReturn = totalInterest / principal;
    const realReturnRate = (1 + nominalReturn) / Math.pow(1 + inflationRate, termYears) - 1;
    const realMaturityValue = principal * (1 + realReturnRate);
    
    result.realReturn = realReturnRate;
    result.realMaturityValue = realMaturityValue;
  }

  return result;
}

/**
 * Build a CD ladder for staggered maturities and liquidity
 * 
 * @param totalAmount - Total amount to invest across all CDs
 * @param numberOfRungs - Number of CDs in the ladder (typically 3-5)
 * @param maxTermMonths - Longest term in the ladder
 * @param rates - APY rates for each term (e.g., { 12: 0.045, 24: 0.048, ... })
 * @returns CD ladder configuration with all calculations
 */
export function buildCDLadder(
  totalAmount: number,
  numberOfRungs: number,
  maxTermMonths: number,
  rates: Record<number, number>
): CDLadderResult {
  if (numberOfRungs < 2 || numberOfRungs > 10) {
    throw new Error('Number of rungs must be between 2 and 10');
  }
  if (totalAmount <= 0) {
    throw new Error('Total amount must be greater than 0');
  }

  // Calculate term interval
  const termInterval = maxTermMonths / numberOfRungs;
  
  // Amount per rung (equal distribution)
  const amountPerRung = totalAmount / numberOfRungs;
  
  const rungs: CDLadderRung[] = [];
  let totalMaturityValue = 0;
  let totalInterest = 0;
  let weightedAPYSum = 0;
  let weightedMaturitySum = 0;
  const liquiditySchedule: { month: number; amountAvailable: number }[] = [];
  
  for (let i = 0; i < numberOfRungs; i++) {
    const position = i + 1;
    const termMonths = Math.round(termInterval * position);
    
    // Find the closest rate from provided rates, or interpolate
    const sortedTerms = Object.keys(rates).map(Number).sort((a, b) => a - b);
    let apy = 0;
    
    // Find exact match or closest term
    if (rates[termMonths] !== undefined) {
      apy = rates[termMonths];
    } else {
      // Find bracketing terms and interpolate
      const lowerTerm = sortedTerms.filter(t => t <= termMonths).pop() || sortedTerms[0];
      const upperTerm = sortedTerms.find(t => t >= termMonths) || sortedTerms[sortedTerms.length - 1];
      
      if (lowerTerm === upperTerm) {
        apy = rates[lowerTerm];
      } else {
        // Linear interpolation
        const ratio = (termMonths - lowerTerm) / (upperTerm - lowerTerm);
        apy = rates[lowerTerm] + ratio * (rates[upperTerm] - rates[lowerTerm]);
      }
    }
    
    // Calculate this rung
    const cdResult = calculateCD({
      principal: amountPerRung,
      apy,
      termMonths,
    });
    
    const rung: CDLadderRung = {
      position,
      amount: amountPerRung,
      termMonths,
      apy,
      maturityMonth: termMonths,
      maturityValue: cdResult.maturityValue,
      interestEarned: cdResult.totalInterest,
    };
    
    rungs.push(rung);
    totalMaturityValue += cdResult.maturityValue;
    totalInterest += cdResult.totalInterest;
    weightedAPYSum += apy * amountPerRung;
    weightedMaturitySum += termMonths * amountPerRung;
    
    liquiditySchedule.push({
      month: termMonths,
      amountAvailable: cdResult.maturityValue,
    });
  }
  
  return {
    totalInvestment: totalAmount,
    numberOfRungs,
    rungs,
    totalMaturityValue,
    totalInterest,
    weightedAverageAPY: weightedAPYSum / totalAmount,
    averageMaturityMonths: weightedMaturitySum / totalAmount,
    liquiditySchedule: liquiditySchedule.sort((a, b) => a.month - b.month),
  };
}

/**
 * Calculate early withdrawal penalty and net returns
 * 
 * @param inputs - Original CD inputs
 * @param monthsHeld - Number of months before early withdrawal
 * @param penalty - Penalty configuration
 * @returns Early withdrawal calculation result
 */
export function calculateEarlyWithdrawal(
  inputs: CDInputs,
  monthsHeld: number,
  penalty: EarlyWithdrawalPenalty
): EarlyWithdrawalResult {
  const { principal, apy, termMonths, compoundingFrequency = 'daily' } = inputs;
  
  if (monthsHeld <= 0) {
    throw new Error('Months held must be greater than 0');
  }
  if (monthsHeld >= termMonths) {
    throw new Error('Months held must be less than the full term');
  }

  // Calculate original maturity value
  const originalResult = calculateCD(inputs);
  
  // Calculate value at time of withdrawal
  const partialResult = calculateCD({
    ...inputs,
    termMonths: monthsHeld,
  });
  
  const valueAtWithdrawal = partialResult.maturityValue;
  const interestEarnedToDate = partialResult.totalInterest;
  
  // Calculate penalty amount based on penalty type
  let penaltyAmount: number;
  const apr = apyToApr(apy, compoundingFrequency);
  
  switch (penalty.type) {
    case 'days-simple': {
      // Penalty is X days of simple interest
      const dailyInterest = (principal * apr) / 365;
      penaltyAmount = dailyInterest * penalty.value;
      break;
    }
    case 'months-interest': {
      // Penalty is X months of interest
      const monthlyInterest = (principal * apr) / 12;
      penaltyAmount = monthlyInterest * penalty.value;
      break;
    }
    case 'percent-interest': {
      // Penalty is X% of earned interest
      penaltyAmount = interestEarnedToDate * penalty.value;
      break;
    }
    case 'custom': {
      // Custom fixed amount
      penaltyAmount = penalty.value;
      break;
    }
    default:
      penaltyAmount = 0;
  }
  
  // Ensure penalty doesn't exceed earned interest (some banks cap this)
  // But can dip into principal if interest doesn't cover it
  const netAmount = valueAtWithdrawal - penaltyAmount;
  const principalLoss = netAmount < principal;
  const interestForfeited = Math.min(penaltyAmount, interestEarnedToDate);
  const interestReceived = interestEarnedToDate - interestForfeited;
  
  // Calculate effective yield
  const effectiveYield = monthsHeld > 0 
    ? ((netAmount - principal) / principal) * (12 / monthsHeld)
    : 0;
  
  return {
    originalMaturityValue: originalResult.maturityValue,
    valueAtWithdrawal,
    penaltyAmount,
    netAmount,
    interestForfeited,
    interestReceived,
    effectiveYield,
    principalLoss,
    monthsHeld,
  };
}

/**
 * Compare multiple CD scenarios
 * 
 * @param scenarios - Array of CD scenarios to compare
 * @returns Comparison results with best options highlighted
 */
export function compareCDScenarios(scenarios: CDScenario[]): CDComparisonResult {
  if (scenarios.length < 2) {
    throw new Error('At least 2 scenarios are required for comparison');
  }
  
  const results = scenarios.map((scenario) => ({
    label: scenario.label,
    inputs: scenario.inputs,
    result: calculateCD(scenario.inputs),
  }));
  
  // Find best by total interest
  let bestByInterest = 0;
  let maxInterest = results[0].result.totalInterest;
  let minInterest = maxInterest;
  
  // Find best by effective yield (interest per month normalized)
  let bestByYield = 0;
  let maxYield = results[0].result.effectiveAnnualRate;
  
  results.forEach((result, index) => {
    if (result.result.totalInterest > maxInterest) {
      maxInterest = result.result.totalInterest;
      bestByInterest = index;
    }
    if (result.result.totalInterest < minInterest) {
      minInterest = result.result.totalInterest;
    }
    if (result.result.effectiveAnnualRate > maxYield) {
      maxYield = result.result.effectiveAnnualRate;
      bestByYield = index;
    }
  });
  
  return {
    scenarios: results,
    bestByInterest,
    bestByYield,
    interestDifference: maxInterest - minInterest,
  };
}

/**
 * Quick CD calculation for simple use cases
 * 
 * @param principal - Initial deposit
 * @param apy - Annual Percentage Yield as decimal
 * @param termMonths - Term in months
 * @returns Simplified result with key values
 */
export function quickCDCalculation(
  principal: number,
  apy: number,
  termMonths: number
): { maturityValue: number; totalInterest: number; interestPerMonth: number } {
  const result = calculateCD({ principal, apy, termMonths });
  return {
    maturityValue: result.maturityValue,
    totalInterest: result.totalInterest,
    interestPerMonth: result.interestPerMonth,
  };
}

/**
 * Get typical early withdrawal penalty for a given term
 * 
 * @param termMonths - CD term in months
 * @returns Typical penalty configuration
 */
export function getTypicalPenalty(termMonths: number): EarlyWithdrawalPenalty {
  if (termMonths <= 6) {
    return TYPICAL_PENALTIES['6-months'];
  } else if (termMonths <= 12) {
    return TYPICAL_PENALTIES['12-months'];
  } else if (termMonths <= 24) {
    return TYPICAL_PENALTIES['24-months'];
  } else if (termMonths <= 36) {
    return TYPICAL_PENALTIES['36-months'];
  } else {
    return TYPICAL_PENALTIES['60-months'];
  }
}
