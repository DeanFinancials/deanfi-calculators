/**
 * FIRE (Financial Independence Retire Early) Calculator
 * 
 * Calculates time to financial independence based on income, savings rate,
 * investment returns, and retirement spending. Features multiple FIRE types
 * (Lean, Regular, Fat, Coast, Barista), historical stress testing, and
 * comprehensive projections.
 * 
 * @see https://www.npmjs.com/package/@deanfinancials/calculators
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Type of FIRE goal
 * - lean: Minimal lifestyle, low spending (25x lean expenses)
 * - regular: Standard FIRE (25x normal expenses)
 * - fat: Comfortable lifestyle (25x higher expenses)
 * - coast: Stop saving, let investments grow
 * - barista: Part-time work to cover gap
 */
export type FIREType = 'lean' | 'regular' | 'fat' | 'coast' | 'barista';

/**
 * Withdrawal strategy type
 * - fixed: Traditional 4% rule (constant inflation-adjusted)
 * - percentage: Variable percentage of portfolio
 * - dynamic: Guardrails-based (Guyton-Klinger style)
 */
export type WithdrawalStrategy = 'fixed' | 'percentage' | 'dynamic';

/**
 * Input parameters for FIRE calculation
 */
export interface FIREInputs {
  /** Current age */
  currentAge: number;
  /** Target retirement age (optional - calculator determines earliest possible) */
  targetRetirementAge?: number;
  /** Life expectancy for planning purposes (default: 95) */
  lifeExpectancy?: number;
  /** Current annual gross income */
  annualIncome: number;
  /** Expected annual income growth rate (default: 2%) */
  incomeGrowthRate?: number;
  /** Current total invested assets */
  currentSavings: number;
  /** Annual expenses in retirement (post-tax) */
  annualExpenses: number;
  /** Expected inflation rate (default: 3%) */
  inflationRate?: number;
  /** Expected nominal investment return (default: 7%) */
  expectedReturn?: number;
  /** Safe withdrawal rate (default: 4%) */
  safeWithdrawalRate?: number;
  /** Monthly savings amount (alternative to savings rate) */
  monthlySavings?: number;
  /** Savings rate as percentage of gross income (alternative to monthly savings) */
  savingsRate?: number;
  /** Type of FIRE goal (default: regular) */
  fireType?: FIREType;
  /** Expected Social Security annual benefit (0 if not applicable) */
  socialSecurityBenefit?: number;
  /** Age to start receiving Social Security (default: 67) */
  socialSecurityStartAge?: number;
  /** Expected pension annual benefit (0 if not applicable) */
  pensionBenefit?: number;
  /** Age to start receiving pension */
  pensionStartAge?: number;
  /** Include historical stress testing (default: true) */
  includeStressTest?: boolean;
  /** For Barista FIRE: expected annual part-time income */
  partTimeIncome?: number;
  /** For Barista FIRE: years of part-time work planned */
  partTimeYears?: number;
}

/**
 * Yearly projection data point
 */
export interface YearlyFIREProjection {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Age at this year */
  age: number;
  /** Calendar year */
  calendarYear: number;
  /** Portfolio balance at start of year */
  startBalance: number;
  /** Contributions made this year */
  contributions: number;
  /** Investment returns earned */
  returns: number;
  /** Withdrawals made (if in retirement) */
  withdrawals: number;
  /** Portfolio balance at end of year */
  endBalance: number;
  /** Whether FIRE has been achieved at this point */
  fireAchieved: boolean;
  /** Social Security income (if applicable) */
  socialSecurityIncome: number;
  /** Pension income (if applicable) */
  pensionIncome: number;
  /** Total income for the year */
  totalIncome: number;
  /** Expenses for the year (inflation adjusted) */
  expenses: number;
  /** Savings rate for this year */
  savingsRate: number;
  /** FIRE progress percentage */
  fireProgress: number;
}

/**
 * FIRE milestone achieved
 */
export interface FIREMilestone {
  /** Milestone name */
  name: string;
  /** Target amount */
  amount: number;
  /** Year achieved (from start) */
  yearAchieved: number;
  /** Age when achieved */
  ageAchieved: number;
  /** Description */
  description: string;
}

/**
 * Historical crisis stress test result
 */
export interface StressTestScenario {
  /** Crisis name */
  name: string;
  /** Start year of crisis */
  startYear: number;
  /** Brief description */
  description: string;
  /** Whether portfolio survived 30 years */
  survived: boolean;
  /** Years portfolio lasted (if didn't survive) */
  yearsLasted: number | null;
  /** Lowest portfolio value reached */
  lowestBalance: number;
  /** Year of lowest balance */
  lowestBalanceYear: number;
  /** Recovery time in years (to original value) */
  recoveryYears: number | null;
  /** Final portfolio value after 30 years */
  finalBalance: number | null;
  /** Recommendation for this scenario */
  recommendation: string;
}

