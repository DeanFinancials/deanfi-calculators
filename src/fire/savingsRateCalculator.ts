/**
 * Savings Rate Calculator
 * 
 * Calculates savings rate using multiple methods (pre-tax, post-tax) and
 * determines years to financial independence based on the famous
 * Mr. Money Mustache "Shockingly Simple Math" formula.
 * 
 * The calculator shows how savings rate is the most important factor in
 * determining time to retirement - more important than income level.
 * 
 * @see https://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/
 * @see https://www.npmjs.com/package/@deanfinancials/calculators
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Method for calculating savings rate
 * - gross: Savings / Gross Income (simplest)
 * - net: Savings / Net Income (after tax)
 * - post-tax-adjusted: (Total Savings + Tax-advantaged) / (Net + Tax-advantaged)
 *   This is the FIRE community preferred method for accurate comparison
 */
export type SavingsRateMethod = 'gross' | 'net' | 'post-tax-adjusted';

/**
 * Input parameters for savings rate calculation
 */
export interface SavingsRateInputs {
  /** Gross annual income (before taxes) */
  grossIncome: number;
  
  /** Net annual income (after taxes, what you "take home") */
  netIncome: number;
  
  /** Annual expenses (what you spend to live) */
  annualExpenses: number;
  
  /** 401(k) contributions (pre-tax) */
  contribution401k?: number;
  
  /** Employer 401(k) match (if any) */
  employerMatch?: number;
  
  /** Traditional IRA contributions */
  traditionalIRA?: number;
  
  /** Roth IRA contributions */
  rothIRA?: number;
  
  /** Roth 401(k) contributions */
  roth401k?: number;
  
  /** HSA contributions */
  hsaContributions?: number;
  
  /** Taxable brokerage savings */
  taxableSavings?: number;
  
  /** Other savings (emergency fund, etc.) */
  otherSavings?: number;
  
  /** Current total invested assets */
  currentNetWorth?: number;
  
  /** Expected annual investment return (default: 5% real return) */
  expectedReturn?: number;
  
  /** Safe withdrawal rate (default: 4%) */
  withdrawalRate?: number;
  
  /** Annual expense growth rate (default: 2% for lifestyle inflation) */
  expenseGrowthRate?: number;
  
  /** Annual income growth rate (default: 2%) */
  incomeGrowthRate?: number;
  
  /** Current age */
  currentAge?: number;
}

/**
 * Breakdown of savings by category
 */
export interface SavingsBreakdown {
  /** Pre-tax retirement contributions (401k, Traditional IRA) */
  preTaxRetirement: number;
  /** Post-tax retirement contributions (Roth) */
  postTaxRetirement: number;
  /** Tax-advantaged non-retirement (HSA) */
  taxAdvantaged: number;
  /** Taxable savings */
  taxableSavings: number;
  /** Employer contributions */
  employerContributions: number;
  /** Total savings */
  totalSavings: number;
}

/**
 * Savings rate calculated using different methods
 */
export interface SavingsRateByMethod {
  /** Method used */
  method: SavingsRateMethod;
  /** Savings rate as decimal (0.50 = 50%) */
  rate: number;
  /** Savings rate as percentage */
  percentage: number;
  /** Description of the method */
  description: string;
  /** Formula used */
  formula: string;
}

/**
 * FIRE community benchmark comparison
 */
export interface FIREBenchmark {
  /** Benchmark name */
  name: string;
  /** Savings rate */
  rate: number;
  /** Years to FI at this rate */
  yearsToFI: number;
  /** Description */
  description: string;
  /** Whether user meets this benchmark */
  achieved: boolean;
  /** Color for UI */
  color: string;
}

/**
 * Data point for years to retirement chart
 */
export interface YearsToRetirementChartPoint {
  /** Savings rate as percentage */
  savingsRate: number;
  /** Years to retirement */
  years: number;
  /** Whether this is the user's current point */
  isCurrent: boolean;
}

/**
 * Yearly projection for savings growth
 */
export interface SavingsProjection {
  /** Year number (1, 2, 3...) */
  year: number;
  /** Age at this year */
  age: number | null;
  /** Savings rate this year */
  savingsRate: number;
  /** Annual savings this year */
  annualSavings: number;
  /** Cumulative savings to date */
  cumulativeSavings: number;
  /** Portfolio value at end of year */
  portfolioValue: number;
  /** Investment returns earned */
  investmentReturns: number;
  /** Annual expenses this year */
  annualExpenses: number;
  /** FIRE number at this year's expenses */
  fireNumber: number;
  /** Whether FI is achieved */
  fiAchieved: boolean;
  /** Percentage progress to FI */
  fiProgress: number;
}

