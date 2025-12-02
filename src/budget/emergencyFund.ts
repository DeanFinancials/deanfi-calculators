/**
 * Emergency Fund Calculator
 * 
 * Calculates recommended emergency fund size based on monthly expenses,
 * risk factors, income stability, and personal circumstances.
 * 
 * Core Formula:
 * Emergency Fund = Monthly Essential Expenses × Recommended Months
 * 
 * Recommended months varies based on:
 * - Employment type (stable vs variable)
 * - Income sources (single vs multiple)
 * - Dependents
 * - Job market conditions
 * - Existing safety nets (severance, disability insurance, etc.)
 * 
 * Features that competitors DON'T have:
 * - Risk-adjusted recommendations based on personal factors
 * - Expense category breakdown (essential vs non-essential)
 * - Paycheck-to-paycheck savings plan
 * - Time to reach goal with different strategies
 * - Scenario comparison (3 vs 6 vs 12 months)
 */

import { getContributionPeriodsPerYear, type ContributionFrequency } from './savingsGoal.js';

/**
 * Employment stability types that affect recommended emergency fund size
 */
export type EmploymentType = 
  | 'stable-employed'      // W-2 employee with stable company
  | 'variable-income'      // Commission, freelance, gig work
  | 'self-employed'        // Business owner
  | 'government'           // Government/union job with strong protections
  | 'high-risk-industry'   // Industry with frequent layoffs
  | 'retired';             // Living on fixed income

/**
 * Categories for monthly expenses
 */
export type ExpenseCategory = 
  | 'housing'              // Rent/mortgage, property taxes, HOA
  | 'utilities'            // Electric, gas, water, internet, phone
  | 'food'                 // Groceries and essential dining
  | 'transportation'       // Car payment, insurance, gas, transit
  | 'insurance'            // Health, life, disability
  | 'debt-payments'        // Minimum debt payments
  | 'healthcare'           // Regular medical expenses, prescriptions
  | 'childcare'            // Childcare/education for dependents
  | 'other-essential';     // Other necessary expenses

/**
 * Expense entry with category and amount
 */
export interface ExpenseEntry {
  /** Category of expense */
  category: ExpenseCategory;
  /** Monthly amount */
  amount: number;
  /** Optional description */
  description?: string;
}

/**
 * Input parameters for emergency fund calculation
 */
export interface EmergencyFundInputs {
  /** Itemized monthly expenses (recommended) or total */
  expenses: ExpenseEntry[] | number;
  /** Current savings toward emergency fund */
  currentSavings?: number;
  /** Monthly income (after taxes) */
  monthlyIncome?: number;
  /** Type of employment */
  employmentType?: EmploymentType;
  /** Number of income sources in household */
  incomeSources?: number;
  /** Number of dependents */
  dependents?: number;
  /** Has disability insurance? */
  hasDisabilityInsurance?: boolean;
  /** Has severance package or strong job protections? */
  hasSeveranceProtection?: boolean;
  /** Expected months until new job if laid off */
  expectedJobSearchMonths?: number;
  /** How much can be saved per month toward the goal */
  monthlySavingsCapacity?: number;
  /** Target months of coverage (overrides calculated recommendation) */
  targetMonths?: number;
}

/**
 * Breakdown of expenses by category
 */
export interface ExpenseBreakdown {
  /** Housing costs */
  housing: number;
  /** Utility costs */
  utilities: number;
  /** Food costs */
  food: number;
  /** Transportation costs */
  transportation: number;
  /** Insurance costs */
  insurance: number;
  /** Debt payment costs */
  debtPayments: number;
  /** Healthcare costs */
  healthcare: number;
  /** Childcare costs */
  childcare: number;
  /** Other essential costs */
  otherEssential: number;
  /** Total monthly essential expenses */
  totalMonthly: number;
}

/**
 * Progress milestone for building emergency fund
 */
export interface FundMilestone {
  /** Label for milestone (e.g., "1 Month", "3 Months") */
  label: string;
  /** Months of coverage */
  months: number;
  /** Dollar amount at this milestone */
  amount: number;
  /** Weeks until reached (if saving) */
  weeksToReach?: number;
  /** Whether already achieved */
  achieved: boolean;
  /** Description of what this milestone means */
  description: string;
}

