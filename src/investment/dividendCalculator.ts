/**
 * Dividend Income Calculator
 * 
 * Comprehensive dividend calculator for passive income planning including:
 * - Dividend yield calculation
 * - Dividend reinvestment (DRIP) projections
 * - Passive income from dividends
 * - Tax-adjusted dividend income (qualified vs ordinary rates)
 * - Dividend growth projections
 * - Dividend income stability assessment (unique feature)
 * 
 * Documentation:
 * - Qualified dividend tax rates: https://www.irs.gov/publications/p550
 * - Dividend yield = Annual Dividend / Share Price
 * - DRIP compounds by purchasing additional shares with dividends
 */

/**
 * Tax filing status for dividend tax calculations
 */
export type DividendTaxFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

/**
 * Dividend payment frequency
 */
export type DividendFrequency = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

/**
 * Dividend stability rating based on coverage and consistency
 */
export type DividendStabilityRating = 'excellent' | 'good' | 'moderate' | 'risky' | 'very-risky';

/**
 * Input parameters for dividend income calculation
 */
export interface DividendIncomeInputs {
  /** Initial investment amount in dollars */
  initialInvestment: number;
  /** Current share price in dollars */
  sharePrice: number;
  /** Annual dividend per share in dollars */
  annualDividendPerShare: number;
  /** Expected annual dividend growth rate as percentage (e.g., 5 for 5%) */
  dividendGrowthRate?: number;
  /** Expected annual share price appreciation as percentage (e.g., 7 for 7%) */
  priceAppreciationRate?: number;
  /** Number of years for projection */
  years: number;
  /** Whether to reinvest dividends (DRIP) */
  reinvestDividends?: boolean;
  /** Monthly additional investment in dollars */
  monthlyContribution?: number;
  /** Dividend payment frequency */
  dividendFrequency?: DividendFrequency;
  /** Tax filing status for tax-adjusted calculations */
  taxFilingStatus?: DividendTaxFilingStatus;
  /** Percentage of dividends that are qualified (0-100) */
  qualifiedDividendPercentage?: number;
  /** State income tax rate as percentage (0-13) */
  stateTaxRate?: number;
}

/**
 * Dividend yield calculation result
 */
export interface DividendYieldResult {
  /** Dividend yield as percentage */
  dividendYield: number;
  /** Annual dividend income for the investment */
  annualDividendIncome: number;
  /** Monthly dividend income */
  monthlyDividendIncome: number;
  /** Number of shares owned */
  sharesOwned: number;
  /** Current share price */
  sharePrice: number;
  /** Annual dividend per share */
  annualDividendPerShare: number;
}

/**
 * Year-by-year dividend projection
 */
export interface YearlyDividendProjection {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Number of shares owned at end of year */
  sharesOwned: number;
  /** Share price at end of year */
  sharePrice: number;
  /** Annual dividend per share */
  dividendPerShare: number;
  /** Total portfolio value */
  portfolioValue: number;
  /** Total dividends received during year */
  dividendsReceived: number;
  /** Cumulative dividends received */
  cumulativeDividends: number;
  /** Dividend yield at current price */
  dividendYield: number;
  /** Shares purchased via DRIP (if applicable) */
  sharesFromDRIP: number;
  /** Shares purchased from contributions (if applicable) */
  sharesFromContributions: number;
  /** Total contributions made during year */
  contributionsMade: number;
  /** Cumulative contributions */
  cumulativeContributions: number;
}

/**
 * Tax-adjusted dividend income breakdown
 */
export interface DividendTaxBreakdown {
  /** Gross annual dividend income */
  grossDividendIncome: number;
  /** Qualified dividend amount (taxed at capital gains rates) */
  qualifiedDividends: number;
  /** Ordinary dividend amount (taxed at ordinary income rates) */
  ordinaryDividends: number;
  /** Federal tax on qualified dividends */
  qualifiedDividendTax: number;
  /** Federal tax on ordinary dividends */
  ordinaryDividendTax: number;
  /** State tax on all dividends */
  stateTax: number;
  /** Total tax on dividends */
  totalTax: number;
  /** Net dividend income after taxes */
  netDividendIncome: number;
  /** Effective tax rate on dividends */
  effectiveTaxRate: number;
}

