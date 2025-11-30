/**
 * Savings Goal Calculator
 * 
 * Calculates how much to save monthly/annually to reach a financial goal.
 * The inverse of compound interest - given a target amount, calculates required savings.
 * 
 * Core Formula (solving for PMT in future value of annuity):
 * PMT = (FV - PV × (1 + r/n)^(nt)) × (r/n) / ((1 + r/n)^(nt) - 1)
 * 
 * Where:
 * - FV = Future Value (goal amount)
 * - PV = Present Value (current savings)
 * - r = Annual interest rate (decimal)
 * - n = Compounding frequency per year
 * - t = Time in years
 * - PMT = Required payment per period
 */

import { CompoundingFrequency, getPeriodsPerYear, calculateEffectiveAnnualRate } from '../investment/compoundInterest.js';

/**
 * Types of savings goals
 */
export type SavingsGoalType = 
  | 'emergency-fund'
  | 'home-down-payment'
  | 'car'
  | 'vacation'
  | 'education'
  | 'wedding'
  | 'retirement'
  | 'custom';

/**
 * Contribution frequency options
 */
export type ContributionFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';

/**
 * Input parameters for savings goal calculation
 */
export interface SavingsGoalInputs {
  /** Target amount to save */
  goalAmount: number;
  /** Current savings toward this goal (optional, defaults to 0) */
  currentSavings?: number;
  /** Number of years to reach the goal */
  yearsToGoal: number;
  /** Expected annual return rate as percentage (e.g., 5 for 5%) */
  expectedReturnRate: number;
  /** How often interest compounds (optional, defaults to 'monthly') */
  compoundingFrequency?: CompoundingFrequency;
  /** How often contributions are made (optional, defaults to 'monthly') */
  contributionFrequency?: ContributionFrequency;
  /** Type of savings goal for context (optional) */
  goalType?: SavingsGoalType;
  /** Name/description of the goal (optional) */
  goalName?: string;
}

/**
 * Year-by-year progress toward goal
 */
export interface YearlyProgress {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Balance at end of year */
  balance: number;
  /** Contributions made during this year */
  contributions: number;
  /** Interest/returns earned during this year */
  returns: number;
  /** Cumulative contributions (including initial savings) */
  totalContributions: number;
  /** Cumulative returns earned */
  totalReturns: number;
  /** Percentage of goal reached */
  percentComplete: number;
  /** On track, ahead, or behind schedule */
  status: 'on-track' | 'ahead' | 'behind';
}

/**
 * Milestone tracking for goal progress
 */
export interface GoalMilestone {
  /** Percentage milestone (25%, 50%, 75%, 100%) */
  percentage: number;
  /** Amount at this milestone */
  amount: number;
  /** Year when milestone is reached */
  yearReached: number;
  /** Month within the year (1-12) */
  monthReached: number;
}

/**
 * Sensitivity analysis for different scenarios
 */
export interface SavingsScenario {
  /** Scenario label */
  label: string;
  /** Monthly contribution for this scenario */
  monthlyContribution: number;
  /** Annual contribution */
  annualContribution: number;
  /** Final balance */
  finalBalance: number;
  /** Whether goal is met */
  goalMet: boolean;
  /** Surplus or shortfall from goal */
  difference: number;
}

/**
 * Complete results from savings goal calculation
 */
export interface SavingsGoalResult {
  /** Required contribution per period (based on contributionFrequency) */
  requiredContribution: number;
  /** Monthly equivalent contribution */
  monthlyContribution: number;
  /** Annual contribution */
  annualContribution: number;
  /** Total amount you will contribute */
  totalContributions: number;
  /** Total returns/interest earned */
  totalReturns: number;
  /** Projected final balance */
  projectedBalance: number;
  /** Effective annual yield */
  effectiveAnnualRate: number;
  /** Percentage of final amount from contributions vs returns */
  contributionPercentage: number;
  /** Percentage of final amount from returns */
  returnPercentage: number;
  /** Year-by-year progress */
  yearlyProgress: YearlyProgress[];
  /** Key milestones in the journey */
  milestones: GoalMilestone[];
  /** Different savings scenarios for comparison */
  scenarios: SavingsScenario[];
  /** Is the goal achievable with reasonable returns? */
  isAchievable: boolean;
  /** Warning message if goal may be difficult to achieve */
  warning?: string;
}

