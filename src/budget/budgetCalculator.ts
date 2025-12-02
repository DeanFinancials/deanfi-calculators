/**
 * 50/30/20 Budget Calculator
 * 
 * Calculates budget allocation based on the 50/30/20 rule and alternative
 * budgeting strategies, with expense tracking and optimization suggestions.
 * 
 * Core Formula (50/30/20 Rule):
 * - 50% of after-tax income → Needs (essential expenses)
 * - 30% of after-tax income → Wants (discretionary spending)
 * - 20% of after-tax income → Savings & Debt Repayment
 * 
 * Features that competitors DON'T have:
 * - Alternative rule comparison (60/20/20, 70/20/10, 80/20, Pay Yourself First)
 * - Expense tracking with automatic categorization vs target
 * - Personalized rule recommendation based on income/expenses
 * - Visual gap analysis showing over/under budget per category
 * - Savings optimization suggestions with projected outcomes
 * - Regional cost-of-living adjustments
 * - Month-over-month budget tracking
 * - Financial goal integration
 */

/**
 * Budget category types
 */
export type BudgetCategory = 'needs' | 'wants' | 'savings';

/**
 * Expense subcategories for detailed tracking
 */
export type NeedsSubcategory = 
  | 'housing'              // Rent/mortgage, property tax, HOA
  | 'utilities'            // Electric, gas, water, internet, phone
  | 'groceries'            // Essential food and household items
  | 'transportation'       // Car payment, gas, insurance, transit
  | 'health-insurance'     // Health insurance premiums
  | 'minimum-debt'         // Minimum required debt payments
  | 'childcare'            // Childcare and essential child expenses
  | 'other-essential';     // Other necessary expenses

export type WantsSubcategory =
  | 'dining-out'           // Restaurants, takeout, coffee shops
  | 'entertainment'        // Streaming, movies, concerts, hobbies
  | 'shopping'             // Clothing, electronics, non-essentials
  | 'subscriptions'        // Non-essential subscriptions
  | 'travel'               // Vacations and trips
  | 'personal-care'        // Gym, spa, beauty
  | 'gifts'                // Gifts for others
  | 'other-wants';         // Other discretionary spending

export type SavingsSubcategory =
  | 'emergency-fund'       // Emergency savings
  | 'retirement'           // 401k, IRA contributions
  | 'investments'          // Brokerage, stocks, bonds
  | 'extra-debt'           // Extra debt payments beyond minimum
  | 'sinking-funds'        // Saving for specific goals
  | 'other-savings';       // Other savings

/**
 * Budget rule presets with different allocation percentages
 */
export interface BudgetRule {
  /** Rule name */
  name: string;
  /** Short description */
  description: string;
  /** Percentage for needs */
  needsPercent: number;
  /** Percentage for wants */
  wantsPercent: number;
  /** Percentage for savings */
  savingsPercent: number;
  /** Best suited for this type of person */
  bestFor: string;
}

/**
 * Predefined budget rules
 */
export const BUDGET_RULES: Record<string, BudgetRule> = {
  'standard': {
    name: '50/30/20 Rule',
    description: 'The classic balanced budget rule popularized by Senator Elizabeth Warren',
    needsPercent: 50,
    wantsPercent: 30,
    savingsPercent: 20,
    bestFor: 'Most people with average cost of living and stable income',
  },
  'aggressive-saver': {
    name: '50/20/30 Rule',
    description: 'Prioritizes savings over discretionary spending',
    needsPercent: 50,
    wantsPercent: 20,
    savingsPercent: 30,
    bestFor: 'Those focused on early retirement (FIRE) or rapid wealth building',
  },
  'high-cost-living': {
    name: '60/20/20 Rule',
    description: 'More room for essential expenses in expensive areas',
    needsPercent: 60,
    wantsPercent: 20,
    savingsPercent: 20,
    bestFor: 'People in high cost-of-living cities (SF, NYC, Boston)',
  },
  'debt-focused': {
    name: '50/20/30 Debt Focus',
    description: 'Maximizes debt repayment while maintaining essentials',
    needsPercent: 50,
    wantsPercent: 20,
    savingsPercent: 30,
    bestFor: 'Those aggressively paying off debt',
  },
  'minimalist': {
    name: '70/10/20 Rule',
    description: 'Minimal wants spending for maximum flexibility',
    needsPercent: 70,
    wantsPercent: 10,
    savingsPercent: 20,
    bestFor: 'Minimalists or those with high essential costs',
  },
  'paycheck-to-paycheck': {
    name: '80/10/10 Starter',
    description: 'Realistic starting point for those rebuilding finances',
    needsPercent: 80,
    wantsPercent: 10,
    savingsPercent: 10,
    bestFor: 'Those just starting their financial journey or recovering from hardship',
  },
  'pay-yourself-first': {
    name: 'Pay Yourself First',
    description: 'Save a fixed amount first, split the rest between needs and wants',
    needsPercent: 55,
    wantsPercent: 25,
    savingsPercent: 20,
    bestFor: 'Those who struggle to save consistently',
  },
};