/**
 * Monthly progress entry for savings plan
 */
export interface MonthlyProgress {
  /** Month number (1, 2, 3...) */
  month: number;
  /** Amount saved this month */
  contribution: number;
  /** Total balance at end of month */
  balance: number;
  /** Interest earned (if HYSA) */
  interestEarned: number;
  /** Months of coverage achieved */
  monthsCovered: number;
  /** Percentage of goal reached */
  percentComplete: number;
}

/**
 * Comparison of different target scenarios
 */
export interface FundScenario {
  /** Scenario name */
  name: string;
  /** Months of coverage */
  months: number;
  /** Target amount */
  targetAmount: number;
  /** Months to reach goal */
  monthsToReach: number;
  /** Weekly savings required */
  weeklySavingsRequired: number;
  /** Monthly savings required */
  monthlySavingsRequired: number;
  /** Risk level with this coverage */
  riskLevel: 'high' | 'moderate' | 'low' | 'very-low';
  /** Is this the recommended scenario? */
  recommended: boolean;
  /** Description of this scenario */
  description: string;
}

/**
 * Risk assessment results
 */
export interface RiskAssessment {
  /** Overall risk score (1-10, higher = more risk) */
  riskScore: number;
  /** Risk level category */
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  /** Recommended months of coverage based on risk */
  recommendedMonths: number;
  /** Minimum recommended months */
  minimumMonths: number;
  /** Maximum/conservative months */
  conservativeMonths: number;
  /** Factors contributing to risk */
  riskFactors: string[];
  /** Factors reducing risk */
  protectiveFactors: string[];
}

/**
 * Complete results from emergency fund calculation
 */
export interface EmergencyFundResult {
  /** Monthly essential expenses */
  monthlyExpenses: number;
  /** Breakdown by category (if itemized) */
  expenseBreakdown?: ExpenseBreakdown;
  /** Current savings */
  currentSavings: number;
  /** Risk assessment */
  riskAssessment: RiskAssessment;
  /** Recommended emergency fund target */
  recommendedTarget: number;
  /** Minimum target (3 months) */
  minimumTarget: number;
  /** Conservative target */
  conservativeTarget: number;
  /** Current months of coverage */
  currentCoverage: number;
  /** Gap between current and recommended */
  fundingGap: number;
  /** Percentage of goal achieved */
  percentComplete: number;
  /** Milestones in building the fund */
  milestones: FundMilestone[];
  /** Comparison of different target scenarios */
  scenarios: FundScenario[];
  /** Monthly savings plan (if capacity provided) */
  savingsPlan?: MonthlyProgress[];
  /** Months until goal reached (if saving) */
  monthsToGoal?: number;
  /** Weekly savings needed to reach goal in 12 months */
  weeklySavingsFor12Months: number;
  /** Monthly savings needed to reach goal in 12 months */
  monthlySavingsFor12Months: number;
  /** Personalized recommendations */
  recommendations: string[];
  /** Warning messages */
  warnings: string[];
}

/**
 * Category display names
 */
export const EXPENSE_CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  'housing': 'Housing',
  'utilities': 'Utilities',
  'food': 'Food & Groceries',
  'transportation': 'Transportation',
  'insurance': 'Insurance',
  'debt-payments': 'Debt Payments',
  'healthcare': 'Healthcare',
  'childcare': 'Childcare/Education',
  'other-essential': 'Other Essential',
};

/**
 * Calculate risk score based on personal factors
 */