/**
 * Get the number of contribution periods per year
 * 
 * @param frequency - Contribution frequency
 * @returns Number of contributions per year
 */
export function getContributionPeriodsPerYear(frequency: ContributionFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52;
    case 'bi-weekly':
      return 26;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'annually':
      return 1;
  }
}

/**
 * Calculate required savings to reach a financial goal
 * 
 * This is the inverse of compound interest calculation - given a target
 * amount and timeframe, it determines how much needs to be saved regularly.
 * 
 * @param inputs - Calculation parameters
 * @returns Complete calculation results with progress tracking
 * 
 * @example
 * ```typescript
 * const result = calculateSavingsGoal({
 *   goalAmount: 50000,
 *   currentSavings: 5000,
 *   yearsToGoal: 5,
 *   expectedReturnRate: 6,
 *   goalType: 'home-down-payment'
 * });
 * 
 * console.log(result.monthlyContribution); // ~$641
 * console.log(result.totalReturns); // ~$6,500
 * ```
 */
export function calculateSavingsGoal(inputs: SavingsGoalInputs): SavingsGoalResult {
  const {
    goalAmount,
    currentSavings = 0,
    yearsToGoal,
    expectedReturnRate,
    compoundingFrequency = 'monthly',
    contributionFrequency = 'monthly',
  } = inputs;

  // Validate inputs
  if (goalAmount <= 0) throw new Error('Goal amount must be positive');
  if (currentSavings < 0) throw new Error('Current savings cannot be negative');
  if (yearsToGoal <= 0) throw new Error('Years to goal must be positive');
  if (expectedReturnRate < 0) throw new Error('Expected return rate cannot be negative');
  if (currentSavings >= goalAmount) {
    // Goal already achieved
    return createAlreadyAchievedResult(goalAmount, currentSavings, expectedReturnRate, compoundingFrequency);
  }

  const r = expectedReturnRate / 100;
  const n = getPeriodsPerYear(compoundingFrequency);
  const contributionPeriodsPerYear = getContributionPeriodsPerYear(contributionFrequency);
  const t = yearsToGoal;
  
  // Amount still needed
  const amountNeeded = goalAmount - currentSavings;
  
  // Future value of current savings (if no additional contributions)
  let futureValueOfCurrent: number;
  if (compoundingFrequency === 'continuously') {
    futureValueOfCurrent = currentSavings * Math.exp(r * t);
  } else {
    futureValueOfCurrent = currentSavings * Math.pow(1 + r / n, n * t);
  }
  
  // Calculate required periodic contribution
  // Using the future value of annuity formula, solved for PMT
  let requiredContribution: number;
  let monthlyContribution: number;
  
  if (r === 0) {
    // No growth - simple division
    requiredContribution = (goalAmount - currentSavings) / (yearsToGoal * contributionPeriodsPerYear);
    monthlyContribution = requiredContribution * (contributionPeriodsPerYear / 12);
  } else if (compoundingFrequency === 'continuously') {
    // Approximate for continuous compounding
    // Using monthly contributions as base calculation
    const monthlyRate = r / 12;
    const totalMonths = t * 12;
    const fvFactor = (Math.exp(r * t) - 1) / (Math.exp(monthlyRate) - 1) * Math.exp(monthlyRate);
    const amountFromContributionsNeeded = goalAmount - futureValueOfCurrent;
    monthlyContribution = amountFromContributionsNeeded / fvFactor;
    requiredContribution = monthlyContribution * (12 / contributionPeriodsPerYear);
  } else {
    // Standard discrete compounding
    const ratePerContributionPeriod = r / contributionPeriodsPerYear;
    const totalContributionPeriods = contributionPeriodsPerYear * t;
    
    // FV of annuity factor: ((1 + r)^n - 1) / r
    const fvAnnuityFactor = (Math.pow(1 + ratePerContributionPeriod, totalContributionPeriods) - 1) / ratePerContributionPeriod;
    
    // Amount contributions need to grow to (goal minus future value of current savings)
    const amountFromContributionsNeeded = goalAmount - futureValueOfCurrent;
    
    requiredContribution = amountFromContributionsNeeded / fvAnnuityFactor;
    monthlyContribution = requiredContribution * (contributionPeriodsPerYear / 12);
  }
  
  // Ensure non-negative (in case current savings already exceed goal)
  requiredContribution = Math.max(0, requiredContribution);
  monthlyContribution = Math.max(0, monthlyContribution);
  
  const annualContribution = monthlyContribution * 12;
  const totalContributions = currentSavings + (annualContribution * yearsToGoal);
  const totalReturns = goalAmount - totalContributions;
  const effectiveAnnualRate = calculateEffectiveAnnualRate(expectedReturnRate, compoundingFrequency);
  
  // Calculate contribution vs return percentages
  const contributionPercentage = (totalContributions / goalAmount) * 100;
  const returnPercentage = (totalReturns / goalAmount) * 100;
  
  // Generate year-by-year progress
  const yearlyProgress = calculateYearlyProgress(
    currentSavings,
    monthlyContribution,
    expectedReturnRate,
    compoundingFrequency,
    yearsToGoal,
    goalAmount
  );
  
  // Calculate milestones
  const milestones = calculateMilestones(
    currentSavings,
    monthlyContribution,
    expectedReturnRate,
    compoundingFrequency,
    yearsToGoal,
    goalAmount
  );
  
  // Generate scenarios for comparison
  const scenarios = generateScenarios(
    goalAmount,
    currentSavings,
    yearsToGoal,
    expectedReturnRate,
    compoundingFrequency,
    monthlyContribution
  );
  
  // Check if goal is achievable
  const isAchievable = requiredContribution > 0 && isFinite(requiredContribution);
  let warning: string | undefined;
  
  // Warn if required savings rate seems very high
  if (monthlyContribution > goalAmount * 0.1) {
    warning = 'Required monthly contribution is quite high. Consider extending your timeline or adjusting your goal.';
  }
  
  return {
    requiredContribution,
    monthlyContribution,
    annualContribution,
    totalContributions,
    totalReturns,
    projectedBalance: goalAmount,
    effectiveAnnualRate,
    contributionPercentage,
    returnPercentage,
    yearlyProgress,
    milestones,
    scenarios,
    isAchievable,
    warning,
  };
}