/**
 * Scenario comparison for "What If" analysis
 */
export interface SavingsScenario {
  /** Scenario name */
  name: string;
  /** Savings rate */
  savingsRate: number;
  /** Monthly savings amount */
  monthlySavings: number;
  /** Years to FI */
  yearsToFI: number;
  /** FI age (if current age provided) */
  fiAge: number | null;
  /** Total savings at FI */
  portfolioAtFI: number;
  /** Color for UI */
  color: string;
}

/**
 * Main result from savings rate calculation
 */
export interface SavingsRateResult {
  // Core Savings Rates
  /** Primary savings rate (using post-tax-adjusted method) */
  savingsRate: number;
  /** Savings rate as percentage */
  savingsRatePercent: number;
  /** Savings rates by all methods */
  ratesByMethod: SavingsRateByMethod[];
  /** Recommended method for FIRE calculation */
  recommendedMethod: SavingsRateMethod;
  
  // Savings Breakdown
  /** Breakdown of savings by category */
  savingsBreakdown: SavingsBreakdown;
  /** Monthly savings amount */
  monthlySavings: number;
  /** Annual savings amount */
  annualSavings: number;
  
  // Years to Financial Independence
  /** Years to reach FI based on savings rate */
  yearsToFI: number;
  /** FI age (if current age provided) */
  fiAge: number | null;
  /** Calendar year of FI */
  fiYear: number;
  /** FIRE number needed */
  fireNumber: number;
  /** Already FI? */
  alreadyFI: boolean;
  
  // Benchmarks & Comparisons
  /** FIRE community benchmarks */
  benchmarks: FIREBenchmark[];
  /** Current benchmark tier */
  currentTier: string;
  /** Next tier to achieve */
  nextTier: FIREBenchmark | null;
  /** Savings needed to reach next tier */
  savingsToNextTier: number;
  
  // Charts & Projections
  /** Data for years to retirement chart */
  yearsToRetirementChart: YearsToRetirementChartPoint[];
  /** Year-by-year projections */
  projections: SavingsProjection[];
  /** Scenario comparisons */
  scenarios: SavingsScenario[];
  
  // Insights
  /** Key insights and recommendations */
  insights: string[];
  /** Warnings or concerns */
  warnings: string[];
  