/**
 * Coast FIRE analysis
 */
export interface CoastFIREAnalysis {
  /** Whether Coast FIRE is already achieved */
  achieved: boolean;
  /** Current coast FIRE target (what you need now to coast) */
  coastTarget: number;
  /** Age when Coast FIRE will be achieved */
  coastAge: number;
  /** Years until Coast FIRE */
  yearsToCoast: number;
  /** Monthly savings if coasting now */
  monthlyToCoast: number;
  /** Target portfolio at traditional retirement age */
  targetAtRetirement: number;
}

/**
 * Barista FIRE analysis
 */
export interface BaristaFIREAnalysis {
  /** Whether Barista FIRE is achievable */
  achievable: boolean;
  /** Required part-time annual income */
  requiredPartTimeIncome: number;
  /** Portfolio needed for Barista FIRE */
  portfolioNeeded: number;
  /** Age when Barista FIRE achievable */
  baristaAge: number;
  /** Years until Barista FIRE */
  yearsToBarista: number;
  /** Gap between portfolio income and expenses */
  incomeGap: number;
}

/**
 * Sensitivity analysis showing how changes affect timeline
 */
export interface SensitivityAnalysis {
  /** Factor being analyzed */
  factor: string;
  /** Base value */
  baseValue: number;
  /** Base years to FIRE */
  baseYears: number;
  /** Results at different values */
  scenarios: {
    value: number;
    yearsToFire: number;
    difference: number;
  }[];
}

/**
 * Main FIRE calculation result
 */
export interface FIREResult {
  // Core Results
  /** FIRE number (portfolio needed) */
  fireNumber: number;
  /** Years to reach FIRE */
  yearsToFire: number;
  /** Age at FIRE */
  fireAge: number;
  /** Calendar year of FIRE */
  fireYear: number;
  /** Whether FIRE is already achieved */
  alreadyAchieved: boolean;
  /** Current progress toward FIRE (percentage) */
  fireProgress: number;
  
  // Savings Analysis
  /** Current annual savings */
  annualSavings: number;
  /** Current monthly savings */
  monthlySavings: number;
  /** Effective savings rate */
  savingsRate: number;
  /** Total contributions until FIRE */
  totalContributions: number;
  /** Total investment returns until FIRE */
  totalReturns: number;
  
  // Withdrawal Analysis
  /** Safe annual withdrawal amount */
  safeAnnualWithdrawal: number;
  /** Safe monthly withdrawal amount */
  safeMonthlyWithdrawal: number;
  /** Years portfolio will last in retirement */
  portfolioLifespan: number;
  /** Probability of success (simplified estimate) */
  successProbability: number;
  
  // Alternative FIRE Types
  /** Coast FIRE analysis */
  coastFire: CoastFIREAnalysis;
  /** Barista FIRE analysis */
  baristaFire: BaristaFIREAnalysis;
  /** Lean FIRE number (minimal expenses) */
  leanFireNumber: number;
  /** Fat FIRE number (comfortable expenses) */
  fatFireNumber: number;
  
  // Projections
  /** Year-by-year projections */
  projections: YearlyFIREProjection[];
  /** Key milestones */
  milestones: FIREMilestone[];
  
  // Stress Testing
  /** Historical stress test results */
  stressTests: StressTestScenario[];
  /** Overall stress test score (0-100) */
  stressTestScore: number;
  
  // Sensitivity Analysis
  /** How changes in key factors affect timeline */
  sensitivityAnalysis: SensitivityAnalysis[];
  
  // Recommendations
  /** Personalized recommendations */
  recommendations: string[];
  /** Warnings about the plan */
  warnings: string[];
  