function calculateRiskAssessment(inputs: EmergencyFundInputs): RiskAssessment {
  const {
    employmentType = 'stable-employed',
    incomeSources = 1,
    dependents = 0,
    hasDisabilityInsurance = false,
    hasSeveranceProtection = false,
    expectedJobSearchMonths,
  } = inputs;
  
  let riskScore = 5; // Start at medium
  const riskFactors: string[] = [];
  const protectiveFactors: string[] = [];
  
  // Employment type impact
  switch (employmentType) {
    case 'government':
      riskScore -= 2;
      protectiveFactors.push('Stable government/union employment');
      break;
    case 'stable-employed':
      riskScore -= 1;
      protectiveFactors.push('Stable W-2 employment');
      break;
    case 'variable-income':
      riskScore += 2;
      riskFactors.push('Variable/commission-based income');
      break;
    case 'self-employed':
      riskScore += 2;
      riskFactors.push('Self-employment income volatility');
      break;
    case 'high-risk-industry':
      riskScore += 3;
      riskFactors.push('High-layoff-risk industry');
      break;
    case 'retired':
      riskScore += 1;
      riskFactors.push('Fixed retirement income');
      break;
  }
  
  // Income sources
  if (incomeSources >= 2) {
    riskScore -= 1;
    protectiveFactors.push('Multiple income sources');
  } else if (incomeSources === 1) {
    riskScore += 1;
    riskFactors.push('Single income household');
  }
  
  // Dependents
  if (dependents > 0) {
    riskScore += Math.min(dependents, 3);
    riskFactors.push(`${dependents} dependent${dependents > 1 ? 's' : ''} to support`);
  }
  
  // Insurance and protections
  if (hasDisabilityInsurance) {
    riskScore -= 1;
    protectiveFactors.push('Disability insurance coverage');
  }
  
  if (hasSeveranceProtection) {
    riskScore -= 1;
    protectiveFactors.push('Severance/job protection available');
  }
  
  // Expected job search time
  if (expectedJobSearchMonths && expectedJobSearchMonths > 3) {
    riskScore += Math.min(Math.floor((expectedJobSearchMonths - 3) / 2), 2);
    riskFactors.push(`Expected ${expectedJobSearchMonths} months to find new job`);
  }
  
  // Clamp risk score
  riskScore = Math.max(1, Math.min(10, riskScore));
  
  // Determine risk level and recommendations
  let riskLevel: RiskAssessment['riskLevel'];
  let recommendedMonths: number;
  let minimumMonths: number;
  let conservativeMonths: number;
  
  if (riskScore <= 3) {
    riskLevel = 'low';
    recommendedMonths = 3;
    minimumMonths = 2;
    conservativeMonths = 6;
  } else if (riskScore <= 5) {
    riskLevel = 'moderate';
    recommendedMonths = 6;
    minimumMonths = 3;
    conservativeMonths = 9;
  } else if (riskScore <= 7) {
    riskLevel = 'high';
    recommendedMonths = 9;
    minimumMonths = 6;
    conservativeMonths = 12;
  } else {
    riskLevel = 'very-high';
    recommendedMonths = 12;
    minimumMonths = 6;
    conservativeMonths = 18;
  }
  
  return {
    riskScore,
    riskLevel,
    recommendedMonths,
    minimumMonths,
    conservativeMonths,
    riskFactors,
    protectiveFactors,
  };
}

/**
 * Parse expenses into breakdown
 */
function parseExpenses(expenses: ExpenseEntry[] | number): { total: number; breakdown?: ExpenseBreakdown } {
  if (typeof expenses === 'number') {
    return { total: expenses };
  }
  
  const breakdown: ExpenseBreakdown = {
    housing: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    insurance: 0,
    debtPayments: 0,
    healthcare: 0,
    childcare: 0,
    otherEssential: 0,
    totalMonthly: 0,
  };
  
  for (const expense of expenses) {
    switch (expense.category) {
      case 'housing':
        breakdown.housing += expense.amount;
        break;
      case 'utilities':
        breakdown.utilities += expense.amount;
        break;
      case 'food':
        breakdown.food += expense.amount;
        break;
      case 'transportation':
        breakdown.transportation += expense.amount;
        break;
      case 'insurance':
        breakdown.insurance += expense.amount;
        break;
      case 'debt-payments':
        breakdown.debtPayments += expense.amount;
        break;
      case 'healthcare':
        breakdown.healthcare += expense.amount;
        break;
      case 'childcare':
        breakdown.childcare += expense.amount;
        break;
      case 'other-essential':
        breakdown.otherEssential += expense.amount;
        break;
    }
  }
  
  breakdown.totalMonthly = 
    breakdown.housing +
    breakdown.utilities +
    breakdown.food +
    breakdown.transportation +
    breakdown.insurance +
    breakdown.debtPayments +
    breakdown.healthcare +
    breakdown.childcare +
    breakdown.otherEssential;
  
  return { total: breakdown.totalMonthly, breakdown };
}

