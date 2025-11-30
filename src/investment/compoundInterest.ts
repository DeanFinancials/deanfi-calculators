/**
 * Compound Interest Calculator
 * 
 * Calculates compound interest growth with optional regular contributions.
 * Supports multiple compounding frequencies including continuous compounding.
 * 
 * Formula (discrete): A = P(1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) - 1) / (r/n))
 * Formula (continuous): A = Pe^(rt)
 * 
 * Where:
 * - A = Final amount
 * - P = Principal (initial investment)
 * - r = Annual interest rate (decimal)
 * - n = Compounding frequency per year
 * - t = Time in years
 * - PMT = Regular contribution amount
 * - e = Euler's number (~2.71828)
 */

/**
 * Compounding frequency options
 */
export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | 'continuously';

/**
 * When contributions are made within each period
 */
export type ContributionTiming = 'beginning' | 'end';

/**
 * Input parameters for compound interest calculation
 */
export interface CompoundInterestInputs {
  /** Initial investment amount */
  principal: number;
  /** Annual interest rate as a percentage (e.g., 7 for 7%) */
  annualRate: number;
  /** Investment duration in years */
  years: number;
  /** Monthly contribution amount (optional, defaults to 0) */
  monthlyContribution?: number;
  /** How often interest compounds (optional, defaults to 'monthly') */
  compoundingFrequency?: CompoundingFrequency;
  /** When contributions are made - beginning or end of period (optional, defaults to 'end') */
  contributionTiming?: ContributionTiming;
}

/**
 * Year-by-year breakdown of investment growth
 */
export interface YearlyBreakdown {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Balance at end of year */
  balance: number;
  /** Contributions made during this year */
  contributions: number;
  /** Interest earned during this year */
  interestEarned: number;
  /** Cumulative contributions including principal */
  totalContributions: number;
  /** Cumulative interest earned */
  totalInterest: number;
}

/**
 * Complete results from compound interest calculation
 */
export interface CompoundInterestResult {
  /** Final balance after all years */
  finalBalance: number;
  /** Total amount contributed (principal + all contributions) */
  totalContributions: number;
  /** Total interest earned over the period */
  totalInterest: number;
  /** Effective annual yield considering compounding */
  effectiveAnnualRate: number;
  /** Years to double the principal (Rule of 72) */
  yearsToDouble: number;
  /** Year-by-year breakdown */
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * Get the number of compounding periods per year
 * 
 * @param frequency - Compounding frequency
 * @returns Number of periods per year (Infinity for continuous)
 */
export function getPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'daily':
      return 365;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'semi-annually':
      return 2;
    case 'annually':
      return 1;
    case 'continuously':
      return Infinity;
  }
}

/**
 * Calculate the effective annual rate (APY) given nominal rate and compounding frequency
 * 
 * Formula (discrete): APY = (1 + r/n)^n - 1
 * Formula (continuous): APY = e^r - 1
 * 
 * @param annualRate - Nominal annual rate as percentage (e.g., 7 for 7%)
 * @param frequency - Compounding frequency
 * @returns Effective annual rate as percentage
 */
export function calculateEffectiveAnnualRate(
  annualRate: number,
  frequency: CompoundingFrequency
): number {
  const r = annualRate / 100;
  
  if (frequency === 'continuously') {
    return (Math.exp(r) - 1) * 100;
  }
  
  const n = getPeriodsPerYear(frequency);
  return (Math.pow(1 + r / n, n) - 1) * 100;
}

/**
 * Calculate years to double using the Rule of 72
 * 
 * The Rule of 72 is a simple approximation: Years to double ≈ 72 / interest rate
 * 
 * @param annualRate - Annual interest rate as percentage
 * @returns Approximate years to double the investment
 */
export function calculateYearsToDouble(annualRate: number): number {
  if (annualRate <= 0) return Infinity;
  return 72 / annualRate;
}