/**
 * Create result for when goal is already achieved
 */
function createAlreadyAchievedResult(
  goalAmount: number,
  currentSavings: number,
  expectedReturnRate: number,
  compoundingFrequency: CompoundingFrequency
): SavingsGoalResult {
  return {
    requiredContribution: 0,
    monthlyContribution: 0,
    annualContribution: 0,
    totalContributions: currentSavings,
    totalReturns: 0,
    projectedBalance: currentSavings,
    effectiveAnnualRate: calculateEffectiveAnnualRate(expectedReturnRate, compoundingFrequency),
    contributionPercentage: 100,
    returnPercentage: 0,
    yearlyProgress: [{
      year: 0,
      balance: currentSavings,
      contributions: currentSavings,
      returns: 0,
      totalContributions: currentSavings,
      totalReturns: 0,
      percentComplete: Math.min((currentSavings / goalAmount) * 100, 100),
      status: 'ahead',
    }],
    milestones: [{
      percentage: 100,
      amount: goalAmount,
      yearReached: 0,
      monthReached: 1,
    }],
    scenarios: [],
    isAchievable: true,
    warning: 'Congratulations! You have already reached your savings goal.',
  };
}

/**
 * Calculate year-by-year progress toward goal
 */
function calculateYearlyProgress(
  currentSavings: number,
  monthlyContribution: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  years: number,
  goalAmount: number
): YearlyProgress[] {
  const progress: YearlyProgress[] = [];
  const r = annualRate / 100;
  const n = compoundingFrequency === 'continuously' ? 12 : getPeriodsPerYear(compoundingFrequency);
  
  let runningBalance = currentSavings;
  let totalContributionsAccum = currentSavings;
  let totalReturnsAccum = 0;
  
  // Expected balance at each year for on-track calculation
  const expectedBalanceAtYear = (year: number): number => {
    return goalAmount * (year / years);
  };
  
  for (let year = 1; year <= years; year++) {
    let yearlyContribution = 0;
    let yearlyReturns = 0;
    
    if (compoundingFrequency === 'continuously') {
      // Simplified continuous with monthly contributions
      for (let month = 1; month <= 12; month++) {
        runningBalance += monthlyContribution;
        yearlyContribution += monthlyContribution;
        const monthlyReturn = runningBalance * (r / 12);
        runningBalance += monthlyReturn;
        yearlyReturns += monthlyReturn;
      }
    } else {
      const ratePerPeriod = r / n;
      const contributionsPerPeriod = (monthlyContribution * 12) / n;
      
      for (let period = 0; period < n; period++) {
        runningBalance += contributionsPerPeriod;
        yearlyContribution += contributionsPerPeriod;
        const periodReturn = runningBalance * ratePerPeriod;
        runningBalance += periodReturn;
        yearlyReturns += periodReturn;
      }
    }
    
    totalContributionsAccum += yearlyContribution;
    totalReturnsAccum += yearlyReturns;
    
    const percentComplete = (runningBalance / goalAmount) * 100;
    const expectedPercent = (year / years) * 100;
    
    let status: 'on-track' | 'ahead' | 'behind';
    if (Math.abs(percentComplete - expectedPercent) < 2) {
      status = 'on-track';
    } else if (percentComplete > expectedPercent) {
      status = 'ahead';
    } else {
      status = 'behind';
    }
    
    progress.push({
      year,
      balance: runningBalance,
      contributions: yearlyContribution,
      returns: yearlyReturns,
      totalContributions: totalContributionsAccum,
      totalReturns: totalReturnsAccum,
      percentComplete: Math.min(percentComplete, 100),
      status,
    });
  }
  
  return progress;
}