/**
 * Expense entry for tracking actual spending
 */
export interface ExpenseItem {
  /** Expense description */
  description: string;
  /** Amount spent */
  amount: number;
  /** Main category (needs, wants, savings) */
  category: BudgetCategory;
  /** Subcategory for detailed tracking */
  subcategory?: NeedsSubcategory | WantsSubcategory | SavingsSubcategory;
}

/**
 * Category breakdown with subcategories
 */
export interface CategoryBreakdown {
  /** Total amount for this category */
  total: number;
  /** Target amount based on budget rule */
  target: number;
  /** Difference (positive = under budget, negative = over budget) */
  difference: number;
  /** Percentage of income */
  percentOfIncome: number;
  /** Target percentage */
  targetPercent: number;
  /** Whether on budget or not */
  status: 'under' | 'on-target' | 'over';
  /** Subcategory breakdown */
  subcategories: Record<string, number>;
}

/**
 * Input parameters for budget calculation
 */
export interface BudgetInputs {
  /** Monthly after-tax income */
  monthlyIncome: number;
  /** Budget rule to apply (default: 'standard' for 50/30/20) */
  budgetRule?: keyof typeof BUDGET_RULES | BudgetRule;
  /** Optional: Tracked expenses for analysis */
  expenses?: ExpenseItem[];
  /** Optional: Custom needs percentage override */
  customNeedsPercent?: number;
  /** Optional: Custom wants percentage override */
  customWantsPercent?: number;
  /** Optional: Custom savings percentage override */
  customSavingsPercent?: number;
  /** Optional: Monthly financial goal target */
  savingsGoalTarget?: number;
  /** Optional: Current emergency fund amount */
  currentEmergencyFund?: number;
  /** Optional: Target emergency fund months */
  emergencyFundMonths?: number;
  /** Optional: High cost of living area */
  isHighCostArea?: boolean;
  /** Optional: Has significant debt */
  hasSignificantDebt?: boolean;
  /** Optional: Annual income for annual projections */
  annualIncome?: number;
}

/**
 * Rule comparison for helping users choose the best budget rule
 */
export interface RuleComparison {
  /** Rule key */
  ruleKey: string;
  /** Rule details */
  rule: BudgetRule;
  /** Needs allocation amount */
  needsAmount: number;
  /** Wants allocation amount */
  wantsAmount: number;
  /** Savings allocation amount */
  savingsAmount: number;
  /** Annual savings with this rule */
  annualSavings: number;
  /** 5-year savings projection (assuming 5% growth) */
  fiveYearProjection: number;
  /** Is this the recommended rule for this user */
  isRecommended: boolean;
  /** Fit score (0-100) based on user's situation */
  fitScore: number;
}

/**
 * Savings optimization suggestion
 */
export interface SavingsOptimization {
  /** Suggestion title */
  title: string;
  /** Detailed description */
  description: string;
  /** Amount that could be saved monthly */
  potentialMonthlySavings: number;
  /** Category this affects */
  category: BudgetCategory;
  /** Subcategory this affects */
  subcategory?: string;
  /** Priority (1 = highest) */
  priority: number;
  /** Projected annual impact */
  annualImpact: number;
}

/**
 * Financial health indicators
 */
export interface BudgetHealthMetrics {
  /** Overall budget health score (0-100) */
  healthScore: number;
  /** Health rating */
  rating: 'excellent' | 'good' | 'fair' | 'needs-work' | 'critical';
  /** Savings rate (savings as % of income) */
  savingsRate: number;
  /** Is savings rate above 20%? */
  isSavingsRateHealthy: boolean;
  /** Essential expense ratio */
  essentialRatio: number;
  /** Is essential ratio below 50%? */
  isEssentialRatioHealthy: boolean;
  /** Months of emergency fund coverage */
  emergencyFundMonths: number;
  /** Is emergency fund adequate? */
  hasAdequateEmergencyFund: boolean;
  /** Key strengths */
  strengths: string[];
  /** Areas for improvement */
  improvements: string[];
}