/**
 * Calculate compound interest with optional regular contributions
 * 
 * Supports multiple compounding frequencies and contribution timing options.
 * Returns detailed year-by-year breakdown for visualization.
 * 
 * @param inputs - Calculation parameters
 * @returns Complete calculation results with yearly breakdown
 * 
 * @example
 * ```typescript
 * const result = calculateCompoundInterest({
 *   principal: 10000,
 *   annualRate: 7,
 *   years: 30,
 *   monthlyContribution: 500,
 *   compoundingFrequency: 'monthly'
 * });
 * 
 * console.log(result.finalBalance); // ~$610,000
 * console.log(result.totalInterest); // ~$420,000
 * ```
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    monthlyContribution = 0,
    compoundingFrequency = 'monthly',
    contributionTiming = 'end',
  } = inputs;

  // Validate inputs
  if (principal < 0) throw new Error('Principal cannot be negative');
  if (annualRate < 0) throw new Error('Interest rate cannot be negative');
  if (years <= 0) throw new Error('Years must be positive');
  if (monthlyContribution < 0) throw new Error('Monthly contribution cannot be negative');

  const r = annualRate / 100; // Convert percentage to decimal
  const PMT = monthlyContribution * 12; // Annual contribution
  const yearlyBreakdown: YearlyBreakdown[] = [];
  
  let finalBalance: number;

  // Handle continuous compounding separately
  if (compoundingFrequency === 'continuously') {
    // Continuous compounding with contributions approximated
    let runningBalance = principal;
    let totalContributionsAccum = principal;
    let totalInterestAccum = 0;

    for (let year = 1; year <= years; year++) {
      const startBalance = runningBalance;
      
      // Add annual contribution (simplified for continuous)
      const annualContribution = PMT;
      runningBalance += annualContribution;
      
      // Apply continuous compounding: balance * e^r
      const growthFactor = Math.exp(r);
      const newBalance = runningBalance * growthFactor;
      const interestForYear = newBalance - runningBalance;
      
      runningBalance = newBalance;
      totalContributionsAccum += annualContribution;
      totalInterestAccum += interestForYear;

      yearlyBreakdown.push({
        year,
        balance: runningBalance,
        contributions: annualContribution,
        interestEarned: interestForYear,
        totalContributions: totalContributionsAccum,
        totalInterest: totalInterestAccum,
      });
    }
    finalBalance = runningBalance;
  } else {
    // Standard discrete compounding
    const n = getPeriodsPerYear(compoundingFrequency);
    const ratePerPeriod = r / n;
    const contributionsPerPeriod = PMT / n;

    let runningBalance = principal;
    let totalContributionsAccum = principal;
    let totalInterestAccum = 0;

    for (let year = 1; year <= years; year++) {
      let yearlyContribution = 0;
      let yearlyInterest = 0;

      for (let period = 0; period < n; period++) {
        // Beginning of period contribution
        if (contributionTiming === 'beginning') {
          runningBalance += contributionsPerPeriod;
          yearlyContribution += contributionsPerPeriod;
        }
        
        // Apply interest for this period
        const interestForPeriod = runningBalance * ratePerPeriod;
        runningBalance += interestForPeriod;
        yearlyInterest += interestForPeriod;

        // End of period contribution
        if (contributionTiming === 'end') {
          runningBalance += contributionsPerPeriod;
          yearlyContribution += contributionsPerPeriod;
        }
      }

      totalContributionsAccum += yearlyContribution;
      totalInterestAccum += yearlyInterest;

      yearlyBreakdown.push({
        year,
        balance: runningBalance,
        contributions: yearlyContribution,
        interestEarned: yearlyInterest,
        totalContributions: totalContributionsAccum,
        totalInterest: totalInterestAccum,
      });
    }
    finalBalance = runningBalance;
  }

  const totalContributions = principal + (PMT * years);
  const totalInterest = finalBalance - totalContributions;
  const effectiveAnnualRate = calculateEffectiveAnnualRate(annualRate, compoundingFrequency);
  const yearsToDouble = calculateYearsToDouble(annualRate);

  return {
    finalBalance,
    totalContributions,
    totalInterest,
    effectiveAnnualRate,
    yearsToDouble,
    yearlyBreakdown,
  };
}

/**
 * Compare compound interest results across different scenarios
 * 
 * Useful for showing how different rates, contributions, or timeframes
 * affect investment growth.
 * 
 * @param scenarios - Array of input scenarios to compare
 * @returns Array of results, one for each scenario
 * 
 * @example
 * ```typescript
 * const results = compareCompoundInterestScenarios([
 *   { principal: 10000, annualRate: 6, years: 30, monthlyContribution: 500 },
 *   { principal: 10000, annualRate: 8, years: 30, monthlyContribution: 500 },
 *   { principal: 10000, annualRate: 10, years: 30, monthlyContribution: 500 },
 * ]);
 * ```
 */
export function compareCompoundInterestScenarios(
  scenarios: CompoundInterestInputs[]
): CompoundInterestResult[] {
  return scenarios.map(scenario => calculateCompoundInterest(scenario));
}