/**
 * Generate milestones for building emergency fund
 */
function generateMilestones(
  monthlyExpenses: number,
  currentSavings: number,
  monthlySavings?: number
): FundMilestone[] {
  const milestones: FundMilestone[] = [];
  const milestoneLevels = [
    { months: 1, label: '1 Month', description: 'Basic starter fund for minor emergencies' },
    { months: 2, label: '2 Months', description: 'Can cover a short job gap or medical bill' },
    { months: 3, label: '3 Months', description: 'Minimum recommended for stable jobs' },
    { months: 6, label: '6 Months', description: 'Standard recommendation for most people' },
    { months: 9, label: '9 Months', description: 'Extra security for variable income' },
    { months: 12, label: '12 Months', description: 'Maximum security and peace of mind' },
  ];
  
  for (const level of milestoneLevels) {
    const amount = monthlyExpenses * level.months;
    const achieved = currentSavings >= amount;
    
    let weeksToReach: number | undefined;
    if (!achieved && monthlySavings && monthlySavings > 0) {
      const remaining = amount - currentSavings;
      const monthsToReach = remaining / monthlySavings;
      weeksToReach = Math.ceil(monthsToReach * 4.33);
    }
    
    milestones.push({
      label: level.label,
      months: level.months,
      amount,
      weeksToReach,
      achieved,
      description: level.description,
    });
  }
  
  return milestones;
}

/**
 * Generate comparison scenarios
 */
function generateScenarios(
  monthlyExpenses: number,
  currentSavings: number,
  monthlySavings: number | undefined,
  recommendedMonths: number
): FundScenario[] {
  const scenarios: FundScenario[] = [];
  const scenarioLevels = [
    { months: 3, name: 'Minimum', description: 'Basic coverage for stable situations' },
    { months: 6, name: 'Standard', description: 'Recommended for most households' },
    { months: 9, name: 'Enhanced', description: 'Extra security for variable income' },
    { months: 12, name: 'Maximum', description: 'Full year of coverage for peace of mind' },
  ];
  
  for (const level of scenarioLevels) {
    const targetAmount = monthlyExpenses * level.months;
    const remaining = Math.max(0, targetAmount - currentSavings);
    
    let monthsToReach = Infinity;
    let weeklySavingsRequired = 0;
    let monthlySavingsRequired = 0;
    
    if (remaining > 0) {
      // Calculate savings needed to reach in 12 months
      monthlySavingsRequired = remaining / 12;
      weeklySavingsRequired = remaining / 52;
      
      if (monthlySavings && monthlySavings > 0) {
        monthsToReach = Math.ceil(remaining / monthlySavings);
      }
    } else {
      monthsToReach = 0;
    }
    
    let riskLevel: FundScenario['riskLevel'];
    if (level.months <= 3) {
      riskLevel = 'high';
    } else if (level.months <= 6) {
      riskLevel = 'moderate';
    } else if (level.months <= 9) {
      riskLevel = 'low';
    } else {
      riskLevel = 'very-low';
    }
    
    scenarios.push({
      name: level.name,
      months: level.months,
      targetAmount,
      monthsToReach: monthsToReach === Infinity ? -1 : monthsToReach,
      weeklySavingsRequired,
      monthlySavingsRequired,
      riskLevel,
      recommended: level.months === recommendedMonths,
      description: level.description,
    });
  }
  
  return scenarios;
}

/**
 * Generate monthly savings plan with HYSA interest
 */
