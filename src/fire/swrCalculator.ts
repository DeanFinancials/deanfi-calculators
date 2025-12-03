/**
 * Safe Withdrawal Rate (SWR) Calculator
 * 
 * Comprehensive analysis of portfolio withdrawal strategies based on the Trinity Study,
 * historical market data, and Monte Carlo simulation. Features sequence of returns risk
 * visualization, variable withdrawal strategies (guardrails, dynamic spending), and
 * multi-scenario comparison.
 * 
 * @see https://www.npmjs.com/package/@deanfinancials/calculators
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Portfolio allocation type
 */
export type PortfolioAllocation = 
  | '100-0'    // 100% stocks, 0% bonds
  | '75-25'    // 75% stocks, 25% bonds
  | '60-40'    // 60% stocks, 40% bonds (traditional)
  | '50-50'    // 50% stocks, 50% bonds
  | '25-75'    // 25% stocks, 75% bonds
  | '0-100';   // 0% stocks, 100% bonds

/**
 * Withdrawal strategy type
 */
export type SWRWithdrawalStrategy = 
  | 'fixed'       // Traditional 4% rule - fixed inflation-adjusted withdrawal
  | 'percentage'  // Fixed percentage of current portfolio each year
  | 'guardrails'  // Guyton-Klinger guardrails approach
  | 'dynamic'     // Variable percentage based on portfolio performance
  | 'floor-ceiling'; // Floor/ceiling with adjustments

/**
 * Simulation method type
 */
export type SimulationMethod = 
  | 'historical'   // Use actual historical sequences
  | 'monte-carlo'; // Random sampling with market assumptions

/**
 * Input parameters for SWR calculation
 */
export interface SWRInputs {
  /** Initial portfolio value */
  portfolioValue: number;
  /** Annual withdrawal amount (or initial for variable strategies) */
  annualWithdrawal: number;
  /** Retirement duration in years (default: 30) */
  retirementYears?: number;
  /** Portfolio allocation (default: '60-40') */
  allocation?: PortfolioAllocation;
  /** Withdrawal strategy (default: 'fixed') */
  strategy?: SWRWithdrawalStrategy;
  /** Simulation method (default: 'historical') */
  simulationMethod?: SimulationMethod;
  /** Expected inflation rate (default: 3%) */
  inflationRate?: number;
  /** Number of Monte Carlo simulations (default: 10000) */
  monteCarloRuns?: number;
  /** For guardrails: upper guardrail (default: 20% above initial) */
  upperGuardrail?: number;
  /** For guardrails: lower guardrail (default: 20% below initial) */
  lowerGuardrail?: number;
  /** For guardrails: adjustment percentage when hitting guardrails (default: 10%) */
  guardrailAdjustment?: number;
  /** For floor-ceiling: minimum annual withdrawal */
  floorWithdrawal?: number;
  /** For floor-ceiling: maximum annual withdrawal */
  ceilingWithdrawal?: number;
  /** Include supplemental income (Social Security, pension) */
  supplementalIncome?: number;
  /** Age when supplemental income begins */
  supplementalIncomeStartYear?: number;
}

/**
 * Yearly simulation data point
 */
export interface SWRYearlyData {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Portfolio value at start of year */
  startBalance: number;
  /** Withdrawal amount for the year */
  withdrawal: number;
  /** Investment return for the year (percentage as decimal) */
  returnRate: number;
  /** Portfolio value at end of year */
  endBalance: number;
  /** Inflation-adjusted withdrawal amount */
  realWithdrawal: number;
  /** Cumulative inflation factor */
  inflationFactor: number;
  /** Whether portfolio survived this year */
  survived: boolean;
  /** Supplemental income this year */
  supplementalIncome: number;
}

/**
 * Single simulation result
 */
export interface SimulationResult {
  /** Unique identifier for this simulation */
  id: number;
  /** Starting year (for historical) or simulation number */
  startingYear: number;
  /** Whether portfolio survived full period */
  survived: boolean;
  /** Year portfolio was depleted (null if survived) */
  depletedYear: number | null;
  /** Final portfolio value (0 if depleted) */
  finalBalance: number;
  /** Lowest portfolio balance reached */
  lowestBalance: number;
  /** Year of lowest balance */
  lowestBalanceYear: number;
  /** Total withdrawals made */
  totalWithdrawals: number;
  /** Average annual withdrawal */
  averageWithdrawal: number;
  /** Terminal wealth ratio (final/initial) */
  terminalWealthRatio: number;
  /** Year-by-year data */
  yearlyData: SWRYearlyData[];
}

/**
 * Success rate at a specific withdrawal rate
 */
export interface WithdrawalRateSuccess {
  /** Withdrawal rate (as decimal, e.g., 0.04 for 4%) */
  withdrawalRate: number;
  /** Percentage label (e.g., "4.0%") */
  label: string;
  /** Success rate (0-100) */
  successRate: number;
  /** Number of successful simulations */
  successfulRuns: number;
  /** Total number of simulations */
  totalRuns: number;
  /** Average final balance for successful runs */
  averageFinalBalance: number;
  /** Median final balance */
  medianFinalBalance: number;
  /** 10th percentile outcome */
  percentile10: number;
  /** 25th percentile outcome */
  percentile25: number;
  /** 50th percentile (median) outcome */
  percentile50: number;
  /** 75th percentile outcome */
  percentile75: number;
  /** 90th percentile outcome */
  percentile90: number;
}

/**
 * Comparison of different time horizons
 */
export interface TimeHorizonComparison {
  /** Retirement duration in years */
  years: number;
  /** Success rates at different withdrawal rates */
  successRates: {
    rate: number;
    label: string;
    successRate: number;
  }[];
  /** Recommended safe withdrawal rate for this horizon */
  recommendedSWR: number;
  /** Description */
  description: string;
}