/**
 * Calculate milestone achievements
 */
function calculateMilestones(
  currentSavings: number,
  monthlyContribution: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  years: number,
  goalAmount: number
): GoalMilestone[] {
  const milestones: GoalMilestone[] = [];
  const milestonePercentages = [25, 50, 75, 100];
  const r = annualRate / 100;
  
  let runningBalance = currentSavings;
  const totalMonths = years * 12;
  
  // Check if any milestones are already achieved
  for (const pct of milestonePercentages) {
    const milestoneAmount = goalAmount * (pct / 100);
    if (currentSavings >= milestoneAmount) {
      milestones.push({
        percentage: pct,
        amount: milestoneAmount,
        yearReached: 0,
        monthReached: 1,
      });
    }
  }
  
  // Track remaining milestones
  const remainingMilestones = milestonePercentages.filter(
    pct => !milestones.some(m => m.percentage === pct)
  );
  
  // Simulate month by month
  runningBalance = currentSavings;
  for (let month = 1; month <= totalMonths && remainingMilestones.length > 0; month++) {
    // Add monthly contribution
    runningBalance += monthlyContribution;
    
    // Add monthly return
    const monthlyRate = r / 12;
    runningBalance += runningBalance * monthlyRate;
    
    // Check for milestone achievements
    for (let i = remainingMilestones.length - 1; i >= 0; i--) {
      const pct = remainingMilestones[i];
      const milestoneAmount = goalAmount * (pct / 100);
      
      if (runningBalance >= milestoneAmount) {
        milestones.push({
          percentage: pct,
          amount: milestoneAmount,
          yearReached: Math.ceil(month / 12),
          monthReached: ((month - 1) % 12) + 1,
        });
        remainingMilestones.splice(i, 1);
      }
    }
  }
  
  // Sort by percentage
  milestones.sort((a, b) => a.percentage - b.percentage);
  
  return milestones;
}

/**
 * Generate comparison scenarios
 */