function generateSavingsPlan(
  currentSavings: number,
  targetAmount: number,
  monthlySavings: number,
  monthlyExpenses: number,
  hysaRate: number = 4.5 // Typical HYSA rate
): MonthlyProgress[] {
  const plan: MonthlyProgress[] = [];
  let balance = currentSavings;
  const monthlyRate = hysaRate / 100 / 12;
  let month = 0;
  
  // Limit to 5 years max
  while (balance < targetAmount && month < 60) {
    month++;
    const startBalance = balance;
    
    // Add contribution
    balance += monthlySavings;
    
    // Add interest
    const interest = balance * monthlyRate;
    balance += interest;
    
    plan.push({
      month,
      contribution: monthlySavings,
      balance,
      interestEarned: interest,
      monthsCovered: balance / monthlyExpenses,
      percentComplete: Math.min((balance / targetAmount) * 100, 100),
    });
    
    // Stop if goal reached
    if (balance >= targetAmount) {
      break;
    }
  }
  
  return plan;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  currentCoverage: number,
  recommendedMonths: number,
  riskAssessment: RiskAssessment,
  monthlyIncome?: number,
  monthlySavingsCapacity?: number
): string[] {
  const recommendations: string[] = [];
  
  // Priority recommendation based on current coverage
  if (currentCoverage < 1) {
    recommendations.push('🚨 Priority: Build at least 1 month of expenses as your starter emergency fund');
  } else if (currentCoverage < 3) {
    recommendations.push('📈 Focus on reaching 3 months of expenses before investing aggressively');
  } else if (currentCoverage < recommendedMonths) {
    recommendations.push(`🎯 You're on track! Continue building toward ${recommendedMonths} months of coverage`);
  } else {
    recommendations.push('✅ Excellent! Your emergency fund meets recommended levels');
  }
  
  // HYSA recommendation
  recommendations.push('💰 Keep your emergency fund in a high-yield savings account (4-5% APY currently available)');
  
  // Based on risk factors
  if (riskAssessment.riskFactors.includes('Variable/commission-based income')) {
    recommendations.push('📊 With variable income, aim for 6-9 months to smooth income fluctuations');
  }
  
  if (riskAssessment.riskFactors.includes('Single income household')) {
    recommendations.push('👥 Consider building toward 6+ months since you have a single income');
  }
  
  // Savings rate recommendations
  if (monthlySavingsCapacity && monthlyIncome) {
    const savingsRate = (monthlySavingsCapacity / monthlyIncome) * 100;
    if (savingsRate < 10) {
      recommendations.push('💡 Try to increase savings to at least 10% of income for faster progress');
    } else if (savingsRate >= 20) {
      recommendations.push('🌟 Great savings rate! You\'ll reach your goal faster than most');
    }
  }
  
  // Automation recommendation
  recommendations.push('⚡ Set up automatic transfers on payday to build your fund consistently');
  
  return recommendations;
}

/**
 * Generate warning messages
 */
function generateWarnings(
  currentCoverage: number,
  percentComplete: number,
  monthsToGoal?: number
): string[] {
  const warnings: string[] = [];
  
  if (currentCoverage < 1) {
    warnings.push('Without at least 1 month of savings, a single emergency could lead to debt');
  }
  
  if (monthsToGoal && monthsToGoal > 24) {
    warnings.push('At current savings rate, it will take over 2 years to reach your goal. Consider increasing contributions.');
  }
  
  return warnings;
}

/**
 * Calculate emergency fund recommendation and savings plan
 * 
 * This is the main function for the emergency fund calculator. It assesses
 * your risk profile based on employment type, dependents, and other factors
 * to recommend an appropriate emergency fund size.
 * 
 * @param inputs - Calculation parameters
 * @returns Complete calculation results with recommendations
 * 
 * @example
 * ```typescript
 * const result = calculateEmergencyFund({
 *   expenses: 4000,
 *   currentSavings: 5000,
 *   employmentType: 'stable-employed',
 *   dependents: 2,
 *   monthlySavingsCapacity: 500
 * });
 * 
 * console.log(result.recommendedTarget); // $24,000 (6 months)
 * console.log(result.monthsToGoal); // ~38 months
 * ```
 */