/**
 * Dividend stability assessment (unique feature)
 */
export interface DividendStabilityAssessment {
  /** Overall stability rating */
  rating: DividendStabilityRating;
  /** Stability score (0-100) */
  score: number;
  /** Key factors affecting stability */
  factors: string[];
  /** Recommendations based on assessment */
  recommendations: string[];
}

/**
 * Complete dividend income calculation result
 */
export interface DividendIncomeResult {
  /** Current dividend yield calculation */
  currentYield: DividendYieldResult;
  /** Year-by-year projections */
  projections: YearlyDividendProjection[];
  /** Final portfolio value */
  finalPortfolioValue: number;
  /** Total dividends received over period */
  totalDividendsReceived: number;
  /** Total contributions made */
  totalContributions: number;
  /** Total investment return (portfolio value + cumulative dividends) */
  totalReturn: number;
  /** Annualized return percentage */
  annualizedReturn: number;
  /** Final annual dividend income */
  finalAnnualDividendIncome: number;
  /** Final monthly dividend income */
  finalMonthlyDividendIncome: number;
  /** Tax breakdown (if tax info provided) */
  taxBreakdown: DividendTaxBreakdown | null;
  /** Income growth from year 1 to final year */
  incomeGrowthPercentage: number;
  /** Years to reach target monthly income milestones */
  incomeMilestones: {
    target: number;
    yearsToReach: number | null;
  }[];
}

/**
 * Get dividend payments per year based on frequency
 */
export function getDividendPaymentsPerYear(frequency: DividendFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'semi-annually':
      return 2;
    case 'annually':
      return 1;
  }
}

/**
 * Calculate dividend yield
 * 
 * Dividend Yield = (Annual Dividend Per Share / Share Price) × 100
 * 
 * @param annualDividendPerShare - Annual dividend per share in dollars
 * @param sharePrice - Current share price in dollars
 * @returns Dividend yield as percentage
 */
export function calculateDividendYield(
  annualDividendPerShare: number,
  sharePrice: number
): number {
  if (sharePrice <= 0) return 0;
  return (annualDividendPerShare / sharePrice) * 100;
}

/**
 * Calculate number of shares from investment amount
 * 
 * @param investmentAmount - Amount to invest in dollars
 * @param sharePrice - Price per share in dollars
 * @returns Number of shares (can be fractional)
 */
export function calculateSharesFromInvestment(
  investmentAmount: number,
  sharePrice: number
): number {
  if (sharePrice <= 0) return 0;
  return investmentAmount / sharePrice;
}

/**
 * Calculate annual dividend income
 * 
 * @param shares - Number of shares owned
 * @param annualDividendPerShare - Annual dividend per share in dollars
 * @returns Annual dividend income in dollars
 */
export function calculateAnnualDividendIncome(
  shares: number,
  annualDividendPerShare: number
): number {
  return shares * annualDividendPerShare;
}

/**
 * 2024 Qualified Dividend Tax Brackets (same as long-term capital gains)
 */
const QUALIFIED_DIVIDEND_BRACKETS_2024: Record<DividendTaxFilingStatus, { threshold15: number; threshold20: number }> = {
  single: { threshold15: 47025, threshold20: 518900 },
  married_joint: { threshold15: 94050, threshold20: 583750 },
  married_separate: { threshold15: 47025, threshold20: 291850 },
  head_of_household: { threshold15: 63000, threshold20: 551350 },
};

/**
 * 2024 Ordinary Income Tax Brackets (simplified for dividend calculations)
 */
const ORDINARY_INCOME_BRACKETS_2024: Record<DividendTaxFilingStatus, number[]> = {
  single: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  married_joint: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  married_separate: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  head_of_household: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
};