/**
 * Sequence of returns risk analysis
 */
export interface SequenceRiskAnalysis {
  /** Best starting years (highest final balance) */
  bestStartingYears: {
    year: number;
    finalBalance: number;
    lowestBalance: number;
  }[];
  /** Worst starting years (portfolio depleted or lowest final) */
  worstStartingYears: {
    year: number;
    finalBalance: number | null;
    yearDepleted: number | null;
  }[];
  /** Impact of first 5 years returns on outcomes */
  earlyReturnsImpact: {
    earlyReturnsAboveAverage: { successRate: number; avgFinalBalance: number };
    earlyReturnsBelowAverage: { successRate: number; avgFinalBalance: number };
  };
  /** Risk mitigation recommendations */
  recommendations: string[];
}

/**
 * What-If scenario for comparison (UNIQUE FEATURE)
 */
export interface WhatIfScenario {
  /** Scenario name */
  name: string;
  /** Scenario inputs */
  inputs: Partial<SWRInputs>;
  /** Success rate for this scenario */
  successRate: number;
  /** Average final balance */
  averageFinalBalance: number;
  /** Years until depletion (worst case) */
  worstCaseYears: number;
  /** Median outcome */
  medianFinalBalance: number;
  /** Color for visualization */
  color: string;
  /** Key insights about this scenario */
  insights: string[];
}

/**
 * Main SWR calculation result
 */
export interface SWRResult {
  // Core Results
  /** Current withdrawal rate (annual withdrawal / portfolio) */
  withdrawalRate: number;
  /** Withdrawal rate as percentage string */
  withdrawalRateLabel: string;
  /** Overall success rate (percentage 0-100) */
  successRate: number;
  /** Number of successful simulations */
  successfulSimulations: number;
  /** Total number of simulations */
  totalSimulations: number;
  
  // Outcome Distribution
  /** Average final portfolio balance */
  averageFinalBalance: number;
  /** Median final portfolio balance */
  medianFinalBalance: number;
  /** Standard deviation of final balances */
  standardDeviation: number;
  /** Percentile outcomes (10th, 25th, 50th, 75th, 90th) */
  percentileOutcomes: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  
  // Withdrawal Rate Comparison
  /** Success rates at different withdrawal rates (3%, 3.5%, 4%, 4.5%, 5%) */
  withdrawalRateComparison: WithdrawalRateSuccess[];
  /** Maximum safe withdrawal rate (95%+ success) */
  maxSafeWithdrawalRate: number;
  /** Recommended withdrawal rate based on inputs */
  recommendedWithdrawalRate: number;
  
  // Time Horizon Analysis
  /** Comparison across 30, 40, 50-year horizons */
  timeHorizonComparison: TimeHorizonComparison[];
  
  // Sequence of Returns Risk
  /** Sequence of returns risk analysis */
  sequenceRiskAnalysis: SequenceRiskAnalysis;
  
  // Individual Simulations (for visualization)
  /** Detailed results of each simulation */
  simulations: SimulationResult[];
  /** Worst case simulation */
  worstCase: SimulationResult;
  /** Best case simulation */
  bestCase: SimulationResult;
  /** Median case simulation */
  medianCase: SimulationResult;
  
  // Strategy Analysis
  /** Current strategy being used */
  strategy: SWRWithdrawalStrategy;
  /** Comparison with other strategies */
  strategyComparison: {
    strategy: SWRWithdrawalStrategy;
    successRate: number;
    averageWithdrawal: number;
    volatility: number;
  }[];
  
  // UNIQUE FEATURE: What-If Scenario Comparator
  /** Compare up to 4 scenarios simultaneously */
  whatIfScenarios: WhatIfScenario[];
  