export function calculateEmergencyFund(inputs: EmergencyFundInputs): EmergencyFundResult {
  const {
    expenses,
    currentSavings = 0,
    monthlyIncome,
    targetMonths,
    monthlySavingsCapacity,
  } = inputs;
  
  // Parse expenses
  const { total: monthlyExpenses, breakdown: expenseBreakdown } = parseExpenses(expenses);
  
  if (monthlyExpenses <= 0) {
    throw new Error('Monthly expenses must be greater than zero');
  }
  
  // Calculate risk assessment
  const riskAssessment = calculateRiskAssessment(inputs);
  
  // Determine targets
  const recommendedMonths = targetMonths ?? riskAssessment.recommendedMonths;
  const recommendedTarget = monthlyExpenses * recommendedMonths;
  const minimumTarget = monthlyExpenses * riskAssessment.minimumMonths;
  const conservativeTarget = monthlyExpenses * riskAssessment.conservativeMonths;
  
  // Current status
  const currentCoverage = currentSavings / monthlyExpenses;
  const fundingGap = Math.max(0, recommendedTarget - currentSavings);
  const percentComplete = Math.min((currentSavings / recommendedTarget) * 100, 100);
  
  // Milestones
  const milestones = generateMilestones(monthlyExpenses, currentSavings, monthlySavingsCapacity);
  
  // Scenarios
  const scenarios = generateScenarios(
    monthlyExpenses,
    currentSavings,
    monthlySavingsCapacity,
    recommendedMonths
  );
  
  // Savings plan
  let savingsPlan: MonthlyProgress[] | undefined;
  let monthsToGoal: number | undefined;
  
  if (monthlySavingsCapacity && monthlySavingsCapacity > 0 && fundingGap > 0) {
    savingsPlan = generateSavingsPlan(
      currentSavings,
      recommendedTarget,
      monthlySavingsCapacity,
      monthlyExpenses
    );
    monthsToGoal = savingsPlan.length;
  }
  
  // Savings needed to reach goal in 12 months
  const weeklySavingsFor12Months = fundingGap > 0 ? fundingGap / 52 : 0;
  const monthlySavingsFor12Months = fundingGap > 0 ? fundingGap / 12 : 0;
  
  // Recommendations and warnings
  const recommendations = generateRecommendations(
    currentCoverage,
    recommendedMonths,
    riskAssessment,
    monthlyIncome,
    monthlySavingsCapacity
  );
  
  const warnings = generateWarnings(currentCoverage, percentComplete, monthsToGoal);
  
  return {
    monthlyExpenses,
    expenseBreakdown,
    currentSavings,
    riskAssessment,
    recommendedTarget,
    minimumTarget,
    conservativeTarget,
    currentCoverage,
    fundingGap,
    percentComplete,
    milestones,
    scenarios,
    savingsPlan,
    monthsToGoal,
    weeklySavingsFor12Months,
    monthlySavingsFor12Months,
    recommendations,
    warnings,
  };
}

/**
 * Quick calculation for emergency fund amount
 * 
 * @param monthlyExpenses - Monthly essential expenses
 * @param months - Number of months to cover (default 6)
 * @returns Emergency fund target amount
 */
export function quickEmergencyFund(monthlyExpenses: number, months: number = 6): number {
  return monthlyExpenses * months;
}

/**
 * Calculate time to reach emergency fund goal
 * 
 * @param targetAmount - Target emergency fund amount
 * @param currentSavings - Current savings
 * @param monthlySavings - Monthly contribution
 * @param annualRate - HYSA annual rate (default 4.5%)
 * @returns Months to reach goal
 */
export function timeToEmergencyFund(
  targetAmount: number,
  currentSavings: number,
  monthlySavings: number,
  annualRate: number = 4.5
): number {
  if (currentSavings >= targetAmount) return 0;
  if (monthlySavings <= 0) return Infinity;
  
  const monthlyRate = annualRate / 100 / 12;
  let balance = currentSavings;
  let months = 0;
  
  while (balance < targetAmount && months < 600) { // Max 50 years
    balance = (balance + monthlySavings) * (1 + monthlyRate);
    months++;
  }
  
  return months >= 600 ? Infinity : months;
}

/**
 * Get recommended months based on simple criteria
 * 
 * @param isVariableIncome - Has variable/commission income
 * @param hasDependents - Has dependents to support
 * @param isSingleIncome - Single income household
 * @returns Recommended months of coverage
 */
export function getRecommendedMonths(
  isVariableIncome: boolean = false,
  hasDependents: boolean = false,
  isSingleIncome: boolean = true
): number {
  let months = 3; // Base
  
  if (isVariableIncome) months += 3;
  if (hasDependents) months += 2;
  if (isSingleIncome) months += 1;
  
  return Math.min(months, 12);
}