/**
 * Annual projection data point
 */
export interface AnnualProjection {
  /** Year number (1, 2, 3...) */
  year: number;
  /** Cumulative savings */
  totalSavings: number;
  /** Savings with assumed growth (5% annually) */
  savingsWithGrowth: number;
  /** Cumulative amount toward needs */
  totalNeeds: number;
  /** Cumulative amount toward wants */
  totalWants: number;
}

/**
 * Complete result from budget calculation
 */
export interface BudgetResult {
  /** Monthly after-tax income */
  monthlyIncome: number;
  /** Annual after-tax income */
  annualIncome: number;
  /** Applied budget rule */
  appliedRule: BudgetRule;
  /** Needs category breakdown */
  needs: CategoryBreakdown;
  /** Wants category breakdown */
  wants: CategoryBreakdown;
  /** Savings category breakdown */
  savings: CategoryBreakdown;
  /** Comparison of different budget rules */
  ruleComparisons: RuleComparison[];
  /** Recommended budget rule for this user */
  recommendedRule: string;
  /** Budget health metrics */
  healthMetrics: BudgetHealthMetrics;
  /** Savings optimization suggestions */
  optimizations: SavingsOptimization[];
  /** Annual projections (5 years) */
  annualProjections: AnnualProjection[];
  /** Monthly leftover (unallocated) */
  monthlyLeftover: number;
  /** Personalized recommendations */
  recommendations: string[];
  /** Warnings about budget issues */
  warnings: string[];
  /** Chart data for visualization */
  chartData: {
    category: string;
    amount: number;
    target: number;
    percent: number;
    color: string;
  }[];
}

/**
 * Category colors for consistent visualization
 */
export const BUDGET_CATEGORY_COLORS: Record<BudgetCategory, string> = {
  needs: '#ef4444',    // Red - indicates essential/required
  wants: '#3b82f6',    // Blue - indicates discretionary
  savings: '#22c55e',  // Green - indicates growth/positive
};

/**
 * Subcategory display names
 */
export const SUBCATEGORY_NAMES: Record<string, string> = {
  // Needs
  'housing': 'Housing',
  'utilities': 'Utilities',
  'groceries': 'Groceries',
  'transportation': 'Transportation',
  'health-insurance': 'Health Insurance',
  'minimum-debt': 'Minimum Debt Payments',
  'childcare': 'Childcare',
  'other-essential': 'Other Essential',
  // Wants
  'dining-out': 'Dining Out',
  'entertainment': 'Entertainment',
  'shopping': 'Shopping',
  'subscriptions': 'Subscriptions',
  'travel': 'Travel',
  'personal-care': 'Personal Care',
  'gifts': 'Gifts',
  'other-wants': 'Other Wants',
  // Savings
  'emergency-fund': 'Emergency Fund',
  'retirement': 'Retirement',
  'investments': 'Investments',
  'extra-debt': 'Extra Debt Payments',
  'sinking-funds': 'Sinking Funds',
  'other-savings': 'Other Savings',
};

/**
 * Get the budget rule object from a key or custom rule
 */
function getRule(rule?: keyof typeof BUDGET_RULES | BudgetRule): BudgetRule {
  if (!rule) {
    return BUDGET_RULES['standard'];
  }
  if (typeof rule === 'string') {
    return BUDGET_RULES[rule] || BUDGET_RULES['standard'];
  }
  return rule;
}

/**
 * Calculate category breakdown from expenses
 */
function calculateCategoryBreakdown(
  expenses: ExpenseItem[],
  category: BudgetCategory,
  targetAmount: number,
  targetPercent: number,
  monthlyIncome: number
): CategoryBreakdown {
  const categoryExpenses = expenses.filter(e => e.category === category);
  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
  const difference = targetAmount - total;
  const percentOfIncome = monthlyIncome > 0 ? (total / monthlyIncome) * 100 : 0;
  
  // Calculate subcategory totals
  const subcategories: Record<string, number> = {};
  for (const expense of categoryExpenses) {
    const subcat = expense.subcategory || 'other';
    subcategories[subcat] = (subcategories[subcat] || 0) + expense.amount;
  }
  
  // Determine status (within 5% tolerance for "on-target")
  let status: 'under' | 'on-target' | 'over';
  const tolerance = targetAmount * 0.05;
  if (total < targetAmount - tolerance) {
    status = 'under';
  } else if (total > targetAmount + tolerance) {
    status = 'over';
  } else {
    status = 'on-target';
  }
  
  return {
    total,
    target: targetAmount,
    difference,
    percentOfIncome,
    targetPercent,
    status,
    subcategories,
  };
}