  // Recommendations
  /** Personalized recommendations */
  recommendations: string[];
  /** Warnings about the plan */
  warnings: string[];
  /** Summary text */
  summary: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Historical annual returns by asset class (1926-2023)
 * Source: Various academic studies and market data
 */
export const HISTORICAL_RETURNS = {
  // Stocks (S&P 500 or equivalent)
  stocks: [
    11.62, 37.49, 43.61, -8.42, -24.90, -43.34, -8.19, 53.99, -1.44, 47.67,
    33.92, -35.03, 31.12, -0.41, -9.78, -11.59, 20.34, 25.90, 19.75, 36.44,
    -8.07, 5.71, 5.50, 18.79, 31.71, 24.02, 18.37, -0.99, 52.62, 31.56,
    6.56, -10.78, 43.36, 11.96, 0.47, 26.89, -8.73, 22.80, 16.48, 12.45,
    -10.06, 23.98, 11.06, -8.50, 3.91, 14.31, 18.98, -14.66, -26.47, 37.20,
    23.84, -7.18, 6.56, 18.44, 32.50, -4.91, 21.55, 22.56, 6.27, 31.73,
    18.67, 5.25, 16.61, 31.69, -3.10, 30.47, 7.62, 10.08, 1.32, 37.58,
    22.96, 33.36, 28.58, 21.04, -9.10, -11.89, -22.10, 28.68, 10.88, 4.91,
    15.79, 5.49, -37.00, 26.46, 15.06, 2.11, 16.00, 32.39, 13.69, 1.38,
    11.96, 21.83, -4.38, 31.49, 18.40, 28.71, -18.11, 26.29
  ],
  // Bonds (10-year Treasury or aggregate bond)
  bonds: [
    7.77, 8.93, 0.10, 3.42, 4.66, 16.84, -0.07, 10.03, 13.84, 4.98,
    7.52, 0.23, 5.53, 5.94, 6.09, -0.10, 3.22, 1.93, 2.81, -1.34,
    -0.10, 7.46, -2.22, 3.40, 0.06, 3.84, 7.19, -0.78, 1.02, -1.29,
    11.64, -2.35, 3.86, -2.26, 16.75, 0.97, 3.20, -1.20, 15.98, 9.79,
    2.82, 0.67, 5.00, 6.18, 12.11, 3.75, 15.00, -1.18, -3.06, 23.48,
    -3.92, 16.00, 32.27, 3.67, 13.73, 24.44, -4.96, 8.22, 17.69, 6.24,
    15.00, -0.82, 8.96, 14.21, -7.77, 23.22, 1.43, 9.94, 14.92, -8.25,
    16.66, 5.57, 9.42, 11.63, 8.44, 8.06, 10.25, 4.34, 2.43, 4.49,
    10.27, 5.24, 6.97, -2.02, 6.54, 7.84, 2.21, -2.15, 0.55, 10.75,
    -0.02, 3.54, 8.72, -1.54, 7.51, -1.54, -13.01, 3.96
  ]
} as const;

/**
 * Trinity Study success rates (30-year period, various allocations)
 */
export const TRINITY_STUDY_RATES: Record<PortfolioAllocation, Record<string, number>> = {
  '100-0': { '0.03': 98, '0.035': 95, '0.04': 89, '0.045': 78, '0.05': 67 },
  '75-25': { '0.03': 100, '0.035': 98, '0.04': 95, '0.045': 85, '0.05': 74 },
  '60-40': { '0.03': 100, '0.035': 100, '0.04': 95, '0.045': 89, '0.05': 78 },
  '50-50': { '0.03': 100, '0.035': 100, '0.04': 96, '0.045': 89, '0.05': 76 },
  '25-75': { '0.03': 100, '0.035': 100, '0.04': 93, '0.045': 80, '0.05': 62 },
  '0-100': { '0.03': 100, '0.035': 95, '0.04': 71, '0.045': 44, '0.05': 24 }
};

/**
 * Expected returns by allocation
 */
export const EXPECTED_RETURNS: Record<PortfolioAllocation, { mean: number; stdDev: number }> = {
  '100-0': { mean: 0.10, stdDev: 0.18 },
  '75-25': { mean: 0.085, stdDev: 0.14 },
  '60-40': { mean: 0.075, stdDev: 0.11 },
  '50-50': { mean: 0.07, stdDev: 0.10 },
  '25-75': { mean: 0.055, stdDev: 0.07 },
  '0-100': { mean: 0.04, stdDev: 0.05 }
};

/**
 * Colors for withdrawal rate visualization
 */
export const SWR_COLORS = {
  safe: '#10b981',      // Green - 95%+ success
  moderate: '#3b82f6',  // Blue - 85-95% success
  risky: '#f59e0b',     // Orange - 70-85% success
  dangerous: '#ef4444'  // Red - <70% success
} as const;

/**
 * Scenario colors for What-If comparisons
 */
export const SCENARIO_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#8b5cf6'  // Purple
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get blended return for a portfolio allocation
 */
export function getBlendedReturn(
  allocation: PortfolioAllocation,
  yearIndex: number
): number {
  const [stockPct] = allocation.split('-').map(Number);
  const stockWeight = stockPct / 100;
  const bondWeight = 1 - stockWeight;
  
  const stockReturn = HISTORICAL_RETURNS.stocks[yearIndex % HISTORICAL_RETURNS.stocks.length] / 100;
  const bondReturn = HISTORICAL_RETURNS.bonds[yearIndex % HISTORICAL_RETURNS.bonds.length] / 100;
  
  return stockReturn * stockWeight + bondReturn * bondWeight;
}

/**
 * Generate a random return using normal distribution
 */
export function generateRandomReturn(mean: number, stdDev: number): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}

/**
 * Calculate percentile from sorted array
 */