function generateScenarios(
  goalAmount: number,
  currentSavings: number,
  years: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  baselineMonthlyContribution: number
): SavingsScenario[] {
  const scenarios: SavingsScenario[] = [];
  const r = annualRate / 100;
  const n = getPeriodsPerYear(compoundingFrequency);
  
  // Different contribution levels to compare
  const contributionMultipliers = [
    { label: '50% less', multiplier: 0.5 },
    { label: '25% less', multiplier: 0.75 },
    { label: 'Recommended', multiplier: 1.0 },
    { label: '25% more', multiplier: 1.25 },
    { label: '50% more', multiplier: 1.5 },
  ];
  
  for (const { label, multiplier } of contributionMultipliers) {
    const monthlyContribution = baselineMonthlyContribution * multiplier;
    const annualContribution = monthlyContribution * 12;
    
    // Calculate final balance with this contribution level
    let balance = currentSavings;
    if (compoundingFrequency === 'continuously') {
      // Approximate for continuous
      for (let year = 0; year < years; year++) {
        balance = (balance + annualContribution) * Math.exp(r);
      }
    } else {
      const ratePerPeriod = r / n;
      const contributionsPerPeriod = annualContribution / n;
      
      for (let period = 0; period < n * years; period++) {
        balance += contributionsPerPeriod;
        balance *= (1 + ratePerPeriod);
      }
    }
    
    scenarios.push({
      label,
      monthlyContribution,
      annualContribution,
      finalBalance: balance,
      goalMet: balance >= goalAmount,
      difference: balance - goalAmount,
    });
  }
  
  return scenarios;
}

/**
 * Calculate time to reach goal with fixed contribution
 * 
 * Given a fixed monthly contribution, calculates how long it will take
 * to reach the savings goal.
 * 
 * @param goalAmount - Target amount to save
 * @param currentSavings - Current savings (optional, defaults to 0)
 * @param monthlyContribution - Fixed monthly contribution
 * @param expectedReturnRate - Annual return rate as percentage
 * @param compoundingFrequency - How often returns compound (optional, defaults to 'monthly')
 * @returns Object with years and months to reach goal
 * 
 * @example
 * ```typescript
 * const result = calculateTimeToGoal(50000, 5000, 500, 6);
 * console.log(result); // { years: 6, months: 3, totalMonths: 75 }
 * ```
 */
export function calculateTimeToGoal(
  goalAmount: number,
  currentSavings: number = 0,
  monthlyContribution: number,
  expectedReturnRate: number,
  compoundingFrequency: CompoundingFrequency = 'monthly'
): { years: number; months: number; totalMonths: number; achievable: boolean } {
  if (currentSavings >= goalAmount) {
    return { years: 0, months: 0, totalMonths: 0, achievable: true };
  }
  
  if (monthlyContribution <= 0 && expectedReturnRate <= 0) {
    return { years: Infinity, months: 0, totalMonths: Infinity, achievable: false };
  }
  
  const r = expectedReturnRate / 100;
  const monthlyRate = r / 12;
  
  let balance = currentSavings;
  let months = 0;
  const maxMonths = 100 * 12; // 100 years max
  
  while (balance < goalAmount && months < maxMonths) {
    balance += monthlyContribution;
    balance *= (1 + monthlyRate);
    months++;
  }
  
  if (months >= maxMonths) {
    return { years: Infinity, months: 0, totalMonths: Infinity, achievable: false };
  }
  
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    totalMonths: months,
    achievable: true,
  };
}

/**
 * Calculate goal amount based on expense multiple (e.g., 3-6 months for emergency fund)
 * 
 * @param monthlyExpenses - Monthly expenses
 * @param months - Number of months to cover
 * @returns Recommended goal amount
 */
export function calculateEmergencyFundGoal(monthlyExpenses: number, months: number = 6): number {
  return monthlyExpenses * months;
}

/**
 * Calculate home down payment goal based on home price and percentage
 * 
 * @param homePrice - Target home price
 * @param downPaymentPercent - Down payment percentage (e.g., 20 for 20%)
 * @param includeClosingCosts - Whether to include 3% closing costs
 * @returns Recommended goal amount
 */
export function calculateDownPaymentGoal(
  homePrice: number,
  downPaymentPercent: number = 20,
  includeClosingCosts: boolean = true
): number {
  const downPayment = homePrice * (downPaymentPercent / 100);
  const closingCosts = includeClosingCosts ? homePrice * 0.03 : 0;
  return downPayment + closingCosts;
}

/**
 * Compare different goal scenarios
 * 
 * @param scenarios - Array of input scenarios to compare
 * @returns Array of results, one for each scenario
 */
export function compareSavingsScenarios(
  scenarios: SavingsGoalInputs[]
): SavingsGoalResult[] {
  return scenarios.map(scenario => calculateSavingsGoal(scenario));
}