/**
 * Compare budget rules and score them for the user
 */
function compareRules(
  monthlyIncome: number,
  expenses: ExpenseItem[] | undefined,
  isHighCostArea: boolean,
  hasSignificantDebt: boolean
): RuleComparison[] {
  const comparisons: RuleComparison[] = [];
  
  // Calculate actual needs if expenses provided
  let actualNeedsPercent = 50;
  if (expenses && expenses.length > 0) {
    const needsTotal = expenses
      .filter(e => e.category === 'needs')
      .reduce((sum, e) => sum + e.amount, 0);
    actualNeedsPercent = (needsTotal / monthlyIncome) * 100;
  }
  
  for (const [key, rule] of Object.entries(BUDGET_RULES)) {
    const needsAmount = monthlyIncome * (rule.needsPercent / 100);
    const wantsAmount = monthlyIncome * (rule.wantsPercent / 100);
    const savingsAmount = monthlyIncome * (rule.savingsPercent / 100);
    const annualSavings = savingsAmount * 12;
    
    // Calculate 5-year projection with 5% annual growth
    let fiveYearProjection = 0;
    for (let year = 1; year <= 5; year++) {
      fiveYearProjection = (fiveYearProjection + annualSavings) * 1.05;
    }
    
    // Calculate fit score
    let fitScore = 70; // Base score
    
    // Adjust for needs alignment
    const needsDiff = Math.abs(rule.needsPercent - actualNeedsPercent);
    if (needsDiff <= 5) fitScore += 15;
    else if (needsDiff <= 10) fitScore += 10;
    else if (needsDiff <= 15) fitScore += 5;
    else fitScore -= 10;
    
    // Adjust for high cost area
    if (isHighCostArea) {
      if (rule.needsPercent >= 60) fitScore += 10;
      else if (rule.needsPercent <= 50) fitScore -= 10;
    }
    
    // Adjust for debt situation
    if (hasSignificantDebt) {
      if (rule.savingsPercent >= 30) fitScore += 10;
      else if (rule.savingsPercent <= 15) fitScore -= 10;
    }
    
    // Clamp score
    fitScore = Math.max(0, Math.min(100, fitScore));
    
    comparisons.push({
      ruleKey: key,
      rule,
      needsAmount,
      wantsAmount,
      savingsAmount,
      annualSavings,
      fiveYearProjection,
      isRecommended: false, // Will set the best one later
      fitScore,
    });
  }
  
  // Mark the best fit as recommended
  comparisons.sort((a, b) => b.fitScore - a.fitScore);
  if (comparisons.length > 0) {
    comparisons[0].isRecommended = true;
  }
  
  return comparisons;
}

/**
 * Generate savings optimization suggestions
 */