/**
 * Calculate qualified dividend tax rate based on income level
 * 
 * @param taxableIncome - Estimated taxable income
 * @param filingStatus - Tax filing status
 * @returns Tax rate as decimal (0, 0.15, or 0.20)
 */
export function getQualifiedDividendTaxRate(
  taxableIncome: number,
  filingStatus: DividendTaxFilingStatus
): number {
  const brackets = QUALIFIED_DIVIDEND_BRACKETS_2024[filingStatus];
  
  if (taxableIncome <= brackets.threshold15) {
    return 0; // 0% bracket
  } else if (taxableIncome <= brackets.threshold20) {
    return 0.15; // 15% bracket
  } else {
    return 0.20; // 20% bracket
  }
}

/**
 * Estimate ordinary income tax rate (simplified)
 * 
 * @param taxableIncome - Estimated taxable income
 * @param filingStatus - Tax filing status
 * @returns Estimated marginal tax rate as decimal
 */
export function estimateOrdinaryTaxRate(
  taxableIncome: number,
  filingStatus: DividendTaxFilingStatus
): number {
  // Simplified marginal rate estimation
  if (taxableIncome <= 11600) return 0.10;
  if (taxableIncome <= 47150) return 0.12;
  if (taxableIncome <= 100525) return 0.22;
  if (taxableIncome <= 191950) return 0.24;
  if (taxableIncome <= 243725) return 0.32;
  if (taxableIncome <= 609350) return 0.35;
  return 0.37;
}

/**
 * Calculate tax-adjusted dividend income
 * 
 * @param grossDividendIncome - Total dividend income before taxes
 * @param qualifiedPercentage - Percentage of dividends that are qualified (0-100)
 * @param taxableIncome - Estimated total taxable income
 * @param filingStatus - Tax filing status
 * @param stateTaxRate - State income tax rate as percentage
 * @returns Tax breakdown with net income
 */
export function calculateDividendTaxBreakdown(
  grossDividendIncome: number,
  qualifiedPercentage: number,
  taxableIncome: number,
  filingStatus: DividendTaxFilingStatus,
  stateTaxRate: number = 0
): DividendTaxBreakdown {
  const qualifiedDividends = grossDividendIncome * (qualifiedPercentage / 100);
  const ordinaryDividends = grossDividendIncome - qualifiedDividends;
  
  const qualifiedRate = getQualifiedDividendTaxRate(taxableIncome, filingStatus);
  const ordinaryRate = estimateOrdinaryTaxRate(taxableIncome, filingStatus);
  
  const qualifiedDividendTax = qualifiedDividends * qualifiedRate;
  const ordinaryDividendTax = ordinaryDividends * ordinaryRate;
  const stateTax = grossDividendIncome * (stateTaxRate / 100);
  
  const totalTax = qualifiedDividendTax + ordinaryDividendTax + stateTax;
  const netDividendIncome = grossDividendIncome - totalTax;
  const effectiveTaxRate = grossDividendIncome > 0 ? (totalTax / grossDividendIncome) * 100 : 0;
  
  return {
    grossDividendIncome,
    qualifiedDividends,
    ordinaryDividends,
    qualifiedDividendTax,
    ordinaryDividendTax,
    stateTax,
    totalTax,
    netDividendIncome,
    effectiveTaxRate,
  };
}

/**
 * Assess dividend stability based on yield and growth characteristics
 * (Unique feature - competitors don't offer this)
 * 
 * @param dividendYield - Current dividend yield percentage
 * @param dividendGrowthRate - Historical/expected dividend growth rate
 * @param yearsOfDividends - Years of consistent dividend payments
 * @returns Stability assessment with rating, score, and recommendations
 */