  // Summary Statistics
  /** Summary text */
  summary: string;
  /** Time until financial freedom */
  timeUntilFreedom: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Historical market crisis data for stress testing
 * Returns are approximate annual returns during each crisis
 */
export const HISTORICAL_CRISES = {
  'great-depression-1929': {
    name: 'Great Depression (1929)',
    startYear: 1929,
    description: 'Worst market crash in US history, 89% decline',
    returns: [-8.3, -25.1, -43.8, -8.6, 49.7, -1.2, 46.7, 31.9, -35.3, 29.3, -1.1, -10.7, -12.8, 19.2, 25.1]
  },
  'stagflation-1973': {
    name: 'Stagflation (1973-1974)',
    startYear: 1973,
    description: 'Oil crisis with high inflation and market decline',
    returns: [-14.7, -26.5, 37.2, 23.8, -7.2, 6.6, 18.4, 32.4, -4.9, 21.4, 22.5, 6.3, 31.5, 18.5, 5.2]
  },
  'dotcom-crash-2000': {
    name: 'Dot-Com Crash (2000)',
    startYear: 2000,
    description: 'Tech bubble burst, followed by 9/11',
    returns: [-9.1, -11.9, -22.1, 28.7, 10.9, 4.9, 15.8, 5.5, -37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7]
  },
  'financial-crisis-2008': {
    name: 'Financial Crisis (2008)',
    startYear: 2008,
    description: 'Housing crash and global financial crisis',
    returns: [-37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7, 1.4, 12.0, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1]
  },
  'covid-crash-2020': {
    name: 'COVID Crash (2020)',
    startYear: 2020,
    description: 'Pandemic-induced market crash and recovery',
    returns: [18.4, 28.7, -18.1, 26.3, 10.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0]
  }
} as const;

/**
 * FIRE multipliers for different types
 */
export const FIRE_MULTIPLIERS: Record<FIREType, number> = {
  'lean': 25,    // Same multiplier but with reduced expenses
  'regular': 25, // Standard 4% rule (100/4 = 25x)
  'fat': 25,     // Same multiplier but with higher expenses
  'coast': 25,
  'barista': 25
};

/**
 * Expense multipliers for different FIRE types
 */
export const EXPENSE_MULTIPLIERS: Record<FIREType, number> = {
  'lean': 0.7,    // 70% of normal expenses
  'regular': 1.0, // 100% of normal expenses
  'fat': 1.5,     // 150% of normal expenses
  'coast': 1.0,
  'barista': 1.0
};

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate the FIRE number based on annual expenses and withdrawal rate
 */
export function calculateFIRENumber(
  annualExpenses: number,
  safeWithdrawalRate: number = 0.04,
  fireType: FIREType = 'regular'
): number {
  const expenseMultiplier = EXPENSE_MULTIPLIERS[fireType];
  const adjustedExpenses = annualExpenses * expenseMultiplier;
  return adjustedExpenses / safeWithdrawalRate;
}

/**
 * Calculate years to FIRE using iterative approach
 */
export function calculateYearsToFire(
  currentSavings: number,
  annualSavings: number,
  fireNumber: number,
  expectedReturn: number,
  inflationRate: number = 0.03
): number {
  if (currentSavings >= fireNumber) return 0;
  if (annualSavings <= 0) return Infinity;
  
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  let balance = currentSavings;
  let years = 0;
  const maxYears = 100;
  
  while (balance < fireNumber && years < maxYears) {
    balance = balance * (1 + realReturn) + annualSavings;
    years++;
  }
  
  return years >= maxYears ? Infinity : years;
}

/**
 * Calculate savings rate from income and savings
 */
export function calculateSavingsRate(
  annualIncome: number,
  annualSavings: number
): number {
  if (annualIncome <= 0) return 0;
  return Math.min(1, Math.max(0, annualSavings / annualIncome));
}

/**
 * Calculate Coast FIRE target
 * The amount needed now to reach FIRE by a target age with zero additional savings
 */
export function calculateCoastFIRETarget(
  fireNumber: number,
  yearsToRetirement: number,
  expectedReturn: number,
  inflationRate: number = 0.03
): number {
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  return fireNumber / Math.pow(1 + realReturn, yearsToRetirement);
}

/**
 * Calculate Barista FIRE requirements
 */
export function calculateBaristaFIRERequirements(
  annualExpenses: number,
  currentSavings: number,
  expectedReturn: number,
  safeWithdrawalRate: number = 0.04
): { portfolioNeeded: number; incomeGap: number } {
  // With part-time income, you need less from portfolio
  const portfolioIncome = currentSavings * safeWithdrawalRate;
  const incomeGap = Math.max(0, annualExpenses - portfolioIncome);
  
  // Portfolio needed to cover half of expenses (other half from work)
  const halfExpenses = annualExpenses * 0.5;
  const portfolioNeeded = halfExpenses / safeWithdrawalRate;
  
  return { portfolioNeeded, incomeGap };
}

/**
 * Estimate success probability based on withdrawal rate and timeline
 * Simplified estimate based on Trinity Study findings
 */
export function estimateSuccessProbability(
  safeWithdrawalRate: number,
  retirementYears: number
): number {
  // Base probabilities from Trinity Study (stocks/bonds mix)
  const baseRates: Record<string, number> = {
    '0.03': 98,
    '0.035': 95,
    '0.04': 91,
    '0.045': 82,
    '0.05': 72,
    '0.055': 58,
    '0.06': 45
  };
  
  const rateKey = (Math.round(safeWithdrawalRate * 200) / 200).toFixed(3);
  let baseProbability = baseRates[rateKey] ?? 
    (safeWithdrawalRate <= 0.03 ? 99 : safeWithdrawalRate >= 0.06 ? 40 : 75);
  
  // Adjust for longer retirement periods
  if (retirementYears > 30) {
    baseProbability -= (retirementYears - 30) * 0.5;
  } else if (retirementYears < 30) {
    baseProbability += (30 - retirementYears) * 0.3;
  }
  
  return Math.min(99, Math.max(1, baseProbability));
}

/**
 * Run a historical stress test scenario
 */
export function runStressTest(
  initialPortfolio: number,
  annualWithdrawal: number,
  inflationRate: number,
  returns: number[],
  years: number = 30
): {
  survived: boolean;
  yearsLasted: number | null;
  lowestBalance: number;
  lowestBalanceYear: number;
  finalBalance: number | null;
  recoveryYears: number | null;
} {
  let portfolio = initialPortfolio;
  let withdrawal = annualWithdrawal;
  let lowestBalance = portfolio;
  let lowestBalanceYear = 0;
  let yearBelowInitial = 0;
  let recoveryYears: number | null = null;
  
  for (let year = 0; year < years; year++) {
    // Get return for this year (cycle through if needed)
    const returnRate = (returns[year % returns.length] ?? 7) / 100;
    
    // Apply return
    portfolio = portfolio * (1 + returnRate);
    
    // Withdraw expenses (inflation adjusted)
    withdrawal = withdrawal * (1 + inflationRate);
    portfolio -= withdrawal;
    
    // Track lowest point
    if (portfolio < lowestBalance) {
      lowestBalance = portfolio;
      lowestBalanceYear = year + 1;
    }
    
    // Track recovery
    if (portfolio < initialPortfolio && recoveryYears === null) {
      yearBelowInitial = year + 1;
    } else if (portfolio >= initialPortfolio && recoveryYears === null && yearBelowInitial > 0) {
      recoveryYears = year + 1 - yearBelowInitial;
    }
    
    // Check if portfolio depleted
    if (portfolio <= 0) {
      return {
        survived: false,
        yearsLasted: year + 1,
        lowestBalance: Math.max(0, lowestBalance),
        lowestBalanceYear,
        finalBalance: null,
        recoveryYears
      };
    }
  }
  
  return {
    survived: true,
    yearsLasted: null,
    lowestBalance,
    lowestBalanceYear,
    finalBalance: portfolio,
    recoveryYears
  };
}

/**
 * Generate year-by-year projections
 */
export function generateProjections(
  inputs: FIREInputs,
  fireNumber: number,
  yearsToProject: number
): YearlyFIREProjection[] {
  const projections: YearlyFIREProjection[] = [];
  const currentYear = new Date().getFullYear();
  
  const {
    currentAge,
    annualIncome,
    incomeGrowthRate = 0.02,
    currentSavings,
    annualExpenses,
    inflationRate = 0.03,
    expectedReturn = 0.07,
    safeWithdrawalRate = 0.04,
    monthlySavings,
    savingsRate,
    socialSecurityBenefit = 0,
    socialSecurityStartAge = 67,
    pensionBenefit = 0,
    pensionStartAge = 65
  } = inputs;
  
  // Calculate annual savings
  let annualSavings: number;
  if (monthlySavings !== undefined) {
    annualSavings = monthlySavings * 12;
  } else if (savingsRate !== undefined) {
    annualSavings = annualIncome * savingsRate;
  } else {
    annualSavings = annualIncome - annualExpenses;
  }
  
  let balance = currentSavings;
  let income = annualIncome;
  let expenses = annualExpenses;
  let fireAchieved = balance >= fireNumber;
  
  for (let year = 1; year <= yearsToProject; year++) {
    const age = currentAge + year;
    const calendarYear = currentYear + year;
    
    // Social Security income
    const ssIncome = age >= socialSecurityStartAge ? socialSecurityBenefit : 0;
    
    // Pension income
    const pensionIncome = age >= pensionStartAge ? pensionBenefit : 0;
    
    const startBalance = balance;
    
    // Calculate contributions or withdrawals
    let contributions = 0;
    let withdrawals = 0;
    
    if (!fireAchieved) {
      // Still accumulating
      income = income * (1 + incomeGrowthRate);
      contributions = annualSavings * Math.pow(1 + incomeGrowthRate, year - 1);
    } else {
      // In retirement - withdraw
      const totalRetirementIncome = ssIncome + pensionIncome;
      const neededFromPortfolio = Math.max(0, expenses - totalRetirementIncome);
      withdrawals = neededFromPortfolio;
    }
    
    // Investment returns
    const returns = balance * expectedReturn;
    
    // Update balance
    balance = balance + returns + contributions - withdrawals;
    
    // Inflate expenses
    expenses = expenses * (1 + inflationRate);
    
    // Check if FIRE achieved
    if (!fireAchieved && balance >= fireNumber) {
      fireAchieved = true;
    }
    
    // Calculate savings rate for this year
    const yearSavingsRate = !fireAchieved && income > 0 
      ? contributions / income 
      : 0;
    
    // FIRE progress
    const fireProgress = Math.min(100, (balance / fireNumber) * 100);
    
    projections.push({
      year,
      age,
      calendarYear,
      startBalance,
      contributions,
      returns,
      withdrawals,
      endBalance: balance,
      fireAchieved,
      socialSecurityIncome: ssIncome,
      pensionIncome,
      totalIncome: income + ssIncome + pensionIncome,
      expenses,
      savingsRate: yearSavingsRate,
      fireProgress
    });
  }
  
  return projections;
}

/**
 * Generate FIRE milestones
 */
export function generateMilestones(
  fireNumber: number,
  currentSavings: number,
  projections: YearlyFIREProjection[],
  currentAge: number
): FIREMilestone[] {
  const milestones: FIREMilestone[] = [];
  const percentages = [25, 50, 75, 100];
  
  for (const pct of percentages) {
    const targetAmount = fireNumber * (pct / 100);
    
    // Check if already achieved
    if (currentSavings >= targetAmount) {
      milestones.push({
        name: `${pct}% of FIRE Number`,
        amount: targetAmount,
        yearAchieved: 0,
        ageAchieved: currentAge,
        description: `Already achieved! You have ${pct}% of your FIRE number.`
      });
      continue;
    }
    
    // Find when milestone is achieved
    const achievedProjection = projections.find(p => p.endBalance >= targetAmount);
    
    if (achievedProjection) {
      milestones.push({
        name: `${pct}% of FIRE Number`,
        amount: targetAmount,
        yearAchieved: achievedProjection.year,
        ageAchieved: achievedProjection.age,
        description: pct === 100 
          ? 'Financial Independence achieved!' 
          : `You'll reach ${pct}% of your FIRE goal.`
      });
    }
  }
  
  // Add Coast FIRE milestone
  const coastTarget = calculateCoastFIRETarget(
    fireNumber,
    Math.max(1, 65 - currentAge),
    0.07,
    0.03
  );
  
  const coastProjection = projections.find(p => p.endBalance >= coastTarget);
  if (coastProjection && coastProjection.year < projections.length) {
    milestones.push({
      name: 'Coast FIRE',
      amount: coastTarget,
      yearAchieved: coastProjection.year,
      ageAchieved: coastProjection.age,
      description: 'You can stop saving and still reach FIRE by 65.'
    });
  }
  
  return milestones.sort((a, b) => a.amount - b.amount);
}

/**
 * Generate sensitivity analysis
 */
export function generateSensitivityAnalysis(
  inputs: FIREInputs,
  baseYearsToFire: number
): SensitivityAnalysis[] {
  const analyses: SensitivityAnalysis[] = [];
  
  const {
    currentSavings,
    annualExpenses,
    expectedReturn = 0.07,
    inflationRate = 0.03,
    safeWithdrawalRate = 0.04,
    monthlySavings,
    savingsRate,
    annualIncome
  } = inputs;
  
  const annualSavings = monthlySavings 
    ? monthlySavings * 12 
    : (savingsRate ?? 0.2) * annualIncome;
  
  // Savings rate sensitivity
  const savingsRateScenarios = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  analyses.push({
    factor: 'Savings Rate',
    baseValue: annualSavings / annualIncome,
    baseYears: baseYearsToFire,
    scenarios: savingsRateScenarios.map(rate => {
      const newSavings = annualIncome * rate;
      const fireNum = calculateFIRENumber(annualExpenses, safeWithdrawalRate);
      const years = calculateYearsToFire(currentSavings, newSavings, fireNum, expectedReturn, inflationRate);
      return {
        value: rate,
        yearsToFire: years,
        difference: years - baseYearsToFire
      };
    })
  });
  
  // Return rate sensitivity
  const returnRateScenarios = [0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10];
  analyses.push({
    factor: 'Expected Return',
    baseValue: expectedReturn,
    baseYears: baseYearsToFire,
    scenarios: returnRateScenarios.map(rate => {
      const fireNum = calculateFIRENumber(annualExpenses, safeWithdrawalRate);
      const years = calculateYearsToFire(currentSavings, annualSavings, fireNum, rate, inflationRate);
      return {
        value: rate,
        yearsToFire: years,
        difference: years - baseYearsToFire
      };
    })
  });
  
  // Withdrawal rate sensitivity
  const withdrawalRateScenarios = [0.03, 0.035, 0.04, 0.045, 0.05];
  analyses.push({
    factor: 'Withdrawal Rate',
    baseValue: safeWithdrawalRate,
    baseYears: baseYearsToFire,
    scenarios: withdrawalRateScenarios.map(rate => {
      const fireNum = calculateFIRENumber(annualExpenses, rate);
      const years = calculateYearsToFire(currentSavings, annualSavings, fireNum, expectedReturn, inflationRate);
      return {
        value: rate,
        yearsToFire: years,
        difference: years - baseYearsToFire
      };
    })
  });
  
  return analyses;
}

/**
 * Generate personalized recommendations
 */
export function generateRecommendations(
  inputs: FIREInputs,
  result: Partial<FIREResult>
): string[] {
  const recommendations: string[] = [];
  const savingsRate = result.savingsRate ?? 0;
  const yearsToFire = result.yearsToFire ?? Infinity;
  
  if (savingsRate < 0.15) {
    recommendations.push(
      'Consider increasing your savings rate to at least 15%. Even small increases can significantly reduce your time to FIRE.'
    );
  }
  
  if (savingsRate < 0.5 && yearsToFire > 15) {
    recommendations.push(
      'To reach FIRE faster, focus on increasing income through career advancement, side hustles, or skill development.'
    );
  }
  
  if (inputs.annualExpenses > inputs.annualIncome * 0.6) {
    recommendations.push(
      'Your expenses consume over 60% of income. Review spending categories for potential cuts without sacrificing quality of life.'
    );
  }
  
  if ((inputs.expectedReturn ?? 0.07) > 0.08) {
    recommendations.push(
      'Your expected return is optimistic. Consider using 6-7% for more conservative planning.'
    );
  }
  
  if (result.coastFire?.achieved) {
    recommendations.push(
      'You\'ve reached Coast FIRE! You could stop saving and still retire comfortably. Consider if work-life balance changes make sense.'
    );
  }
  
  if (inputs.socialSecurityBenefit === 0 || inputs.socialSecurityBenefit === undefined) {
    recommendations.push(
      'Consider including Social Security estimates for more accurate long-term projections. Even conservative estimates help with planning.'
    );
  }
  
  if (yearsToFire <= 10) {
    recommendations.push(
      'You\'re within 10 years of FIRE! Start planning your transition: consider healthcare coverage, sequence of returns risk, and withdrawal strategies.'
    );
  }
  
  if (result.stressTestScore !== undefined && result.stressTestScore < 70) {
    recommendations.push(
      'Your plan shows vulnerability to market downturns. Consider building a larger cash buffer or reducing withdrawal rate.'
    );
  }
  
  return recommendations;
}

/**
 * Generate warnings about the plan
 */
export function generateWarnings(
  inputs: FIREInputs,
  result: Partial<FIREResult>
): string[] {
  const warnings: string[] = [];
  
  const safeWithdrawalRate = inputs.safeWithdrawalRate ?? 0.04;
  const retirementYears = (inputs.lifeExpectancy ?? 95) - (result.fireAge ?? 65);
  
  if (safeWithdrawalRate > 0.04) {
    warnings.push(
      `Your withdrawal rate of ${(safeWithdrawalRate * 100).toFixed(1)}% is above the traditional 4% rule. This increases risk of running out of money.`
    );
  }
  
  if (retirementYears > 40) {
    warnings.push(
      `Planning for ${retirementYears} years of retirement requires extra caution. Consider a lower withdrawal rate or larger cushion.`
    );
  }
  
  if ((inputs.expectedReturn ?? 0.07) > 0.1) {
    warnings.push(
      'Expected returns above 10% are historically unusual. Use conservative estimates for safety.'
    );
  }
  
  if (result.yearsToFire === Infinity) {
    warnings.push(
      'Based on current numbers, FIRE may not be achievable. Consider increasing savings or reducing target expenses.'
    );
  }
  
  if ((result.fireAge ?? 0) > 70) {
    warnings.push(
      'Your projected FIRE age is above traditional retirement age. Consider adjusting your plan or expectations.'
    );
  }
  
  return warnings;
}

// ============================================================================
// Main Calculator Function
// ============================================================================

/**
 * Calculate comprehensive FIRE analysis
 */
export function calculateFIRE(inputs: FIREInputs): FIREResult {
  const {
    currentAge,
    targetRetirementAge,
    lifeExpectancy = 95,
    annualIncome,
    incomeGrowthRate = 0.02,
    currentSavings,
    annualExpenses,
    inflationRate = 0.03,
    expectedReturn = 0.07,
    safeWithdrawalRate = 0.04,
    monthlySavings,
    savingsRate,
    fireType = 'regular',
    socialSecurityBenefit = 0,
    socialSecurityStartAge = 67,
    pensionBenefit = 0,
    pensionStartAge = 65,
    includeStressTest = true,
    partTimeIncome = 0,
    partTimeYears = 5
  } = inputs;
  
  // Calculate annual savings
  let annualSavings: number;
  if (monthlySavings !== undefined) {
    annualSavings = monthlySavings * 12;
  } else if (savingsRate !== undefined) {
    annualSavings = annualIncome * savingsRate;
  } else {
    annualSavings = Math.max(0, annualIncome - annualExpenses);
  }
  
  const effectiveSavingsRate = calculateSavingsRate(annualIncome, annualSavings);
  
  // Calculate FIRE numbers for different types
  const fireNumber = calculateFIRENumber(annualExpenses, safeWithdrawalRate, fireType);
  const leanFireNumber = calculateFIRENumber(annualExpenses, safeWithdrawalRate, 'lean');
  const fatFireNumber = calculateFIRENumber(annualExpenses, safeWithdrawalRate, 'fat');
  
  // Calculate years to FIRE
  const yearsToFire = calculateYearsToFire(
    currentSavings,
    annualSavings,
    fireNumber,
    expectedReturn,
    inflationRate
  );
  
  const alreadyAchieved = currentSavings >= fireNumber;
  const fireAge = currentAge + yearsToFire;
  const fireYear = new Date().getFullYear() + yearsToFire;
  const fireProgress = Math.min(100, (currentSavings / fireNumber) * 100);
  
  // Calculate total contributions and returns
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  let runningBalance = currentSavings;
  let totalContributions = 0;
  let totalReturns = 0;
  
  for (let year = 0; year < yearsToFire && year < 100; year++) {
    const yearReturn = runningBalance * realReturn;
    totalReturns += yearReturn;
    totalContributions += annualSavings;
    runningBalance += yearReturn + annualSavings;
  }
  
  // Withdrawal analysis
  const safeAnnualWithdrawal = fireNumber * safeWithdrawalRate;
  const safeMonthlyWithdrawal = safeAnnualWithdrawal / 12;
  const retirementYears = lifeExpectancy - fireAge;
  const portfolioLifespan = retirementYears;
  const successProbability = estimateSuccessProbability(safeWithdrawalRate, retirementYears);
  
  // Coast FIRE analysis
  const traditionalRetirementAge = 65;
  const yearsToTraditional = Math.max(1, traditionalRetirementAge - currentAge);
  const coastTarget = calculateCoastFIRETarget(fireNumber, yearsToTraditional, expectedReturn, inflationRate);
  const coastAchieved = currentSavings >= coastTarget;
  
  let coastAge = currentAge;
  let yearsToCoast = 0;
  if (!coastAchieved) {
    yearsToCoast = calculateYearsToFire(currentSavings, annualSavings, coastTarget, expectedReturn, inflationRate);
    coastAge = currentAge + yearsToCoast;
  }
  
  const coastFire: CoastFIREAnalysis = {
    achieved: coastAchieved,
    coastTarget,
    coastAge,
    yearsToCoast,
    monthlyToCoast: coastTarget / 12,
    targetAtRetirement: fireNumber
  };
  
  // Barista FIRE analysis
  const baristaRequirements = calculateBaristaFIRERequirements(
    annualExpenses,
    currentSavings,
    expectedReturn,
    safeWithdrawalRate
  );
  
  const yearsToBarista = calculateYearsToFire(
    currentSavings,
    annualSavings,
    baristaRequirements.portfolioNeeded,
    expectedReturn,
    inflationRate
  );
  
  const baristaFire: BaristaFIREAnalysis = {
    achievable: yearsToBarista < yearsToFire,
    requiredPartTimeIncome: baristaRequirements.incomeGap,
    portfolioNeeded: baristaRequirements.portfolioNeeded,
    baristaAge: currentAge + yearsToBarista,
    yearsToBarista,
    incomeGap: baristaRequirements.incomeGap
  };
  
  // Generate projections
  const projectionYears = Math.min(Math.max(yearsToFire + 20, 40), 60);
  const projections = generateProjections(inputs, fireNumber, projectionYears);
  
  // Generate milestones
  const milestones = generateMilestones(fireNumber, currentSavings, projections, currentAge);
  
  // Run stress tests
  const stressTests: StressTestScenario[] = [];
  let stressTestScore = 100;
  
  if (includeStressTest) {
    for (const [key, crisis] of Object.entries(HISTORICAL_CRISES)) {
      const testResult = runStressTest(
        fireNumber,
        safeAnnualWithdrawal,
        inflationRate,
        [...crisis.returns], // Convert readonly array to mutable
        30
      );
      
      stressTests.push({
        name: crisis.name,
        startYear: crisis.startYear,
        description: crisis.description,
        survived: testResult.survived,
        yearsLasted: testResult.yearsLasted,
        lowestBalance: testResult.lowestBalance,
        lowestBalanceYear: testResult.lowestBalanceYear,
        recoveryYears: testResult.recoveryYears,
        finalBalance: testResult.finalBalance,
        recommendation: testResult.survived
          ? testResult.lowestBalance < fireNumber * 0.5
            ? 'Consider a larger cash buffer for downturns'
            : 'Your plan survived this scenario well'
          : 'Consider reducing withdrawal rate or building larger cushion'
      });
      
      if (!testResult.survived) {
        stressTestScore -= 15;
      } else if (testResult.lowestBalance < fireNumber * 0.5) {
        stressTestScore -= 5;
      }
    }
    stressTestScore = Math.max(0, stressTestScore);
  }
  
  // Generate sensitivity analysis
  const sensitivityAnalysis = generateSensitivityAnalysis(inputs, yearsToFire);
  
  // Build partial result for recommendations
  const partialResult: Partial<FIREResult> = {
    fireNumber,
    yearsToFire,
    fireAge,
    savingsRate: effectiveSavingsRate,
    coastFire,
    stressTestScore
  };
  
  // Generate recommendations and warnings
  const recommendations = generateRecommendations(inputs, partialResult);
  const warnings = generateWarnings(inputs, partialResult);
  
  // Generate summary
  const summary = alreadyAchieved
    ? `Congratulations! You've already achieved financial independence with ${formatCurrency(currentSavings)}.`
    : yearsToFire === Infinity
    ? 'Based on current numbers, adjust your savings rate or expenses to achieve FIRE.'
    : `You'll reach financial independence in ${yearsToFire} years at age ${fireAge}, with a portfolio of ${formatCurrency(fireNumber)}.`;
  
  const timeUntilFreedom = alreadyAchieved
    ? 'Already achieved!'
    : yearsToFire === Infinity
    ? 'Adjust plan to calculate'
    : yearsToFire === 1
    ? '1 year'
    : `${yearsToFire} years`;
  
  return {
    fireNumber,
    yearsToFire,
    fireAge,
    fireYear,
    alreadyAchieved,
    fireProgress,
    annualSavings,
    monthlySavings: annualSavings / 12,
    savingsRate: effectiveSavingsRate,
    totalContributions,
    totalReturns,
    safeAnnualWithdrawal,
    safeMonthlyWithdrawal,
    portfolioLifespan,
    successProbability,
    coastFire,
    baristaFire,
    leanFireNumber,
    fatFireNumber,
    projections,
    milestones,
    stressTests,
    stressTestScore,
    sensitivityAnalysis,
    recommendations,
    warnings,
    summary,
    timeUntilFreedom
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Quick FIRE number calculation
 */
export function quickFIRENumber(
  annualExpenses: number,
  withdrawalRate: number = 0.04
): number {
  return annualExpenses / withdrawalRate;
}

/**
 * Quick years to FIRE calculation
 */
export function quickYearsToFire(
  currentSavings: number,
  annualSavings: number,
  targetPortfolio: number,
  expectedReturn: number = 0.07
): number {
  return calculateYearsToFire(currentSavings, annualSavings, targetPortfolio, expectedReturn, 0.03);
}

/**
 * Calculate the savings rate needed to reach FIRE in X years
 */
export function savingsRateForYears(
  currentSavings: number,
  annualIncome: number,
  annualExpenses: number,
  targetYears: number,
  expectedReturn: number = 0.07,
  inflationRate: number = 0.03,
  withdrawalRate: number = 0.04
): number {
  const fireNumber = annualExpenses / withdrawalRate;
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  
  // Future value of current savings
  const fvCurrentSavings = currentSavings * Math.pow(1 + realReturn, targetYears);
  
  // Amount needed from contributions
  const neededFromContributions = fireNumber - fvCurrentSavings;
  
  if (neededFromContributions <= 0) return 0; // Already on track
  
  // Solve for annual contribution using future value of annuity formula
  // FV = PMT * ((1+r)^n - 1) / r
  // PMT = FV * r / ((1+r)^n - 1)
  const annualContribution = neededFromContributions * realReturn / (Math.pow(1 + realReturn, targetYears) - 1);
  
  const savingsRate = annualContribution / annualIncome;
  return Math.min(1, Math.max(0, savingsRate));
}

/**
 * Compare different FIRE scenarios
 */
export function compareFIREScenarios(
  baseInputs: FIREInputs,
  scenarios: Array<{ name: string; changes: Partial<FIREInputs> }>
): Array<{ name: string; result: FIREResult }> {
  return scenarios.map(scenario => ({
    name: scenario.name,
    result: calculateFIRE({ ...baseInputs, ...scenario.changes })
  }));
}