function generateOptimizations(
  needs: CategoryBreakdown,
  wants: CategoryBreakdown,
  savings: CategoryBreakdown,
  monthlyIncome: number
): SavingsOptimization[] {
  const optimizations: SavingsOptimization[] = [];
  let priority = 1;
  
  // Check wants subcategories for common overspending
  if (wants.subcategories['dining-out'] && wants.subcategories['dining-out'] > monthlyIncome * 0.1) {
    const diningAmount = wants.subcategories['dining-out'];
    const suggestedSavings = diningAmount * 0.3; // Suggest 30% reduction
    optimizations.push({
      title: 'Reduce Dining Out',
      description: `You're spending $${diningAmount.toFixed(0)} on dining out. Cooking more meals at home could save $${suggestedSavings.toFixed(0)}/month.`,
      potentialMonthlySavings: suggestedSavings,
      category: 'wants',
      subcategory: 'dining-out',
      priority: priority++,
      annualImpact: suggestedSavings * 12,
    });
  }
  
  // Check subscriptions
  if (wants.subcategories['subscriptions'] && wants.subcategories['subscriptions'] > 100) {
    const subAmount = wants.subcategories['subscriptions'];
    const suggestedSavings = subAmount * 0.4; // Suggest cutting 40% of subscriptions
    optimizations.push({
      title: 'Audit Subscriptions',
      description: `Review $${subAmount.toFixed(0)}/month in subscriptions. Cancel unused services to save $${suggestedSavings.toFixed(0)}/month.`,
      potentialMonthlySavings: suggestedSavings,
      category: 'wants',
      subcategory: 'subscriptions',
      priority: priority++,
      annualImpact: suggestedSavings * 12,
    });
  }
  
  // Check if needs are over 60%
  if (needs.percentOfIncome > 60) {
    const overage = needs.total - (monthlyIncome * 0.5);
    optimizations.push({
      title: 'Lower Essential Expenses',
      description: `Your essentials are ${needs.percentOfIncome.toFixed(0)}% of income. Consider refinancing debt, finding cheaper housing, or reducing utility costs.`,
      potentialMonthlySavings: overage * 0.2, // Realistic 20% reduction target
      category: 'needs',
      priority: priority++,
      annualImpact: (overage * 0.2) * 12,
    });
  }
  
  // Suggest automated savings if not at 20%
  if (savings.percentOfIncome < 20) {
    const shortfall = (monthlyIncome * 0.2) - savings.total;
    optimizations.push({
      title: 'Automate Your Savings',
      description: `Set up automatic transfers of $${shortfall.toFixed(0)}/month to reach the 20% savings target.`,
      potentialMonthlySavings: shortfall,
      category: 'savings',
      priority: priority++,
      annualImpact: shortfall * 12,
    });
  }
  
  // Suggest retirement contribution increase
  if (!savings.subcategories['retirement'] || savings.subcategories['retirement'] < monthlyIncome * 0.1) {
    const currentRetirement = savings.subcategories['retirement'] || 0;
    const suggestedIncrease = (monthlyIncome * 0.1) - currentRetirement;
    if (suggestedIncrease > 0) {
      optimizations.push({
        title: 'Increase Retirement Contributions',
        description: `Aim to save at least 10% for retirement. Increasing by $${suggestedIncrease.toFixed(0)}/month could mean $${(suggestedIncrease * 12 * 30).toFixed(0)}+ over 30 years with compound growth.`,
        potentialMonthlySavings: 0, // This is a reallocation, not savings
        category: 'savings',
        subcategory: 'retirement',
        priority: priority++,
        annualImpact: suggestedIncrease * 12,
      });
    }
  }
  
  return optimizations;
}

/**
 * Calculate budget health metrics
 */
function calculateHealthMetrics(
  needs: CategoryBreakdown,
  wants: CategoryBreakdown,
  savings: CategoryBreakdown,
  monthlyIncome: number,
  currentEmergencyFund?: number,
  monthlyExpenses?: number
): BudgetHealthMetrics {
  const savingsRate = savings.percentOfIncome;
  const essentialRatio = needs.percentOfIncome;
  const emergencyFundMonths = currentEmergencyFund && monthlyExpenses 
    ? currentEmergencyFund / monthlyExpenses 
    : 0;
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  let healthScore = 50; // Base score
  
  // Savings rate scoring
  if (savingsRate >= 30) {
    healthScore += 20;
    strengths.push('Excellent savings rate above 30%');
  } else if (savingsRate >= 20) {
    healthScore += 15;
    strengths.push('Healthy 20%+ savings rate');
  } else if (savingsRate >= 10) {
    healthScore += 5;
    improvements.push('Increase savings rate to 20% for optimal wealth building');
  } else {
    healthScore -= 10;
    improvements.push('Savings rate below 10% - prioritize building savings');
  }
  
  // Essential expenses scoring
  if (essentialRatio <= 50) {
    healthScore += 15;
    strengths.push('Essential expenses within 50% target');
  } else if (essentialRatio <= 60) {
    healthScore += 5;
    improvements.push('Try to reduce essential expenses below 50%');
  } else {
    healthScore -= 10;
    improvements.push('High essential expenses limiting financial flexibility');
  }
  
  // Emergency fund scoring
  if (emergencyFundMonths >= 6) {
    healthScore += 15;
    strengths.push('Strong emergency fund coverage');
  } else if (emergencyFundMonths >= 3) {
    healthScore += 10;
    improvements.push('Build emergency fund to 6 months');
  } else {
    improvements.push('Priority: Build emergency fund to at least 3 months');
  }
  
  // Determine rating
  let rating: BudgetHealthMetrics['rating'];
  if (healthScore >= 85) rating = 'excellent';
  else if (healthScore >= 70) rating = 'good';
  else if (healthScore >= 55) rating = 'fair';
  else if (healthScore >= 40) rating = 'needs-work';
  else rating = 'critical';
  
  return {
    healthScore: Math.max(0, Math.min(100, healthScore)),
    rating,
    savingsRate,
    isSavingsRateHealthy: savingsRate >= 20,
    essentialRatio,
    isEssentialRatioHealthy: essentialRatio <= 50,
    emergencyFundMonths,
    hasAdequateEmergencyFund: emergencyFundMonths >= 3,
    strengths,
    improvements,
  };
}