export function assessDividendStability(
  dividendYield: number,
  dividendGrowthRate: number = 0,
  yearsOfDividends: number = 5
): DividendStabilityAssessment {
  let score = 50; // Start at neutral
  const factors: string[] = [];
  const recommendations: string[] = [];
  
  // Yield assessment (very high yields can be unsustainable)
  if (dividendYield > 8) {
    score -= 20;
    factors.push('Very high yield may indicate dividend cut risk');
    recommendations.push('Research company fundamentals and payout ratio carefully');
  } else if (dividendYield > 6) {
    score -= 10;
    factors.push('Above-average yield warrants investigation');
    recommendations.push('Verify the dividend is supported by cash flow');
  } else if (dividendYield >= 2 && dividendYield <= 4) {
    score += 15;
    factors.push('Yield in sustainable range for most companies');
  } else if (dividendYield < 2) {
    score += 5;
    factors.push('Lower yield typically indicates growth focus');
    recommendations.push('Consider if dividend growth compensates for lower yield');
  }
  
  // Growth assessment
  if (dividendGrowthRate >= 7) {
    score += 20;
    factors.push('Strong dividend growth history');
  } else if (dividendGrowthRate >= 3) {
    score += 10;
    factors.push('Moderate dividend growth');
  } else if (dividendGrowthRate > 0) {
    score += 5;
    factors.push('Slow but positive dividend growth');
  } else if (dividendGrowthRate === 0) {
    factors.push('Flat dividend (no recent increases)');
    recommendations.push('Monitor for potential dividend cuts');
  } else {
    score -= 15;
    factors.push('Declining dividends - warning sign');
    recommendations.push('Consider reducing position or finding alternatives');
  }
  
  // Consistency assessment
  if (yearsOfDividends >= 25) {
    score += 25;
    factors.push('Dividend Aristocrat status (25+ years of increases)');
  } else if (yearsOfDividends >= 10) {
    score += 15;
    factors.push('Decade-plus dividend track record');
  } else if (yearsOfDividends >= 5) {
    score += 5;
    factors.push('Established dividend history');
  } else {
    factors.push('Limited dividend history');
    recommendations.push('New dividend payers carry more uncertainty');
  }
  
  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine rating
  let rating: DividendStabilityRating;
  if (score >= 80) {
    rating = 'excellent';
  } else if (score >= 60) {
    rating = 'good';
  } else if (score >= 40) {
    rating = 'moderate';
  } else if (score >= 20) {
    rating = 'risky';
  } else {
    rating = 'very-risky';
  }
  
  return {
    rating,
    score,
    factors,
    recommendations,
  };
}

/**
 * Calculate comprehensive dividend income projections
 * 
 * Main calculation function that projects dividend income with optional:
 * - Dividend reinvestment (DRIP)
 * - Monthly contributions
 * - Dividend growth
 * - Share price appreciation
 * - Tax calculations
 * 
 * @param inputs - Calculation parameters
 * @returns Complete dividend income results with projections
 */