export function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squaredDiffs = arr.map(x => Math.pow(x - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage
 */
function formatPercent(rate: number, decimals: number = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

// ============================================================================
// Core Simulation Functions
// ============================================================================

/**
 * Run a single historical simulation starting from a specific year
 */
export function runHistoricalSimulation(
  inputs: Required<Pick<SWRInputs, 'portfolioValue' | 'annualWithdrawal' | 'retirementYears' | 'allocation' | 'strategy' | 'inflationRate'>> & Partial<SWRInputs>,
  startYearIndex: number
): SimulationResult {
  const {
    portfolioValue,
    annualWithdrawal,
    retirementYears,
    allocation,
    strategy,
    inflationRate,
    upperGuardrail = 0.2,
    lowerGuardrail = 0.2,
    guardrailAdjustment = 0.1,
    floorWithdrawal,
    ceilingWithdrawal,
    supplementalIncome = 0,
    supplementalIncomeStartYear = 999
  } = inputs;
  
  const yearlyData: SWRYearlyData[] = [];
  let balance = portfolioValue;
  let currentWithdrawal = annualWithdrawal;
  const initialWithdrawal = annualWithdrawal;
  let inflationFactor = 1;
  let lowestBalance = balance;
  let lowestBalanceYear = 0;
  let totalWithdrawals = 0;
  let survived = true;
  let depletedYear: number | null = null;
  
  for (let year = 1; year <= retirementYears; year++) {
    const startBalance = balance;
    
    // Get return for this year
    const yearIndex = startYearIndex + year - 1;
    const returnRate = getBlendedReturn(allocation, yearIndex);
    
    // Calculate supplemental income
    const suppIncome = year >= supplementalIncomeStartYear ? supplementalIncome : 0;
    
    // Update inflation
    inflationFactor *= (1 + inflationRate);
    
    // Calculate withdrawal based on strategy
    let withdrawal = currentWithdrawal;
    
    switch (strategy) {
      case 'fixed':
        // Traditional: initial withdrawal adjusted for inflation
        withdrawal = initialWithdrawal * inflationFactor;
        break;
        
      case 'percentage':
        // Fixed percentage of current portfolio
        withdrawal = startBalance * (annualWithdrawal / portfolioValue);
        break;
        
      case 'guardrails':
        // Guyton-Klinger guardrails
        const expectedWithdrawal = initialWithdrawal * inflationFactor;
        const currentRate = expectedWithdrawal / startBalance;
        const initialRate = initialWithdrawal / portfolioValue;
        
        if (currentRate > initialRate * (1 + upperGuardrail)) {
          // Hit upper guardrail - reduce withdrawal
          withdrawal = expectedWithdrawal * (1 - guardrailAdjustment);
          currentWithdrawal = withdrawal / inflationFactor;
        } else if (currentRate < initialRate * (1 - lowerGuardrail)) {
          // Hit lower guardrail - can increase withdrawal
          withdrawal = expectedWithdrawal * (1 + guardrailAdjustment);
          currentWithdrawal = withdrawal / inflationFactor;
        } else {
          withdrawal = expectedWithdrawal;
        }
        break;
        
      case 'dynamic':
        // Dynamic: percentage varies with portfolio performance
        const baseRate = annualWithdrawal / portfolioValue;
        const portfolioRatio = startBalance / portfolioValue;
        // Withdraw less if portfolio is down, more if up
        const dynamicRate = baseRate * (0.8 + 0.4 * Math.min(2, portfolioRatio));
        withdrawal = startBalance * dynamicRate;
        break;
        
      case 'floor-ceiling':
        // Floor-ceiling approach
        const targetWithdrawal = initialWithdrawal * inflationFactor;
        const floor = floorWithdrawal ?? targetWithdrawal * 0.8;
        const ceiling = ceilingWithdrawal ?? targetWithdrawal * 1.2;
        
        // Start with percentage-based withdrawal
        const pctWithdrawal = startBalance * (annualWithdrawal / portfolioValue);
        withdrawal = Math.max(floor, Math.min(ceiling, pctWithdrawal));
        break;
    }
    
    // Reduce withdrawal by supplemental income
    const netWithdrawal = Math.max(0, withdrawal - suppIncome);
    
    // Apply withdrawal and return
    balance = startBalance - netWithdrawal;
    balance = balance * (1 + returnRate);
    
    // Track lowest balance
    if (balance < lowestBalance && balance > 0) {
      lowestBalance = balance;
      lowestBalanceYear = year;
    }
    
    totalWithdrawals += withdrawal;
    
    // Check if depleted
    if (balance <= 0) {
      survived = false;
      depletedYear = year;
      balance = 0;
      
      // Fill remaining years with zeros
      yearlyData.push({
        year,
        startBalance,
        withdrawal,
        returnRate,
        endBalance: 0,
        realWithdrawal: withdrawal / inflationFactor,
        inflationFactor,
        survived: false,
        supplementalIncome: suppIncome
      });
      
      // Add empty years for remaining period
      for (let remainingYear = year + 1; remainingYear <= retirementYears; remainingYear++) {
        yearlyData.push({
          year: remainingYear,
          startBalance: 0,
          withdrawal: 0,
          returnRate: 0,
          endBalance: 0,
          realWithdrawal: 0,
          inflationFactor: inflationFactor * Math.pow(1 + inflationRate, remainingYear - year),
          survived: false,
          supplementalIncome: 0
        });
      }
      break;
    }
    
    yearlyData.push({
      year,
      startBalance,
      withdrawal,
      returnRate,
      endBalance: balance,
      realWithdrawal: withdrawal / inflationFactor,
      inflationFactor,
      survived: true,
      supplementalIncome: suppIncome
    });
  }
  
  return {
    id: startYearIndex,
    startingYear: 1926 + startYearIndex,
    survived,
    depletedYear,
    finalBalance: balance,
    lowestBalance,
    lowestBalanceYear,
    totalWithdrawals,
    averageWithdrawal: totalWithdrawals / retirementYears,
    terminalWealthRatio: balance / portfolioValue,
    yearlyData
  };
}

/**
 * Run a single Monte Carlo simulation
 */
export function runMonteCarloSimulation(
  inputs: Required<Pick<SWRInputs, 'portfolioValue' | 'annualWithdrawal' | 'retirementYears' | 'allocation' | 'strategy' | 'inflationRate'>> & Partial<SWRInputs>,
  simulationId: number
): SimulationResult {
  const {
    portfolioValue,
    annualWithdrawal,
    retirementYears,
    allocation,
    strategy,
    inflationRate,
    upperGuardrail = 0.2,
    lowerGuardrail = 0.2,
    guardrailAdjustment = 0.1,
    floorWithdrawal,
    ceilingWithdrawal,
    supplementalIncome = 0,
    supplementalIncomeStartYear = 999
  } = inputs;
  
  const { mean, stdDev } = EXPECTED_RETURNS[allocation];
  
  const yearlyData: SWRYearlyData[] = [];
  let balance = portfolioValue;
  let currentWithdrawal = annualWithdrawal;
  const initialWithdrawal = annualWithdrawal;
  let inflationFactor = 1;
  let lowestBalance = balance;
  let lowestBalanceYear = 0;
  let totalWithdrawals = 0;
  let survived = true;
  let depletedYear: number | null = null;
  
  for (let year = 1; year <= retirementYears; year++) {
    const startBalance = balance;
    
    // Generate random return
    const returnRate = generateRandomReturn(mean, stdDev);
    
    // Calculate supplemental income
    const suppIncome = year >= supplementalIncomeStartYear ? supplementalIncome : 0;
    
    // Update inflation
    inflationFactor *= (1 + inflationRate);
    
    // Calculate withdrawal based on strategy (same logic as historical)
    let withdrawal = currentWithdrawal;
    
    switch (strategy) {
      case 'fixed':
        withdrawal = initialWithdrawal * inflationFactor;
        break;
      case 'percentage':
        withdrawal = startBalance * (annualWithdrawal / portfolioValue);
        break;
      case 'guardrails':
        const expectedWithdrawal = initialWithdrawal * inflationFactor;
        const currentRate = expectedWithdrawal / startBalance;
        const initialRate = initialWithdrawal / portfolioValue;
        if (currentRate > initialRate * (1 + upperGuardrail)) {
          withdrawal = expectedWithdrawal * (1 - guardrailAdjustment);
          currentWithdrawal = withdrawal / inflationFactor;
        } else if (currentRate < initialRate * (1 - lowerGuardrail)) {
          withdrawal = expectedWithdrawal * (1 + guardrailAdjustment);
          currentWithdrawal = withdrawal / inflationFactor;
        } else {
          withdrawal = expectedWithdrawal;
        }
        break;
      case 'dynamic':
        const baseRate = annualWithdrawal / portfolioValue;
        const portfolioRatio = startBalance / portfolioValue;
        const dynamicRate = baseRate * (0.8 + 0.4 * Math.min(2, portfolioRatio));
        withdrawal = startBalance * dynamicRate;
        break;
      case 'floor-ceiling':
        const targetWithdrawal = initialWithdrawal * inflationFactor;
        const floor = floorWithdrawal ?? targetWithdrawal * 0.8;
        const ceiling = ceilingWithdrawal ?? targetWithdrawal * 1.2;
        const pctWithdrawal = startBalance * (annualWithdrawal / portfolioValue);
        withdrawal = Math.max(floor, Math.min(ceiling, pctWithdrawal));
        break;
    }
    
    const netWithdrawal = Math.max(0, withdrawal - suppIncome);
    balance = startBalance - netWithdrawal;
    balance = balance * (1 + returnRate);
    
    if (balance < lowestBalance && balance > 0) {
      lowestBalance = balance;
      lowestBalanceYear = year;
    }
    
    totalWithdrawals += withdrawal;
    
    if (balance <= 0) {
      survived = false;
      depletedYear = year;
      balance = 0;
      
      yearlyData.push({
        year,
        startBalance,
        withdrawal,
        returnRate,
        endBalance: 0,
        realWithdrawal: withdrawal / inflationFactor,
        inflationFactor,
        survived: false,
        supplementalIncome: suppIncome
      });
      
      for (let remainingYear = year + 1; remainingYear <= retirementYears; remainingYear++) {
        yearlyData.push({
          year: remainingYear,
          startBalance: 0,
          withdrawal: 0,
          returnRate: 0,
          endBalance: 0,
          realWithdrawal: 0,
          inflationFactor: inflationFactor * Math.pow(1 + inflationRate, remainingYear - year),
          survived: false,
          supplementalIncome: 0
        });
      }
      break;
    }
    
    yearlyData.push({
      year,
      startBalance,
      withdrawal,
      returnRate,
      endBalance: balance,
      realWithdrawal: withdrawal / inflationFactor,
      inflationFactor,
      survived: true,
      supplementalIncome: suppIncome
    });
  }
  
  return {
    id: simulationId,
    startingYear: simulationId,
    survived,
    depletedYear,
    finalBalance: balance,
    lowestBalance,
    lowestBalanceYear,
    totalWithdrawals,
    averageWithdrawal: totalWithdrawals / retirementYears,
    terminalWealthRatio: balance / portfolioValue,
    yearlyData
  };
}

/**
 * Run all simulations (historical or Monte Carlo)
 */
export function runAllSimulations(
  inputs: SWRInputs
): SimulationResult[] {
  const {
    portfolioValue,
    annualWithdrawal,
    retirementYears = 30,
    allocation = '60-40',
    strategy = 'fixed',
    simulationMethod = 'historical',
    inflationRate = 0.03,
    monteCarloRuns = 10000
  } = inputs;
  
  const baseInputs = {
    ...inputs,
    portfolioValue,
    annualWithdrawal,
    retirementYears,
    allocation,
    strategy,
    inflationRate
  };
  
  if (simulationMethod === 'historical') {
    // Run historical simulations for all available starting years
    const maxStartYear = HISTORICAL_RETURNS.stocks.length - retirementYears;
    const simulations: SimulationResult[] = [];
    
    for (let i = 0; i <= maxStartYear; i++) {
      simulations.push(runHistoricalSimulation(baseInputs, i));
    }
    
    return simulations;
  } else {
    // Run Monte Carlo simulations
    const simulations: SimulationResult[] = [];
    
    for (let i = 0; i < monteCarloRuns; i++) {
      simulations.push(runMonteCarloSimulation(baseInputs, i));
    }
    
    return simulations;
  }
}

/**
 * Calculate success rates for different withdrawal rates
 */
export function calculateWithdrawalRateComparison(
  inputs: SWRInputs,
  rates: number[] = [0.03, 0.035, 0.04, 0.045, 0.05]
): WithdrawalRateSuccess[] {
  return rates.map(rate => {
    const testInputs = {
      ...inputs,
      annualWithdrawal: inputs.portfolioValue * rate
    };
    
    const simulations = runAllSimulations(testInputs);
    const successfulSims = simulations.filter(s => s.survived);
    const finalBalances = simulations.map(s => s.finalBalance).sort((a, b) => a - b);
    
    return {
      withdrawalRate: rate,
      label: formatPercent(rate),
      successRate: (successfulSims.length / simulations.length) * 100,
      successfulRuns: successfulSims.length,
      totalRuns: simulations.length,
      averageFinalBalance: successfulSims.length > 0 
        ? successfulSims.reduce((sum, s) => sum + s.finalBalance, 0) / successfulSims.length 
        : 0,
      medianFinalBalance: percentile(finalBalances, 50),
      percentile10: percentile(finalBalances, 10),
      percentile25: percentile(finalBalances, 25),
      percentile50: percentile(finalBalances, 50),
      percentile75: percentile(finalBalances, 75),
      percentile90: percentile(finalBalances, 90)
    };
  });
}

/**
 * Calculate time horizon comparison
 */
export function calculateTimeHorizonComparison(
  inputs: SWRInputs,
  horizons: number[] = [30, 40, 50]
): TimeHorizonComparison[] {
  return horizons.map(years => {
    const testInputs = { ...inputs, retirementYears: years };
    const rates = [0.03, 0.035, 0.04, 0.045, 0.05];
    
    const successRates = rates.map(rate => {
      const simInputs = {
        ...testInputs,
        annualWithdrawal: inputs.portfolioValue * rate
      };
      const simulations = runAllSimulations(simInputs);
      const successCount = simulations.filter(s => s.survived).length;
      
      return {
        rate,
        label: formatPercent(rate),
        successRate: (successCount / simulations.length) * 100
      };
    });
    
    // Find recommended SWR (highest rate with 95%+ success)
    const recommendedSWR = successRates
      .filter(r => r.successRate >= 95)
      .sort((a, b) => b.rate - a.rate)[0]?.rate ?? 0.03;
    
    return {
      years,
      successRates,
      recommendedSWR,
      description: years <= 30 
        ? 'Traditional retirement horizon'
        : years <= 40 
        ? 'Early retirement horizon' 
        : 'Very early retirement / FIRE horizon'
    };
  });
}

/**
 * Analyze sequence of returns risk
 */
export function analyzeSequenceRisk(
  simulations: SimulationResult[]
): SequenceRiskAnalysis {
  // Sort by final balance
  const sortedByFinal = [...simulations].sort((a, b) => b.finalBalance - a.finalBalance);
  
  // Best starting years
  const bestStartingYears = sortedByFinal.slice(0, 5).map(s => ({
    year: s.startingYear,
    finalBalance: s.finalBalance,
    lowestBalance: s.lowestBalance
  }));
  
  // Worst starting years
  const worstStartingYears = sortedByFinal.slice(-5).reverse().map(s => ({
    year: s.startingYear,
    finalBalance: s.survived ? s.finalBalance : null,
    yearDepleted: s.depletedYear
  }));
  
  // Analyze impact of early returns
  const avgReturn = simulations.reduce((sum, s) => {
    const early5Returns = s.yearlyData.slice(0, 5).reduce((rSum, y) => rSum + y.returnRate, 0) / 5;
    return sum + early5Returns;
  }, 0) / simulations.length;
  
  const aboveAvgEarly = simulations.filter(s => {
    const early5Returns = s.yearlyData.slice(0, 5).reduce((rSum, y) => rSum + y.returnRate, 0) / 5;
    return early5Returns >= avgReturn;
  });
  
  const belowAvgEarly = simulations.filter(s => {
    const early5Returns = s.yearlyData.slice(0, 5).reduce((rSum, y) => rSum + y.returnRate, 0) / 5;
    return early5Returns < avgReturn;
  });
  
  const earlyReturnsImpact = {
    earlyReturnsAboveAverage: {
      successRate: (aboveAvgEarly.filter(s => s.survived).length / aboveAvgEarly.length) * 100,
      avgFinalBalance: aboveAvgEarly.reduce((sum, s) => sum + s.finalBalance, 0) / aboveAvgEarly.length
    },
    earlyReturnsBelowAverage: {
      successRate: (belowAvgEarly.filter(s => s.survived).length / belowAvgEarly.length) * 100,
      avgFinalBalance: belowAvgEarly.reduce((sum, s) => sum + s.finalBalance, 0) / belowAvgEarly.length
    }
  };
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  const successRateDiff = earlyReturnsImpact.earlyReturnsAboveAverage.successRate - 
                          earlyReturnsImpact.earlyReturnsBelowAverage.successRate;
  
  if (successRateDiff > 10) {
    recommendations.push(
      'Early returns significantly impact outcomes. Consider a bond tent (higher bonds early, shifting to stocks) to reduce sequence risk.'
    );
  }
  
  recommendations.push(
    'Keep 1-2 years of expenses in cash/short-term bonds to avoid selling stocks during downturns.'
  );
  
  recommendations.push(
    'Consider flexible spending - reduce withdrawals by 10-20% in down years to dramatically improve success rates.'
  );
  
  if (worstStartingYears.some(y => y.year && y.year >= 1929 && y.year <= 1932)) {
    recommendations.push(
      'Worst historical outcomes came from starting retirement just before major crashes (1929, 1966, 2000). Diversification helps but cannot eliminate this risk.'
    );
  }
  
  return {
    bestStartingYears,
    worstStartingYears,
    earlyReturnsImpact,
    recommendations
  };
}

/**
 * Generate What-If scenarios (UNIQUE FEATURE)
 */
export function generateWhatIfScenarios(
  baseInputs: SWRInputs,
  scenarios?: Partial<SWRInputs>[]
): WhatIfScenario[] {
  // Default scenarios if none provided
  const defaultScenarios: { name: string; inputs: Partial<SWRInputs> }[] = [
    {
      name: 'Current Plan',
      inputs: {}
    },
    {
      name: '3.5% Withdrawal Rate',
      inputs: { annualWithdrawal: baseInputs.portfolioValue * 0.035 }
    },
    {
      name: 'Guardrails Strategy',
      inputs: { strategy: 'guardrails' as SWRWithdrawalStrategy }
    },
    {
      name: 'More Conservative (50/50)',
      inputs: { allocation: '50-50' as PortfolioAllocation }
    }
  ];
  
  const scenariosToRun = scenarios 
    ? scenarios.map((s, i) => ({ name: `Scenario ${i + 1}`, inputs: s }))
    : defaultScenarios;
  
  return scenariosToRun.map((scenario, index) => {
    const testInputs = { ...baseInputs, ...scenario.inputs };
    const simulations = runAllSimulations(testInputs);
    
    const successfulSims = simulations.filter(s => s.survived);
    const failedSims = simulations.filter(s => !s.survived);
    const finalBalances = simulations.map(s => s.finalBalance).sort((a, b) => a - b);
    
    const successRate = (successfulSims.length / simulations.length) * 100;
    const avgFinalBalance = successfulSims.length > 0
      ? successfulSims.reduce((sum, s) => sum + s.finalBalance, 0) / successfulSims.length
      : 0;
    const worstCaseYears = failedSims.length > 0
      ? Math.min(...failedSims.map(s => s.depletedYear ?? Infinity))
      : testInputs.retirementYears ?? 30;
    
    // Generate insights
    const insights: string[] = [];
    
    if (successRate >= 95) {
      insights.push('High probability of success - conservative and reliable');
    } else if (successRate >= 85) {
      insights.push('Good success rate - reasonable risk level');
    } else if (successRate >= 70) {
      insights.push('Moderate risk - consider reducing withdrawal rate or expenses');
    } else {
      insights.push('High risk of failure - strongly consider adjustments');
    }
    
    if (scenario.inputs.strategy === 'guardrails') {
      insights.push('Guardrails provide spending flexibility while protecting longevity');
    }
    
    if (scenario.inputs.allocation === '50-50' || scenario.inputs.allocation === '25-75') {
      insights.push('More bonds reduce volatility but may limit growth');
    }
    
    return {
      name: scenario.name,
      inputs: scenario.inputs,
      successRate,
      averageFinalBalance: avgFinalBalance,
      worstCaseYears,
      medianFinalBalance: percentile(finalBalances, 50),
      color: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
      insights
    };
  });
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  inputs: SWRInputs,
  successRate: number,
  sequenceRisk: SequenceRiskAnalysis
): string[] {
  const recommendations: string[] = [];
  const withdrawalRate = inputs.annualWithdrawal / inputs.portfolioValue;
  
  if (successRate < 85) {
    recommendations.push(
      `Your current ${formatPercent(withdrawalRate)} withdrawal rate has a ${successRate.toFixed(0)}% success rate. Consider reducing to 3.5% or lower for more safety.`
    );
  }
  
  if (withdrawalRate > 0.04 && (inputs.retirementYears ?? 30) > 30) {
    recommendations.push(
      'With a longer retirement horizon, consider a lower withdrawal rate. The 4% rule was designed for 30-year retirements.'
    );
  }
  
  if (inputs.strategy === 'fixed') {
    recommendations.push(
      'Consider a variable withdrawal strategy like guardrails. Flexibility in down years can dramatically improve success rates.'
    );
  }
  
  if (inputs.allocation === '100-0') {
    recommendations.push(
      'A 100% stock allocation has higher expected returns but also higher volatility. Consider adding bonds for stability, especially in early retirement years.'
    );
  }
  
  if ((inputs.supplementalIncome ?? 0) === 0) {
    recommendations.push(
      'If you expect Social Security or pension income, include it in your analysis. Supplemental income can significantly reduce portfolio withdrawal needs.'
    );
  }
  
  // Add sequence risk recommendations
  recommendations.push(...sequenceRisk.recommendations.slice(0, 2));
  
  return recommendations;
}

/**
 * Generate warnings based on analysis
 */
function generateWarnings(
  inputs: SWRInputs,
  successRate: number
): string[] {
  const warnings: string[] = [];
  const withdrawalRate = inputs.annualWithdrawal / inputs.portfolioValue;
  
  if (withdrawalRate > 0.05) {
    warnings.push(
      `Warning: A ${formatPercent(withdrawalRate)} withdrawal rate is aggressive and has historically failed in many scenarios.`
    );
  }
  
  if (successRate < 70) {
    warnings.push(
      'Your current plan has a high probability of running out of money. Consider significant adjustments.'
    );
  }
  
  if ((inputs.retirementYears ?? 30) > 40 && withdrawalRate > 0.035) {
    warnings.push(
      'For 40+ year retirements, many experts recommend withdrawal rates of 3.5% or lower.'
    );
  }
  
  if (inputs.allocation === '0-100') {
    warnings.push(
      'A 100% bond allocation may not keep pace with inflation over long periods, increasing the risk of running out of money.'
    );
  }
  
  return warnings;
}

// ============================================================================
// Main Calculator Function
// ============================================================================

/**
 * Calculate comprehensive Safe Withdrawal Rate analysis
 */
export function calculateSWR(inputs: SWRInputs): SWRResult {
  const {
    portfolioValue,
    annualWithdrawal,
    retirementYears = 30,
    allocation = '60-40',
    strategy = 'fixed',
    simulationMethod = 'historical',
    inflationRate = 0.03
  } = inputs;
  
  // Calculate withdrawal rate
  const withdrawalRate = annualWithdrawal / portfolioValue;
  
  // Run all simulations
  const simulations = runAllSimulations(inputs);
  
  // Calculate success metrics
  const successfulSims = simulations.filter(s => s.survived);
  const successRate = (successfulSims.length / simulations.length) * 100;
  
  // Calculate outcome distribution
  const finalBalances = simulations.map(s => s.finalBalance);
  const avgFinalBalance = finalBalances.reduce((a, b) => a + b, 0) / finalBalances.length;
  const medianFinalBalance = percentile(finalBalances, 50);
  const stdDev = standardDeviation(finalBalances);
  
  const percentileOutcomes = {
    p10: percentile(finalBalances, 10),
    p25: percentile(finalBalances, 25),
    p50: percentile(finalBalances, 50),
    p75: percentile(finalBalances, 75),
    p90: percentile(finalBalances, 90)
  };
  
  // Withdrawal rate comparison
  const withdrawalRateComparison = calculateWithdrawalRateComparison(inputs);
  
  // Find max safe withdrawal rate (95%+ success)
  const maxSafeWithdrawalRate = withdrawalRateComparison
    .filter(r => r.successRate >= 95)
    .sort((a, b) => b.withdrawalRate - a.withdrawalRate)[0]?.withdrawalRate ?? 0.03;
  
  // Recommended withdrawal rate based on horizon
  const recommendedWithdrawalRate = retirementYears <= 30 ? 0.04 : retirementYears <= 40 ? 0.035 : 0.03;
  
  // Time horizon comparison
  const timeHorizonComparison = calculateTimeHorizonComparison(inputs);
  
  // Sequence risk analysis
  const sequenceRiskAnalysis = analyzeSequenceRisk(simulations);
  
  // Find worst, best, median cases
  const sortedByFinal = [...simulations].sort((a, b) => a.finalBalance - b.finalBalance);
  const worstCase = sortedByFinal[0];
  const bestCase = sortedByFinal[sortedByFinal.length - 1];
  const medianCase = sortedByFinal[Math.floor(sortedByFinal.length / 2)];
  
  // Strategy comparison
  const strategies: SWRWithdrawalStrategy[] = ['fixed', 'percentage', 'guardrails', 'dynamic'];
  const strategyComparison = strategies.map(strat => {
    const testInputs = { ...inputs, strategy: strat };
    const sims = runAllSimulations(testInputs);
    const successful = sims.filter(s => s.survived);
    const withdrawals = sims.flatMap(s => s.yearlyData.map(y => y.withdrawal));
    
    return {
      strategy: strat,
      successRate: (successful.length / sims.length) * 100,
      averageWithdrawal: withdrawals.reduce((a, b) => a + b, 0) / withdrawals.length,
      volatility: standardDeviation(withdrawals)
    };
  });
  
  // What-If scenarios
  const whatIfScenarios = generateWhatIfScenarios(inputs);
  
  // Generate recommendations and warnings
  const recommendations = generateRecommendations(inputs, successRate, sequenceRiskAnalysis);
  const warnings = generateWarnings(inputs, successRate);
  
  // Generate summary
  const summary = successRate >= 95
    ? `Your ${formatPercent(withdrawalRate)} withdrawal rate has a ${successRate.toFixed(0)}% historical success rate over ${retirementYears} years. This is considered safe.`
    : successRate >= 85
    ? `Your ${formatPercent(withdrawalRate)} withdrawal rate has a ${successRate.toFixed(0)}% success rate. Consider a slightly lower rate for more safety margin.`
    : successRate >= 70
    ? `Your ${formatPercent(withdrawalRate)} withdrawal rate has a ${successRate.toFixed(0)}% success rate. This is moderately risky - consider reducing withdrawals or expenses.`
    : `Your ${formatPercent(withdrawalRate)} withdrawal rate has only a ${successRate.toFixed(0)}% success rate. Significant adjustments are recommended.`;
  
  return {
    withdrawalRate,
    withdrawalRateLabel: formatPercent(withdrawalRate),
    successRate,
    successfulSimulations: successfulSims.length,
    totalSimulations: simulations.length,
    averageFinalBalance: avgFinalBalance,
    medianFinalBalance,
    standardDeviation: stdDev,
    percentileOutcomes,
    withdrawalRateComparison,
    maxSafeWithdrawalRate,
    recommendedWithdrawalRate,
    timeHorizonComparison,
    sequenceRiskAnalysis,
    simulations,
    worstCase,
    bestCase,
    medianCase,
    strategy,
    strategyComparison,
    whatIfScenarios,
    recommendations,
    warnings,
    summary
  };
}

// ============================================================================
// Quick Utility Functions
// ============================================================================

/**
 * Quick withdrawal rate calculation
 */
export function quickWithdrawalRate(
  annualWithdrawal: number,
  portfolioValue: number
): number {
  return annualWithdrawal / portfolioValue;
}

/**
 * Quick success rate lookup from Trinity Study
 */
export function quickSuccessRate(
  withdrawalRate: number,
  allocation: PortfolioAllocation = '60-40',
  years: number = 30
): number {
  const rateKey = (Math.round(withdrawalRate * 200) / 200).toFixed(3);
  const baseRate = TRINITY_STUDY_RATES[allocation][rateKey] ?? 
    (withdrawalRate <= 0.03 ? 100 : withdrawalRate >= 0.05 ? 50 : 85);
  
  // Adjust for different time horizons
  if (years > 30) {
    return Math.max(0, baseRate - (years - 30) * 1.5);
  } else if (years < 30) {
    return Math.min(100, baseRate + (30 - years) * 0.5);
  }
  
  return baseRate;
}

/**
 * Calculate safe portfolio withdrawal amount
 */
export function calculateSafeWithdrawal(
  portfolioValue: number,
  withdrawalRate: number = 0.04
): { annual: number; monthly: number } {
  const annual = portfolioValue * withdrawalRate;
  return {
    annual,
    monthly: annual / 12
  };
}

/**
 * Calculate portfolio needed for desired income
 */
export function calculatePortfolioNeeded(
  desiredAnnualIncome: number,
  withdrawalRate: number = 0.04
): number {
  return desiredAnnualIncome / withdrawalRate;
}

/**
 * Compare multiple SWR scenarios quickly
 */
export function compareSWRScenarios(
  baseInputs: SWRInputs,
  scenarios: Array<{ name: string; changes: Partial<SWRInputs> }>
): Array<{ name: string; successRate: number; medianFinalBalance: number }> {
  return scenarios.map(scenario => {
    const testInputs = { ...baseInputs, ...scenario.changes };
    const simulations = runAllSimulations(testInputs);
    const successfulSims = simulations.filter(s => s.survived);
    const finalBalances = simulations.map(s => s.finalBalance);
    
    return {
      name: scenario.name,
      successRate: (successfulSims.length / simulations.length) * 100,
      medianFinalBalance: percentile(finalBalances, 50)
    };
  });
}