/**
 * Generate annual projections
 */
function generateProjections(
  monthlySavings: number,
  monthlyNeeds: number,
  monthlyWants: number
): AnnualProjection[] {
  const projections: AnnualProjection[] = [];
  let cumulativeSavings = 0;
  let cumulativeWithGrowth = 0;
  let cumulativeNeeds = 0;
  let cumulativeWants = 0;
  
  for (let year = 1; year <= 5; year++) {
    const annualSavings = monthlySavings * 12;
    cumulativeSavings += annualSavings;
    cumulativeWithGrowth = (cumulativeWithGrowth + annualSavings) * 1.05;
    cumulativeNeeds += monthlyNeeds * 12;
    cumulativeWants += monthlyWants * 12;
    
    projections.push({
      year,
      totalSavings: cumulativeSavings,
      savingsWithGrowth: cumulativeWithGrowth,
      totalNeeds: cumulativeNeeds,
      totalWants: cumulativeWants,
    });
  }
  
  return projections;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  needs: CategoryBreakdown,
  wants: CategoryBreakdown,
  savings: CategoryBreakdown,
  healthMetrics: BudgetHealthMetrics,
  hasExpenses: boolean
): string[] {
  const recommendations: string[] = [];
  
  // Expense tracking recommendation
  if (!hasExpenses) {
    recommendations.push('📊 Track your actual expenses for 1 month to see how your spending compares to targets');
  }
  
  // Category-specific recommendations
  if (needs.status === 'over') {
    recommendations.push('🏠 Your essential expenses exceed target. Review housing, transportation, and debt payments for savings opportunities');
  }
  
  if (wants.status === 'over') {
    recommendations.push('🎯 Wants spending is over budget. Use the 24-hour rule before non-essential purchases');
  }
  
  if (savings.status === 'under') {
    recommendations.push('💰 You have room to increase savings. Consider automating transfers to investment accounts');
  }
  
  // Health-based recommendations
  if (!healthMetrics.hasAdequateEmergencyFund) {
    recommendations.push('🛡️ Priority: Build emergency fund to 3-6 months of expenses before aggressive investing');
  }
  
  if (!healthMetrics.isSavingsRateHealthy) {
    recommendations.push('📈 Target a 20% savings rate. Even small increases compound significantly over time');
  }
  
  // Always include
  recommendations.push('⚡ Automate your budget: Set up automatic transfers on payday to enforce your budget');
  
  return recommendations;
}

/**
 * Generate warnings
 */
function generateWarnings(
  needs: CategoryBreakdown,
  wants: CategoryBreakdown,
  savings: CategoryBreakdown,
  monthlyIncome: number
): string[] {
  const warnings: string[] = [];
  
  if (needs.percentOfIncome > 70) {
    warnings.push('⚠️ Essential expenses exceed 70% of income. This leaves little room for savings and emergencies.');
  }
  
  if (savings.percentOfIncome < 5) {
    warnings.push('⚠️ Savings below 5% of income makes it difficult to build financial security.');
  }
  
  const totalExpenses = needs.total + wants.total + savings.total;
  if (totalExpenses > monthlyIncome) {
    warnings.push(`⚠️ Spending exceeds income by $${(totalExpenses - monthlyIncome).toFixed(0)}. Reduce expenses or increase income.`);
  }
  
  return warnings;
}

/**
 * Calculate budget allocation based on 50/30/20 rule or custom percentages
 * 
 * This is the main function for the 50/30/20 budget calculator. It calculates
 * target allocations for needs, wants, and savings, and optionally analyzes
 * actual expenses against those targets.
 * 
 * @param inputs - Calculation parameters
 * @returns Complete calculation results with recommendations
 * 
 * @example
 * ```typescript
 * // Simple calculation without expense tracking
 * const result = calculateBudget({
 *   monthlyIncome: 5000
 * });
 * 
 * console.log(result.needs.target); // $2,500 (50%)
 * console.log(result.wants.target); // $1,500 (30%)
 * console.log(result.savings.target); // $1,000 (20%)
 * ```
 * 
 * @example
 * ```typescript
 * // With expense tracking
 * const result = calculateBudget({
 *   monthlyIncome: 5000,
 *   expenses: [
 *     { description: 'Rent', amount: 1500, category: 'needs', subcategory: 'housing' },
 *     { description: 'Netflix', amount: 15, category: 'wants', subcategory: 'subscriptions' },
 *     { description: '401k', amount: 500, category: 'savings', subcategory: 'retirement' }
 *   ]
 * });
 * 
 * console.log(result.needs.status); // 'under' if under budget
 * ```
 */