export function calculateDividendIncome(
  inputs: DividendIncomeInputs
): DividendIncomeResult {
  const {
    initialInvestment,
    sharePrice,
    annualDividendPerShare,
    dividendGrowthRate = 0,
    priceAppreciationRate = 0,
    years,
    reinvestDividends = true,
    monthlyContribution = 0,
    dividendFrequency = 'quarterly',
    taxFilingStatus,
    qualifiedDividendPercentage = 100,
    stateTaxRate = 0,
  } = inputs;

  // Validate inputs
  if (initialInvestment < 0) throw new Error('Initial investment cannot be negative');
  if (sharePrice <= 0) throw new Error('Share price must be positive');
  if (annualDividendPerShare < 0) throw new Error('Annual dividend cannot be negative');
  if (years <= 0) throw new Error('Years must be positive');

  // Calculate initial state
  let currentShares = calculateSharesFromInvestment(initialInvestment, sharePrice);
  let currentSharePrice = sharePrice;
  let currentDividendPerShare = annualDividendPerShare;
  let cumulativeDividends = 0;
  let cumulativeContributions = initialInvestment;
  
  const dividendGrowthDecimal = dividendGrowthRate / 100;
  const priceGrowthDecimal = priceAppreciationRate / 100;
  const paymentsPerYear = getDividendPaymentsPerYear(dividendFrequency);
  const annualContribution = monthlyContribution * 12;
  
  // Current yield calculation
  const currentYield: DividendYieldResult = {
    dividendYield: calculateDividendYield(annualDividendPerShare, sharePrice),
    annualDividendIncome: calculateAnnualDividendIncome(currentShares, annualDividendPerShare),
    monthlyDividendIncome: calculateAnnualDividendIncome(currentShares, annualDividendPerShare) / 12,
    sharesOwned: currentShares,
    sharePrice,
    annualDividendPerShare,
  };

  const projections: YearlyDividendProjection[] = [];
  
  // Year-by-year projection
  for (let year = 1; year <= years; year++) {
    // Apply dividend growth at start of year
    if (year > 1) {
      currentDividendPerShare *= (1 + dividendGrowthDecimal);
    }
    
    // Calculate dividends for the year
    const dividendPerPayment = currentDividendPerShare / paymentsPerYear;
    let yearlyDividends = 0;
    let sharesFromDRIP = 0;
    let sharesFromContributions = 0;
    
    // Process each dividend payment period
    for (let period = 0; period < paymentsPerYear; period++) {
      // Calculate dividend payment
      const dividendPayment = currentShares * dividendPerPayment;
      yearlyDividends += dividendPayment;
      
      // Reinvest dividends if DRIP is enabled
      if (reinvestDividends && dividendPayment > 0) {
        const newSharesFromDRIP = dividendPayment / currentSharePrice;
        currentShares += newSharesFromDRIP;
        sharesFromDRIP += newSharesFromDRIP;
      }
      
      // Add contributions (distributed across payment periods)
      const periodContribution = annualContribution / paymentsPerYear;
      if (periodContribution > 0) {
        const newSharesFromContribution = periodContribution / currentSharePrice;
        currentShares += newSharesFromContribution;
        sharesFromContributions += newSharesFromContribution;
      }
      
      // Apply price appreciation (proportionally across the year)
      currentSharePrice *= Math.pow(1 + priceGrowthDecimal, 1 / paymentsPerYear);
    }
    
    cumulativeDividends += yearlyDividends;
    cumulativeContributions += annualContribution;
    
    projections.push({
      year,
      sharesOwned: currentShares,
      sharePrice: currentSharePrice,
      dividendPerShare: currentDividendPerShare,
      portfolioValue: currentShares * currentSharePrice,
      dividendsReceived: yearlyDividends,
      cumulativeDividends,
      dividendYield: calculateDividendYield(currentDividendPerShare, currentSharePrice),
      sharesFromDRIP,
      sharesFromContributions,
      contributionsMade: annualContribution,
      cumulativeContributions,
    });
  }

  // Calculate final metrics
  const finalPortfolioValue = currentShares * currentSharePrice;
  const finalAnnualDividendIncome = currentShares * currentDividendPerShare;
  const finalMonthlyDividendIncome = finalAnnualDividendIncome / 12;
  const totalReturn = finalPortfolioValue + (reinvestDividends ? 0 : cumulativeDividends) - cumulativeContributions;
  
  // Calculate annualized return
  const totalValue = finalPortfolioValue + (reinvestDividends ? 0 : cumulativeDividends);
  const annualizedReturn = years > 0 
    ? (Math.pow(totalValue / cumulativeContributions, 1 / years) - 1) * 100 
    : 0;
  
  // Income growth percentage
  const incomeGrowthPercentage = currentYield.annualDividendIncome > 0
    ? ((finalAnnualDividendIncome - currentYield.annualDividendIncome) / currentYield.annualDividendIncome) * 100
    : 0;
  
  // Calculate income milestones
  const incomeMilestones = [500, 1000, 2000, 5000, 10000].map(target => {
    const yearReached = projections.find(p => {
      const monthlyIncome = (p.sharesOwned * p.dividendPerShare) / 12;
      return monthlyIncome >= target;
    });
    return {
      target,
      yearsToReach: yearReached ? yearReached.year : null,
    };
  });
  
  // Tax breakdown (if tax info provided)
  let taxBreakdown: DividendTaxBreakdown | null = null;
  if (taxFilingStatus) {
    // Assume taxable income around $75,000 for demonstration
    const estimatedTaxableIncome = 75000;
    taxBreakdown = calculateDividendTaxBreakdown(
      finalAnnualDividendIncome,
      qualifiedDividendPercentage,
      estimatedTaxableIncome,
      taxFilingStatus,
      stateTaxRate
    );
  }
  
  return {
    currentYield,
    projections,
    finalPortfolioValue,
    totalDividendsReceived: cumulativeDividends,
    totalContributions: cumulativeContributions,
    totalReturn,
    annualizedReturn,
    finalAnnualDividendIncome,
    finalMonthlyDividendIncome,
    taxBreakdown,
    incomeGrowthPercentage,
    incomeMilestones,
  };
}

