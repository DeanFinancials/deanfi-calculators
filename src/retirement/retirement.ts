/**
 * Retirement Planning Calculator
 * 
 * Calculates retirement savings projections using compound interest
 * with monthly contributions and returns.
 */

export interface RetirementScenario {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number; // Annual return as percentage (e.g., 7 for 7%)
}

export interface YearlySnapshot {
  year: number;
  age: number;
  balance: number;
  contributions: number;
  gains: number;
}

export interface RetirementProjection {
  finalBalance: number;
  totalContributions: number;
  totalGains: number;
  yearlySnapshots: YearlySnapshot[];
}

/**
 * Calculate final retirement balance using compound interest
 * 
 * Formula: FV = PV(1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 * Applied monthly: balance = balance × (1 + monthlyRate) + monthlyContribution
 * 
 * @param scenario - Retirement scenario parameters
 * @returns Final projected balance at retirement
 */
export function calculateRetirementBalance(scenario: RetirementScenario): number {
  const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
  const monthlyReturn = scenario.expectedReturn / 100 / 12;
  const months = yearsToRetirement * 12;
  
  let balance = scenario.currentSavings;
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyReturn) + scenario.monthlyContribution;
  }
  
  return Math.round(balance);
}

/**
 * Generate year-by-year projection with balance, contributions, and gains
 * 
 * Shows detailed breakdown of how the retirement account grows over time,
 * separating contributions from investment gains.
 * 
 * @param scenario - Retirement scenario parameters
 * @returns Detailed year-by-year snapshots
 */
export function calculateDetailedProjection(scenario: RetirementScenario): YearlySnapshot[] {
  const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
  const monthlyReturn = scenario.expectedReturn / 100 / 12;
  const snapshots: YearlySnapshot[] = [];
  
  let balance = scenario.currentSavings;
  let totalContributions = scenario.currentSavings;
  
  // Initial snapshot at current age
  snapshots.push({
    year: 0,
    age: scenario.currentAge,
    balance: Math.round(balance),
    contributions: Math.round(totalContributions),
    gains: 0
  });
  
  // Yearly snapshots with 12 months of compounding
  for (let year = 1; year <= yearsToRetirement; year++) {
    // Apply 12 months of growth and contributions
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyReturn) + scenario.monthlyContribution;
    }
    totalContributions += scenario.monthlyContribution * 12;
    
    const gains = balance - totalContributions;
    
    snapshots.push({
      year,
      age: scenario.currentAge + year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      gains: Math.round(gains)
    });
  }
  
  return snapshots;
}

/**
 * Calculate complete retirement projection with all details
 * 
 * @param scenario - Retirement scenario parameters
 * @returns Complete projection with final balance and yearly breakdowns
 */
export function calculateRetirementProjection(scenario: RetirementScenario): RetirementProjection {
  const snapshots = calculateDetailedProjection(scenario);
  const finalSnapshot = snapshots[snapshots.length - 1];
  
  return {
    finalBalance: finalSnapshot.balance,
    totalContributions: finalSnapshot.contributions,
    totalGains: finalSnapshot.gains,
    yearlySnapshots: snapshots
  };
}

/**
 * Calculate funding percentage toward retirement goal
 * 
 * @param projectedAmount - Projected retirement balance
 * @param retirementGoal - Target retirement savings goal
 * @returns Percentage of goal achieved (capped at 100%)
 */
export function calculateFundingPercentage(projectedAmount: number, retirementGoal: number): number {
  if (retirementGoal <= 0) return 0;
  return Math.min((projectedAmount / retirementGoal) * 100, 100);
}