export function calculateBudget(inputs: BudgetInputs): BudgetResult {
  const {
    monthlyIncome,
    budgetRule = 'standard',
    expenses = [],
    customNeedsPercent,
    customWantsPercent,
    customSavingsPercent,
    currentEmergencyFund,
    emergencyFundMonths = 6,
    isHighCostArea = false,
    hasSignificantDebt = false,
    annualIncome,
  } = inputs;
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be greater than zero');
  }
  
  // Get the base rule
  const baseRule = getRule(budgetRule);
  
  // Apply custom percentages if provided
  const appliedRule: BudgetRule = {
    ...baseRule,
    needsPercent: customNeedsPercent ?? baseRule.needsPercent,
    wantsPercent: customWantsPercent ?? baseRule.wantsPercent,
    savingsPercent: customSavingsPercent ?? baseRule.savingsPercent,
  };
  
  // Ensure percentages add to 100 (or normalize)
  const totalPercent = appliedRule.needsPercent + appliedRule.wantsPercent + appliedRule.savingsPercent;
  if (totalPercent !== 100) {
    const factor = 100 / totalPercent;
    appliedRule.needsPercent *= factor;
    appliedRule.wantsPercent *= factor;
    appliedRule.savingsPercent *= factor;
  }
  
  // Calculate target amounts
  const needsTarget = monthlyIncome * (appliedRule.needsPercent / 100);
  const wantsTarget = monthlyIncome * (appliedRule.wantsPercent / 100);
  const savingsTarget = monthlyIncome * (appliedRule.savingsPercent / 100);
  
  // Calculate category breakdowns
  const hasExpenses = expenses.length > 0;
  
  const needs = hasExpenses
    ? calculateCategoryBreakdown(expenses, 'needs', needsTarget, appliedRule.needsPercent, monthlyIncome)
    : {
        total: 0,
        target: needsTarget,
        difference: needsTarget,
        percentOfIncome: 0,
        targetPercent: appliedRule.needsPercent,
        status: 'under' as const,
        subcategories: {},
      };
  
  const wants = hasExpenses
    ? calculateCategoryBreakdown(expenses, 'wants', wantsTarget, appliedRule.wantsPercent, monthlyIncome)
    : {
        total: 0,
        target: wantsTarget,
        difference: wantsTarget,
        percentOfIncome: 0,
        targetPercent: appliedRule.wantsPercent,
        status: 'under' as const,
        subcategories: {},
      };
  
  const savings = hasExpenses
    ? calculateCategoryBreakdown(expenses, 'savings', savingsTarget, appliedRule.savingsPercent, monthlyIncome)
    : {
        total: 0,
        target: savingsTarget,
        difference: savingsTarget,
        percentOfIncome: 0,
        targetPercent: appliedRule.savingsPercent,
        status: 'under' as const,
        subcategories: {},
      };
  
  // Compare rules
  const ruleComparisons = compareRules(monthlyIncome, expenses, isHighCostArea, hasSignificantDebt);
  const recommendedRule = ruleComparisons.find(r => r.isRecommended)?.ruleKey || 'standard';
  
  // Calculate health metrics
  const monthlyExpenses = needs.total + wants.total;
  const healthMetrics = calculateHealthMetrics(
    needs,
    wants,
    savings,
    monthlyIncome,
    currentEmergencyFund,
    monthlyExpenses > 0 ? monthlyExpenses : monthlyIncome * 0.8
  );
  
  // Generate optimizations
  const optimizations = hasExpenses
    ? generateOptimizations(needs, wants, savings, monthlyIncome)
    : [];
  
  // Generate projections
  const annualProjections = generateProjections(
    hasExpenses ? savings.total : savingsTarget,
    hasExpenses ? needs.total : needsTarget,
    hasExpenses ? wants.total : wantsTarget
  );
  
  // Calculate leftover
  const totalTracked = needs.total + wants.total + savings.total;
  const monthlyLeftover = hasExpenses ? monthlyIncome - totalTracked : 0;
  
  // Generate recommendations and warnings
  const recommendations = generateRecommendations(needs, wants, savings, healthMetrics, hasExpenses);
  const warnings = generateWarnings(needs, wants, savings, monthlyIncome);
  
  // Prepare chart data
  const chartData = [
    {
      category: 'Needs',
      amount: hasExpenses ? needs.total : needsTarget,
      target: needsTarget,
      percent: hasExpenses ? needs.percentOfIncome : appliedRule.needsPercent,
      color: BUDGET_CATEGORY_COLORS.needs,
    },
    {
      category: 'Wants',
      amount: hasExpenses ? wants.total : wantsTarget,
      target: wantsTarget,
      percent: hasExpenses ? wants.percentOfIncome : appliedRule.wantsPercent,
      color: BUDGET_CATEGORY_COLORS.wants,
    },
    {
      category: 'Savings',
      amount: hasExpenses ? savings.total : savingsTarget,
      target: savingsTarget,
      percent: hasExpenses ? savings.percentOfIncome : appliedRule.savingsPercent,
      color: BUDGET_CATEGORY_COLORS.savings,
    },
  ];
  
  return {
    monthlyIncome,
    annualIncome: annualIncome ?? monthlyIncome * 12,
    appliedRule,
    needs,
    wants,
    savings,
    ruleComparisons,
    recommendedRule,
    healthMetrics,
    optimizations,
    annualProjections,
    monthlyLeftover,
    recommendations,
    warnings,
    chartData,
  };
}