/**
 * Quick dividend yield calculation
 * 
 * @param investmentAmount - Amount invested
 * @param sharePrice - Price per share
 * @param annualDividendPerShare - Annual dividend per share
 * @returns Simple dividend yield result
 */
export function quickDividendYield(
  investmentAmount: number,
  sharePrice: number,
  annualDividendPerShare: number
): DividendYieldResult {
  const shares = calculateSharesFromInvestment(investmentAmount, sharePrice);
  const annualIncome = calculateAnnualDividendIncome(shares, annualDividendPerShare);
  
  return {
    dividendYield: calculateDividendYield(annualDividendPerShare, sharePrice),
    annualDividendIncome: annualIncome,
    monthlyDividendIncome: annualIncome / 12,
    sharesOwned: shares,
    sharePrice,
    annualDividendPerShare,
  };
}

/**
 * Calculate required investment for target monthly income
 * 
 * @param targetMonthlyIncome - Desired monthly dividend income
 * @param sharePrice - Price per share
 * @param annualDividendPerShare - Annual dividend per share
 * @returns Required investment amount
 */
export function calculateRequiredInvestment(
  targetMonthlyIncome: number,
  sharePrice: number,
  annualDividendPerShare: number
): number {
  if (annualDividendPerShare <= 0) return Infinity;
  
  const targetAnnualIncome = targetMonthlyIncome * 12;
  const requiredShares = targetAnnualIncome / annualDividendPerShare;
  return requiredShares * sharePrice;
}

/**
 * Compare dividend scenarios (different stocks or allocations)
 * 
 * @param scenarios - Array of dividend income inputs to compare
 * @returns Array of results for comparison
 */
export function compareDividendScenarios(
  scenarios: DividendIncomeInputs[]
): DividendIncomeResult[] {
  return scenarios.map(scenario => calculateDividendIncome(scenario));
}

/**
 * Estimate years to financial freedom from dividends
 * 
 * @param targetAnnualIncome - Annual income goal from dividends
 * @param initialInvestment - Starting investment
 * @param monthlyContribution - Monthly addition to portfolio
 * @param dividendYield - Expected dividend yield percentage
 * @param dividendGrowthRate - Expected dividend growth percentage
 * @param maxYears - Maximum years to check (default 50)
 * @returns Estimated years to reach goal, or null if not achievable
 */
export function estimateYearsToGoal(
  targetAnnualIncome: number,
  initialInvestment: number,
  monthlyContribution: number,
  dividendYield: number,
  dividendGrowthRate: number = 0,
  maxYears: number = 50
): number | null {
  // Simulate using a typical share price assumption
  const assumedSharePrice = 100;
  const annualDividendPerShare = assumedSharePrice * (dividendYield / 100);
  
  for (let years = 1; years <= maxYears; years++) {
    const result = calculateDividendIncome({
      initialInvestment,
      sharePrice: assumedSharePrice,
      annualDividendPerShare,
      dividendGrowthRate,
      priceAppreciationRate: 5, // Conservative price growth
      years,
      reinvestDividends: true,
      monthlyContribution,
    });
    
    if (result.finalAnnualDividendIncome >= targetAnnualIncome) {
      return years;
    }
  }
  
  return null;
}