  // Summary
  /** Human-readable summary */
  summary: string;
  /** Time to FI formatted */
  timeToFI: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * FIRE community savings rate benchmarks
 */
export const FIRE_BENCHMARKS: Omit<FIREBenchmark, 'achieved'>[] = [
  {
    name: 'Beginner',
    rate: 0.10,
    yearsToFI: 51,
    description: 'Getting started - better than most Americans!',
    color: '#94a3b8' // slate
  },
  {
    name: 'Saver',
    rate: 0.20,
    yearsToFI: 37,
    description: 'Solid foundation for building wealth',
    color: '#60a5fa' // blue
  },
  {
    name: 'Serious Saver',
    rate: 0.30,
    yearsToFI: 28,
    description: 'Ahead of schedule for traditional retirement',
    color: '#34d399' // emerald
  },
  {
    name: 'FIRE Seeker',
    rate: 0.40,
    yearsToFI: 22,
    description: 'On the path to early retirement',
    color: '#a78bfa' // violet
  },
  {
    name: 'FIRE Achiever',
    rate: 0.50,
    yearsToFI: 17,
    description: 'The classic FIRE target - retire in ~17 years!',
    color: '#f97316' // orange
  },
  {
    name: 'Aggressive FIRE',
    rate: 0.60,
    yearsToFI: 12.5,
    description: 'Accelerated path to financial freedom',
    color: '#f43f5e' // rose
  },
  {
    name: 'Extreme FIRE',
    rate: 0.70,
    yearsToFI: 8.5,
    description: 'Living lean, retiring soon!',
    color: '#ec4899' // pink
  },
  {
    name: 'Ultra FIRE',
    rate: 0.75,
    yearsToFI: 7,
    description: 'Elite savings rate - FI in under a decade',
    color: '#8b5cf6' // purple
  },
  {
    name: 'Legendary',
    rate: 0.80,
    yearsToFI: 5.5,
    description: 'Remarkable discipline - FI in ~5 years',
    color: '#eab308' // yellow/gold
  }
];

/**
 * Default assumptions for calculations
 */
export const DEFAULT_ASSUMPTIONS = {
  /** Real investment return (after inflation) - conservative */
  expectedReturn: 0.05,
  /** Safe withdrawal rate (4% rule) */
  withdrawalRate: 0.04,
  /** Expected expense growth (lifestyle inflation) */
  expenseGrowthRate: 0.02,
  /** Expected income growth */
  incomeGrowthRate: 0.02,
  /** Projection years */
  projectionYears: 50
};

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate savings rate using the gross income method
 * Formula: Total Savings / Gross Income
 */
export function calculateGrossSavingsRate(
  totalSavings: number,
  grossIncome: number
): number {
  if (grossIncome <= 0) return 0;
  return Math.min(1, Math.max(0, totalSavings / grossIncome));
}

/**
 * Calculate savings rate using the net income method
 * Formula: Total Savings / Net Income (after tax)
 */
export function calculateNetSavingsRate(
  totalSavings: number,
  netIncome: number
): number {
  if (netIncome <= 0) return 0;
  return Math.min(1, Math.max(0, totalSavings / netIncome));
}

/**
 * Calculate savings rate using the FIRE community preferred method
 * This method accounts for pre-tax contributions correctly
 * 
 * Formula: Total Savings / (Net Income + Pre-Tax Contributions)
 * 
 * This is important because pre-tax contributions reduce your take-home pay
 * but are still savings. This method treats them fairly.
 */
export function calculatePostTaxAdjustedSavingsRate(
  totalSavings: number,
  netIncome: number,
  preTaxContributions: number
): number {
  const adjustedIncome = netIncome + preTaxContributions;
  if (adjustedIncome <= 0) return 0;
  return Math.min(1, Math.max(0, totalSavings / adjustedIncome));
}

/**
 * Calculate years to financial independence using the MMM formula
 * 
 * This uses the future value of annuity formula to determine when
 * your portfolio will reach 25x your annual expenses (4% withdrawal rate)
 * 
 * The formula accounts for:
 * - Current savings/net worth
 * - Annual contributions
 * - Investment returns
 * - Safe withdrawal rate
 * 
 * @param savingsRate - Savings rate as decimal (0.50 = 50%)
 * @param currentNetWorth - Current invested assets (default: 0)
 * @param expectedReturn - Real return after inflation (default: 5%)
 * @param withdrawalRate - Safe withdrawal rate (default: 4%)
 */
export function calculateYearsToFI(
  savingsRate: number,
  currentNetWorth: number = 0,
  expectedReturn: number = DEFAULT_ASSUMPTIONS.expectedReturn,
  withdrawalRate: number = DEFAULT_ASSUMPTIONS.withdrawalRate
): number {
  // If already at 100% savings rate, FI is immediate (theoretically)
  if (savingsRate >= 1) return 0;
  
  // If not saving anything, FI is impossible
  if (savingsRate <= 0) return Infinity;
  
  // Spending rate is 1 - savings rate
  const spendingRate = 1 - savingsRate;
  
  // FIRE number is 25x annual expenses (at 4% SWR)
  // Since we're working with rates, FIRE number = spending_rate / withdrawal_rate
  const fireNumberRatio = spendingRate / withdrawalRate;
  
  // Current wealth ratio (current net worth / annual income equivalent)
  // We normalize by assuming income = 1, so savings = savingsRate, expenses = spendingRate
  const currentWealthRatio = currentNetWorth > 0 ? 
    currentNetWorth / (currentNetWorth / (1 - spendingRate / savingsRate)) * savingsRate : 0;
  
  // If already FI
  if (currentWealthRatio >= fireNumberRatio) return 0;
  
  // Use iterative approach for accuracy
  let balance = currentWealthRatio;
  let years = 0;
  const maxYears = 100;
  
  while (balance < fireNumberRatio && years < maxYears) {
    balance = balance * (1 + expectedReturn) + savingsRate;
    years++;
  }
  
  return years >= maxYears ? Infinity : years;
}

/**
 * Simplified years to FI calculation using the logarithmic formula
 * This assumes starting from zero and provides a quick approximation
 * 
 * Formula: ln(1 + return * (1/spending_rate - 1)) / ln(1 + return)
 */
export function quickYearsToFI(
  savingsRate: number,
  expectedReturn: number = DEFAULT_ASSUMPTIONS.expectedReturn,
  withdrawalRate: number = DEFAULT_ASSUMPTIONS.withdrawalRate
): number {
  if (savingsRate >= 1) return 0;
  if (savingsRate <= 0) return Infinity;
  
  const spendingRate = 1 - savingsRate;
  const fireMultiple = 1 / withdrawalRate; // 25 for 4% SWR
  
  // Adjusted formula that accounts for spending ratio
  const targetRatio = spendingRate * fireMultiple; // What we need relative to savings
  
  if (expectedReturn <= 0) {
    // No growth, simple division
    return targetRatio / savingsRate;
  }
  
  // Future value of annuity formula solved for n
  // FV = PMT * ((1+r)^n - 1) / r
  // Solving for n: n = ln(FV * r / PMT + 1) / ln(1 + r)
  const r = expectedReturn;
  const PMT = savingsRate;
  const FV = targetRatio;
  
  const years = Math.log((FV * r / PMT) + 1) / Math.log(1 + r);
  
  return Math.max(0, years);
}

/**
 * Generate years to retirement chart data
 * This creates the famous MMM chart showing savings rate vs years
 */
export function generateYearsToRetirementChart(
  currentSavingsRate: number,
  expectedReturn: number = DEFAULT_ASSUMPTIONS.expectedReturn,
  withdrawalRate: number = DEFAULT_ASSUMPTIONS.withdrawalRate
): YearsToRetirementChartPoint[] {
  const chartData: YearsToRetirementChartPoint[] = [];
  
  // Generate data points from 5% to 95% savings rate
  for (let rate = 5; rate <= 95; rate += 5) {
    const years = quickYearsToFI(rate / 100, expectedReturn, withdrawalRate);
    chartData.push({
      savingsRate: rate,
      years: years === Infinity ? 100 : Math.round(years * 10) / 10,
      isCurrent: Math.abs(rate - currentSavingsRate * 100) < 2.5
    });
  }
  
  // Add the user's exact point if not on a 5% increment
  const userRate = Math.round(currentSavingsRate * 100);
  if (userRate % 5 !== 0 && userRate >= 5 && userRate <= 95) {
    const userYears = quickYearsToFI(currentSavingsRate, expectedReturn, withdrawalRate);
    chartData.push({
      savingsRate: userRate,
      years: userYears === Infinity ? 100 : Math.round(userYears * 10) / 10,
      isCurrent: true
    });
    // Sort by savings rate
    chartData.sort((a, b) => a.savingsRate - b.savingsRate);
  }
  
  return chartData;
}

/**
 * Calculate savings breakdown from inputs
 */
export function calculateSavingsBreakdown(inputs: SavingsRateInputs): SavingsBreakdown {
  const preTaxRetirement = (inputs.contribution401k ?? 0) + (inputs.traditionalIRA ?? 0);
  const postTaxRetirement = (inputs.rothIRA ?? 0) + (inputs.roth401k ?? 0);
  const taxAdvantaged = inputs.hsaContributions ?? 0;
  const taxableSavings = (inputs.taxableSavings ?? 0) + (inputs.otherSavings ?? 0);
  const employerContributions = inputs.employerMatch ?? 0;
  
  const totalSavings = preTaxRetirement + postTaxRetirement + taxAdvantaged + 
                       taxableSavings + employerContributions;
  
  return {
    preTaxRetirement,
    postTaxRetirement,
    taxAdvantaged,
    taxableSavings,
    employerContributions,
    totalSavings
  };
}

/**
 * Generate savings rate using all methods
 */
export function calculateAllSavingsRates(
  inputs: SavingsRateInputs,
  savingsBreakdown: SavingsBreakdown
): SavingsRateByMethod[] {
  const { grossIncome, netIncome } = inputs;
  const { totalSavings, preTaxRetirement } = savingsBreakdown;
  
  const grossRate = calculateGrossSavingsRate(totalSavings, grossIncome);
  const netRate = calculateNetSavingsRate(totalSavings, netIncome);
  const adjustedRate = calculatePostTaxAdjustedSavingsRate(totalSavings, netIncome, preTaxRetirement);
  
  return [
    {
      method: 'gross',
      rate: grossRate,
      percentage: grossRate * 100,
      description: 'Savings as percentage of gross (pre-tax) income',
      formula: 'Total Savings ÷ Gross Income'
    },
    {
      method: 'net',
      rate: netRate,
      percentage: netRate * 100,
      description: 'Savings as percentage of net (after-tax) income',
      formula: 'Total Savings ÷ Net Income'
    },
    {
      method: 'post-tax-adjusted',
      rate: adjustedRate,
      percentage: adjustedRate * 100,
      description: 'FIRE community standard - accounts for pre-tax contributions correctly',
      formula: 'Total Savings ÷ (Net Income + Pre-Tax Contributions)'
    }
  ];
}

/**
 * Get FIRE benchmarks with achievement status
 */
export function getBenchmarksWithStatus(savingsRate: number): FIREBenchmark[] {
  return FIRE_BENCHMARKS.map(benchmark => ({
    ...benchmark,
    achieved: savingsRate >= benchmark.rate
  }));
}

/**
 * Get current tier and next tier
 */
export function getCurrentAndNextTier(
  savingsRate: number,
  benchmarks: FIREBenchmark[]
): { currentTier: string; nextTier: FIREBenchmark | null } {
  const achievedBenchmarks = benchmarks.filter(b => b.achieved);
  const nextBenchmarks = benchmarks.filter(b => !b.achieved);
  
  const currentTier = achievedBenchmarks.length > 0 
    ? achievedBenchmarks[achievedBenchmarks.length - 1]?.name ?? 'Getting Started'
    : 'Getting Started';
  
  const nextTier = nextBenchmarks.length > 0 ? nextBenchmarks[0] ?? null : null;
  
  return { currentTier, nextTier };
}

/**
 * Generate year-by-year projections
 */
export function generateSavingsProjections(
  inputs: SavingsRateInputs,
  savingsRate: number,
  annualSavings: number,
  yearsToProject: number = DEFAULT_ASSUMPTIONS.projectionYears
): SavingsProjection[] {
  const projections: SavingsProjection[] = [];
  
  const {
    annualExpenses,
    currentNetWorth = 0,
    expectedReturn = DEFAULT_ASSUMPTIONS.expectedReturn,
    withdrawalRate = DEFAULT_ASSUMPTIONS.withdrawalRate,
    expenseGrowthRate = DEFAULT_ASSUMPTIONS.expenseGrowthRate,
    incomeGrowthRate = DEFAULT_ASSUMPTIONS.incomeGrowthRate,
    currentAge
  } = inputs;
  
  let portfolioValue = currentNetWorth;
  let cumulativeSavings = 0;
  let currentExpenses = annualExpenses;
  let currentAnnualSavings = annualSavings;
  let fiAchieved = false;
  
  for (let year = 1; year <= yearsToProject; year++) {
    // Calculate this year's FIRE number
    const fireNumber = currentExpenses / withdrawalRate;
    
    // Check if FI achieved
    if (!fiAchieved && portfolioValue >= fireNumber) {
      fiAchieved = true;
    }
    
    // Investment returns
    const returns = portfolioValue * expectedReturn;
    
    // Update portfolio
    portfolioValue = portfolioValue + returns + currentAnnualSavings;
    cumulativeSavings += currentAnnualSavings;
    
    // Calculate progress
    const fiProgress = Math.min(100, (portfolioValue / fireNumber) * 100);
    
    projections.push({
      year,
      age: currentAge ? currentAge + year : null,
      savingsRate,
      annualSavings: currentAnnualSavings,
      cumulativeSavings,
      portfolioValue,
      investmentReturns: returns,
      annualExpenses: currentExpenses,
      fireNumber,
      fiAchieved,
      fiProgress
    });
    
    // Grow expenses and savings for next year
    currentExpenses *= (1 + expenseGrowthRate);
    currentAnnualSavings *= (1 + incomeGrowthRate);
  }
  
  return projections;
}

/**
 * Generate comparison scenarios
 */
export function generateScenarios(
  inputs: SavingsRateInputs,
  currentSavingsRate: number,
  annualSavings: number
): SavingsScenario[] {
  const {
    netIncome,
    annualExpenses,
    currentNetWorth = 0,
    expectedReturn = DEFAULT_ASSUMPTIONS.expectedReturn,
    withdrawalRate = DEFAULT_ASSUMPTIONS.withdrawalRate,
    currentAge
  } = inputs;
  
  // Calculate based on current income level
  const scenarios: SavingsScenario[] = [];
  const rateScenarios = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
  const colors = ['#60a5fa', '#34d399', '#a78bfa', '#f97316', '#f43f5e', '#ec4899'];
  
  // Add current scenario
  const currentYears = calculateYearsToFI(currentSavingsRate, currentNetWorth, expectedReturn, withdrawalRate);
  const fireNumber = annualExpenses / withdrawalRate;
  
  // Calculate portfolio at FI for current rate
  let currentPortfolioAtFI = currentNetWorth;
  for (let y = 0; y < currentYears && y < 100; y++) {
    currentPortfolioAtFI = currentPortfolioAtFI * (1 + expectedReturn) + annualSavings;
  }
  
  scenarios.push({
    name: 'Current',
    savingsRate: currentSavingsRate,
    monthlySavings: annualSavings / 12,
    yearsToFI: currentYears,
    fiAge: currentAge ? currentAge + currentYears : null,
    portfolioAtFI: currentPortfolioAtFI,
    color: '#10b981' // emerald for current
  });
  
  // Add comparison scenarios
  rateScenarios.forEach((rate, index) => {
    if (Math.abs(rate - currentSavingsRate) < 0.05) return; // Skip if too close to current
    
    const scenarioSavings = netIncome * rate;
    const scenarioExpenses = netIncome * (1 - rate);
    const scenarioYears = calculateYearsToFI(rate, currentNetWorth, expectedReturn, withdrawalRate);
    const scenarioFireNumber = scenarioExpenses / withdrawalRate;
    
    // Calculate portfolio at FI
    let portfolioAtFI = currentNetWorth;
    for (let y = 0; y < scenarioYears && y < 100; y++) {
      portfolioAtFI = portfolioAtFI * (1 + expectedReturn) + scenarioSavings;
    }
    
    scenarios.push({
      name: `${Math.round(rate * 100)}% Rate`,
      savingsRate: rate,
      monthlySavings: scenarioSavings / 12,
      yearsToFI: scenarioYears,
      fiAge: currentAge ? currentAge + scenarioYears : null,
      portfolioAtFI,
      color: colors[index] ?? '#94a3b8'
    });
  });
  
  // Sort by years to FI
  scenarios.sort((a, b) => b.yearsToFI - a.yearsToFI);
  
  return scenarios;
}

/**
 * Generate insights based on savings rate
 */
export function generateInsights(
  savingsRate: number,
  inputs: SavingsRateInputs,
  yearsToFI: number,
  savingsBreakdown: SavingsBreakdown
): string[] {
  const insights: string[] = [];
  const { grossIncome, annualExpenses, currentNetWorth = 0 } = inputs;
  const { employerContributions, preTaxRetirement } = savingsBreakdown;
  
  // Savings rate insights
  if (savingsRate >= 0.70) {
    insights.push(
      `🔥 Incredible! At ${(savingsRate * 100).toFixed(0)}% savings rate, you're on track for FI in under a decade.`
    );
  } else if (savingsRate >= 0.50) {
    insights.push(
      `🎯 Great job! A ${(savingsRate * 100).toFixed(0)}% savings rate puts you in the classic FIRE sweet spot.`
    );
  } else if (savingsRate >= 0.30) {
    insights.push(
      `📈 You're saving ${(savingsRate * 100).toFixed(0)}% - well above average and building wealth steadily.`
    );
  } else if (savingsRate >= 0.15) {
    insights.push(
      `💪 Your ${(savingsRate * 100).toFixed(0)}% savings rate is a solid start. Small increases make big differences!`
    );
  } else {
    insights.push(
      `🚀 Starting your savings journey! Even small increases in savings rate dramatically reduce years to FI.`
    );
  }
  
  // Impact insights
  if (savingsRate < 0.50) {
    const fivePercentMore = savingsRate + 0.05;
    const currentYears = quickYearsToFI(savingsRate);
    const newYears = quickYearsToFI(fivePercentMore);
    const yearsSaved = currentYears - newYears;
    if (yearsSaved > 0 && yearsSaved < 100) {
      insights.push(
        `💡 Increasing your savings rate by just 5% would reduce your time to FI by ${yearsSaved.toFixed(1)} years!`
      );
    }
  }
  
  // Employer match insight
  if (employerContributions > 0) {
    insights.push(
      `🎁 Your employer match adds ${formatCurrency(employerContributions)} per year - that's free money boosting your savings!`
    );
  }
  
  // Tax efficiency insight
  if (preTaxRetirement > 0) {
    const taxSavings = preTaxRetirement * 0.24; // Assume 24% bracket
    insights.push(
      `💰 Your pre-tax contributions may be saving you ~${formatCurrency(taxSavings)} in taxes annually.`
    );
  }
  
  // Net worth impact
  if (currentNetWorth > 0) {
    const headStart = yearsToFI - quickYearsToFI(savingsRate);
    if (headStart > 0.5) {
      insights.push(
        `⏰ Your existing ${formatCurrency(currentNetWorth)} gives you a ${Math.abs(headStart).toFixed(1)}-year head start on your FI journey.`
      );
    }
  }
  
  // Expense ratio insight
  const expenseRatio = annualExpenses / grossIncome;
  if (expenseRatio < 0.40) {
    insights.push(
      `🏆 Living on ${(expenseRatio * 100).toFixed(0)}% of gross income shows impressive expense management.`
    );
  }
  
  return insights;
}

/**
 * Generate warnings
 */
export function generateWarnings(
  savingsRate: number,
  inputs: SavingsRateInputs,
  yearsToFI: number
): string[] {
  const warnings: string[] = [];
  const { grossIncome, netIncome, annualExpenses, currentAge } = inputs;
  
  // Low savings rate warning
  if (savingsRate < 0.10) {
    warnings.push(
      'At less than 10% savings rate, reaching FI may take 50+ years. Consider identifying expenses to reduce.'
    );
  }
  
  // Negative savings warning
  if (savingsRate < 0) {
    warnings.push(
      '⚠️ You\'re spending more than you earn. Focus on reducing expenses or increasing income first.'
    );
  }
  
  // Unrealistic timeline warning
  if (currentAge && yearsToFI < Infinity) {
    const fiAge = currentAge + yearsToFI;
    if (fiAge > 75) {
      warnings.push(
        `Your projected FI age of ${Math.round(fiAge)} is quite high. Consider ways to increase your savings rate.`
      );
    }
  }
  
  // Income-expense gap warning
  if (netIncome > 0 && annualExpenses > netIncome * 0.9) {
    warnings.push(
      'Your expenses consume over 90% of take-home pay, leaving little room for savings.'
    );
  }
  
  // Tax efficiency warning
  const savingsBreakdown = calculateSavingsBreakdown(inputs);
  if (savingsBreakdown.totalSavings > 0 && savingsBreakdown.preTaxRetirement === 0) {
    warnings.push(
      'Consider maxing out pre-tax retirement accounts (401k, Traditional IRA) for tax efficiency.'
    );
  }
  
  return warnings;
}

// ============================================================================
// Main Calculator Function
// ============================================================================

/**
 * Calculate comprehensive savings rate analysis
 */
export function calculateSavingsRate(inputs: SavingsRateInputs): SavingsRateResult {
  const {
    grossIncome,
    netIncome,
    annualExpenses,
    currentNetWorth = 0,
    expectedReturn = DEFAULT_ASSUMPTIONS.expectedReturn,
    withdrawalRate = DEFAULT_ASSUMPTIONS.withdrawalRate,
    currentAge
  } = inputs;
  
  // Calculate savings breakdown
  const savingsBreakdown = calculateSavingsBreakdown(inputs);
  
  // If no explicit savings provided, calculate from income - expenses
  let totalSavings = savingsBreakdown.totalSavings;
  if (totalSavings === 0 && netIncome > annualExpenses) {
    totalSavings = netIncome - annualExpenses;
    savingsBreakdown.taxableSavings = totalSavings;
    savingsBreakdown.totalSavings = totalSavings;
  }
  
  // Calculate all savings rates
  const ratesByMethod = calculateAllSavingsRates(inputs, savingsBreakdown);
  
  // Use post-tax-adjusted as primary (FIRE community standard)
  const adjustedMethod = ratesByMethod.find(r => r.method === 'post-tax-adjusted');
  const savingsRate = adjustedMethod?.rate ?? 
    calculateNetSavingsRate(totalSavings, netIncome);
  
  // Calculate years to FI
  const yearsToFI = calculateYearsToFI(
    savingsRate,
    currentNetWorth,
    expectedReturn,
    withdrawalRate
  );
  
  // Calculate FIRE number
  const fireNumber = annualExpenses / withdrawalRate;
  
  // Already FI?
  const alreadyFI = currentNetWorth >= fireNumber;
  
  // Get benchmarks
  const benchmarks = getBenchmarksWithStatus(savingsRate);
  const { currentTier, nextTier } = getCurrentAndNextTier(savingsRate, benchmarks);
  
  // Calculate savings needed for next tier
  let savingsToNextTier = 0;
  if (nextTier) {
    const incomeForCalculation = netIncome + savingsBreakdown.preTaxRetirement;
    const currentSavingsNeeded = savingsRate * incomeForCalculation;
    const nextTierSavingsNeeded = nextTier.rate * incomeForCalculation;
    savingsToNextTier = nextTierSavingsNeeded - currentSavingsNeeded;
  }
  
  // Generate chart data
  const yearsToRetirementChart = generateYearsToRetirementChart(
    savingsRate,
    expectedReturn,
    withdrawalRate
  );
  
  // Generate projections
  const projections = generateSavingsProjections(
    inputs,
    savingsRate,
    totalSavings,
    Math.min(Math.max(yearsToFI + 10, 30), DEFAULT_ASSUMPTIONS.projectionYears)
  );
  
  // Generate scenarios
  const scenarios = generateScenarios(inputs, savingsRate, totalSavings);
  
  // Generate insights and warnings
  const insights = generateInsights(savingsRate, inputs, yearsToFI, savingsBreakdown);
  const warnings = generateWarnings(savingsRate, inputs, yearsToFI);
  
  // Calculate FI date
  const currentYear = new Date().getFullYear();
  const fiYear = yearsToFI === Infinity ? 9999 : currentYear + Math.ceil(yearsToFI);
  const fiAge = currentAge && yearsToFI < Infinity 
    ? currentAge + Math.ceil(yearsToFI) 
    : null;
  
  // Generate summary
  const summary = alreadyFI
    ? `Congratulations! You've already reached financial independence!`
    : yearsToFI === Infinity
    ? 'Increase your savings rate to calculate your path to FI.'
    : `At your ${(savingsRate * 100).toFixed(1)}% savings rate, you'll reach FI in ${yearsToFI.toFixed(1)} years${fiAge ? ` (age ${fiAge})` : ''}.`;
  
  const timeToFI = alreadyFI
    ? 'Already FI!'
    : yearsToFI === Infinity
    ? 'Increase savings to calculate'
    : yearsToFI < 1
    ? 'Less than 1 year'
    : `${yearsToFI.toFixed(1)} years`;
  
  return {
    savingsRate,
    savingsRatePercent: savingsRate * 100,
    ratesByMethod,
    recommendedMethod: 'post-tax-adjusted',
    savingsBreakdown,
    monthlySavings: totalSavings / 12,
    annualSavings: totalSavings,
    yearsToFI,
    fiAge,
    fiYear,
    fireNumber,
    alreadyFI,
    benchmarks,
    currentTier,
    nextTier,
    savingsToNextTier,
    yearsToRetirementChart,
    projections,
    scenarios,
    insights,
    warnings,
    summary,
    timeToFI
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Quick savings rate from income and expenses
 */
export function quickSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  const savings = income - expenses;
  return Math.min(1, Math.max(0, savings / income));
}

/**
 * Calculate monthly savings needed for target savings rate
 */
export function monthlySavingsForRate(
  targetRate: number,
  monthlyIncome: number
): number {
  return monthlyIncome * targetRate;
}

/**
 * Calculate savings rate needed to reach FI in X years
 */
export function savingsRateForYearsToFI(
  targetYears: number,
  expectedReturn: number = DEFAULT_ASSUMPTIONS.expectedReturn,
  withdrawalRate: number = DEFAULT_ASSUMPTIONS.withdrawalRate
): number {
  if (targetYears <= 0) return 1;
  if (targetYears >= 100) return 0.05;
  
  // Binary search for the savings rate
  let low = 0.01;
  let high = 0.99;
  const tolerance = 0.001;
  
  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const years = quickYearsToFI(mid, expectedReturn, withdrawalRate);
    
    if (years > targetYears) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
}

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
 * Compare multiple savings scenarios side by side
 */
export function compareSavingsScenarios(
  baseInputs: SavingsRateInputs,
  changes: Array<{ name: string; changes: Partial<SavingsRateInputs> }>
): Array<{ name: string; result: SavingsRateResult }> {
  return changes.map(scenario => ({
    name: scenario.name,
    result: calculateSavingsRate({ ...baseInputs, ...scenario.changes })
  }));
}

/**
 * Get the savings rate table (MMM-style)
 * Shows savings rate vs years to FI
 */
export function getSavingsRateTable(
  expectedReturn: number = DEFAULT_ASSUMPTIONS.expectedReturn,
  withdrawalRate: number = DEFAULT_ASSUMPTIONS.withdrawalRate
): Array<{ savingsRate: number; yearsToFI: number }> {
  const rates = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  
  return rates.map(rate => ({
    savingsRate: rate,
    yearsToFI: Math.round(quickYearsToFI(rate / 100, expectedReturn, withdrawalRate) * 10) / 10
  }));
}