/**
 * Quick calculation for 50/30/20 budget allocation
 * 
 * @param monthlyIncome - Monthly after-tax income
 * @returns Object with needs, wants, and savings amounts
 */
export function quickBudget(monthlyIncome: number): { needs: number; wants: number; savings: number } {
  return {
    needs: monthlyIncome * 0.5,
    wants: monthlyIncome * 0.3,
    savings: monthlyIncome * 0.2,
  };
}

/**
 * Calculate how much you can afford for a specific category
 * 
 * @param monthlyIncome - Monthly after-tax income
 * @param category - Budget category
 * @param rule - Budget rule to use (default: standard 50/30/20)
 * @returns Maximum monthly amount for that category
 */
export function categoryBudget(
  monthlyIncome: number,
  category: BudgetCategory,
  rule: keyof typeof BUDGET_RULES = 'standard'
): number {
  const budgetRule = BUDGET_RULES[rule];
  switch (category) {
    case 'needs':
      return monthlyIncome * (budgetRule.needsPercent / 100);
    case 'wants':
      return monthlyIncome * (budgetRule.wantsPercent / 100);
    case 'savings':
      return monthlyIncome * (budgetRule.savingsPercent / 100);
  }
}

/**
 * Calculate annual savings projection with compound growth
 * 
 * @param monthlySavings - Monthly savings amount
 * @param years - Number of years to project
 * @param annualReturn - Expected annual return (default 7%)
 * @returns Total value after specified years
 */
export function projectSavings(
  monthlySavings: number,
  years: number,
  annualReturn: number = 7
): number {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  
  // Future value of annuity formula
  if (monthlyRate === 0) {
    return monthlySavings * months;
  }
  
  return monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

/**
 * Suggest the best budget rule based on situation
 * 
 * @param monthlyIncome - Monthly after-tax income
 * @param monthlyNeeds - Current monthly essential expenses
 * @param isHighCostArea - Lives in high cost of living area
 * @param hasDebt - Has significant debt to pay off
 * @returns Recommended budget rule key
 */
export function suggestBudgetRule(
  monthlyIncome: number,
  monthlyNeeds: number,
  isHighCostArea: boolean = false,
  hasDebt: boolean = false
): keyof typeof BUDGET_RULES {
  const needsPercent = (monthlyNeeds / monthlyIncome) * 100;
  
  // High needs percentage
  if (needsPercent > 60) {
    return isHighCostArea ? 'high-cost-living' : 'minimalist';
  }
  
  // Starter situation
  if (needsPercent > 70) {
    return 'paycheck-to-paycheck';
  }
  
  // Debt-focused
  if (hasDebt) {
    return 'debt-focused';
  }
  
  // High cost area with manageable needs
  if (isHighCostArea && needsPercent > 50) {
    return 'high-cost-living';
  }
  
  // Standard situation
  return 'standard';
}
