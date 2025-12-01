/**
 * Net Worth Calculator
 * 
 * Calculates net worth (assets minus liabilities) with detailed breakdowns,
 * financial health metrics, age-based comparisons, and growth projections.
 * 
 * Formula: Net Worth = Total Assets - Total Liabilities
 * 
 * Features:
 * - Multiple asset categories (cash, investments, retirement, real estate, vehicles, other)
 * - Multiple liability categories (mortgage, auto loans, student loans, credit cards, other)
 * - Liquid vs illiquid asset breakdown
 * - Debt-to-asset ratio
 * - Financial health score
 * - Age-based percentile comparisons
 * - Net worth growth projections
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Categories of assets
 */
export type AssetCategory = 
  | 'cash' 
  | 'investments' 
  | 'retirement' 
  | 'real-estate' 
  | 'vehicles' 
  | 'other-assets';

/**
 * Categories of liabilities
 */
export type LiabilityCategory = 
  | 'mortgage' 
  | 'auto-loans' 
  | 'student-loans' 
  | 'credit-cards' 
  | 'personal-loans'
  | 'other-liabilities';

/**
 * Financial health rating based on various metrics
 */
export type FinancialHealthRating = 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'needs-improvement' 
  | 'critical';

/**
 * Individual asset entry
 */
export interface AssetEntry {
  /** Name/description of the asset */
  name: string;
  /** Category of the asset */
  category: AssetCategory;
  /** Current market value */
  value: number;
  /** Whether this asset can be quickly converted to cash */
  isLiquid?: boolean;
}

/**
 * Individual liability entry
 */
export interface LiabilityEntry {
  /** Name/description of the liability */
  name: string;
  /** Category of the liability */
  category: LiabilityCategory;
  /** Current balance owed */
  balance: number;
  /** Annual interest rate (optional, for projection purposes) */
  interestRate?: number;
  /** Monthly payment (optional) */
  monthlyPayment?: number;
}

/**
 * Summarized assets by category
 */
export interface AssetSummary {
  /** Total cash and cash equivalents */
  cash: number;
  /** Total investment accounts (brokerage, stocks, bonds, etc.) */
  investments: number;
  /** Total retirement accounts (401k, IRA, pension, etc.) */
  retirement: number;
  /** Total real estate value */
  realEstate: number;
  /** Total vehicle values */
  vehicles: number;
  /** Other assets (jewelry, collectibles, etc.) */
  otherAssets: number;
}

/**
 * Summarized liabilities by category
 */
export interface LiabilitySummary {
  /** Total mortgage balances */
  mortgage: number;
  /** Total auto loan balances */
  autoLoans: number;
  /** Total student loan balances */
  studentLoans: number;
  /** Total credit card balances */
  creditCards: number;
  /** Total personal loan balances */
  personalLoans: number;
  /** Other liabilities */
  otherLiabilities: number;
}

/**
 * Input parameters for net worth calculation
 */
export interface NetWorthInputs {
  /** List of all assets */
  assets: AssetEntry[];
  /** List of all liabilities */
  liabilities: LiabilityEntry[];
  /** User's age (for percentile comparison) */
  age?: number;
  /** Annual household income (for ratio calculations) */
  annualIncome?: number;
  /** Expected annual investment return rate for projections (percentage) */
  expectedReturnRate?: number;
  /** Monthly savings rate for projections */
  monthlySavingsRate?: number;
}

/**
 * Asset allocation breakdown
 */
export interface AssetAllocation {
  /** Category name */
  category: string;
  /** Total value in this category */
  value: number;
  /** Percentage of total assets */
  percentage: number;
  /** Color for visualization */
  color: string;
}

/**
 * Liability allocation breakdown
 */
export interface LiabilityAllocation {
  /** Category name */
  category: string;
  /** Total balance in this category */
  balance: number;
  /** Percentage of total liabilities */
  percentage: number;
  /** Color for visualization */
  color: string;
}

/**
 * Financial health metrics
 */
export interface FinancialHealthMetrics {
  /** Debt-to-asset ratio (total liabilities / total assets) */
  debtToAssetRatio: number;
  /** Debt-to-income ratio (total liabilities / annual income) */
  debtToIncomeRatio: number | null;
  /** Percentage of assets that are liquid */
  liquidityRatio: number;
  /** Emergency fund coverage in months (liquid assets / monthly expenses estimate) */
  emergencyFundMonths: number | null;
  /** Overall financial health rating */
  rating: FinancialHealthRating;
  /** Detailed score (0-100) */
  score: number;
  /** Recommendations based on metrics */
  recommendations: string[];
}

/**
 * Age-based percentile data
 */
export interface AgeBasedComparison {
  /** User's age bracket */
  ageBracket: string;
  /** User's percentile (0-100) */
  percentile: number;
  /** Median net worth for age bracket */
  medianNetWorth: number;
  /** 25th percentile net worth */
  percentile25: number;
  /** 75th percentile net worth */
  percentile75: number;
  /** 90th percentile net worth */
  percentile90: number;
  /** Status relative to median */
  status: 'above-median' | 'below-median' | 'at-median';
}

/**
 * Year-by-year net worth projection
 */
export interface YearlyProjection {
  /** Year number (0 = current) */
  year: number;
  /** Projected total assets */
  projectedAssets: number;
  /** Projected total liabilities */
  projectedLiabilities: number;
  /** Projected net worth */
  projectedNetWorth: number;
  /** Age at this year (if provided) */
  age: number | null;
}

/**
 * Complete net worth calculation results
 */
export interface NetWorthResult {
  /** Net worth (assets - liabilities) */
  netWorth: number;
  /** Total value of all assets */
  totalAssets: number;
  /** Total value of all liabilities */
  totalLiabilities: number;
  /** Assets broken down by category */
  assetSummary: AssetSummary;
  /** Liabilities broken down by category */
  liabilitySummary: LiabilitySummary;
  /** Total liquid assets (easily converted to cash) */
  liquidAssets: number;
  /** Total illiquid assets */
  illiquidAssets: number;
  /** Asset allocation for visualization */
  assetAllocation: AssetAllocation[];
  /** Liability allocation for visualization */
  liabilityAllocation: LiabilityAllocation[];
  /** Financial health metrics */
  financialHealth: FinancialHealthMetrics;
  /** Age-based comparison (if age provided) */
  ageComparison: AgeBasedComparison | null;
  /** 10-year net worth projection */
  projections: YearlyProjection[];
  /** Whether net worth is positive */
  isPositive: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Colors for asset categories in visualizations
 */
export const ASSET_COLORS: Record<AssetCategory, string> = {
  'cash': '#10b981', // emerald-500
  'investments': '#3b82f6', // blue-500
  'retirement': '#8b5cf6', // violet-500
  'real-estate': '#f59e0b', // amber-500
  'vehicles': '#64748b', // slate-500
  'other-assets': '#ec4899', // pink-500
};

/**
 * Colors for liability categories in visualizations
 */
export const LIABILITY_COLORS: Record<LiabilityCategory, string> = {
  'mortgage': '#ef4444', // red-500
  'auto-loans': '#f97316', // orange-500
  'student-loans': '#a855f7', // purple-500
  'credit-cards': '#dc2626', // red-600
  'personal-loans': '#ea580c', // orange-600
  'other-liabilities': '#9ca3af', // gray-400
};

/**
 * Display names for asset categories
 */
export const ASSET_CATEGORY_NAMES: Record<AssetCategory, string> = {
  'cash': 'Cash & Savings',
  'investments': 'Investments',
  'retirement': 'Retirement Accounts',
  'real-estate': 'Real Estate',
  'vehicles': 'Vehicles',
  'other-assets': 'Other Assets',
};

/**
 * Display names for liability categories
 */
export const LIABILITY_CATEGORY_NAMES: Record<LiabilityCategory, string> = {
  'mortgage': 'Mortgage',
  'auto-loans': 'Auto Loans',
  'student-loans': 'Student Loans',
  'credit-cards': 'Credit Cards',
  'personal-loans': 'Personal Loans',
  'other-liabilities': 'Other Debt',
};

/**
 * Median net worth by age bracket (based on Federal Reserve SCF 2022 data)
 * These are approximations and should be updated periodically
 */
const NET_WORTH_BY_AGE: Record<string, { median: number; p25: number; p75: number; p90: number }> = {
  'under-25': { median: 10400, p25: 1000, p75: 35000, p90: 75000 },
  '25-34': { median: 39000, p25: 7500, p75: 135000, p90: 300000 },
  '35-44': { median: 135600, p25: 25000, p75: 350000, p90: 750000 },
  '45-54': { median: 247200, p25: 50000, p75: 575000, p90: 1200000 },
  '55-64': { median: 364500, p25: 70000, p75: 900000, p90: 2000000 },
  '65-74': { median: 409900, p25: 85000, p75: 1000000, p90: 2200000 },
  '75+': { median: 335600, p25: 65000, p75: 800000, p90: 1800000 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the age bracket string for a given age
 */
function getAgeBracket(age: number): string {
  if (age < 25) return 'under-25';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  if (age < 65) return '55-64';
  if (age < 75) return '65-74';
  return '75+';
}

/**
 * Get display label for age bracket
 */
function getAgeBracketLabel(bracket: string): string {
  switch (bracket) {
    case 'under-25': return 'Under 25';
    case '25-34': return '25-34';
    case '35-44': return '35-44';
    case '45-54': return '45-54';
    case '55-64': return '55-64';
    case '65-74': return '65-74';
    case '75+': return '75 and over';
    default: return bracket;
  }
}

/**
 * Calculate percentile rank for net worth within age bracket
 */
function calculatePercentile(netWorth: number, ageBracket: string): number {
  const data = NET_WORTH_BY_AGE[ageBracket];
  if (!data) return 50;

  // Simple linear interpolation between known percentiles
  if (netWorth <= data.p25) {
    return Math.max(0, 25 * (netWorth / data.p25));
  } else if (netWorth <= data.median) {
    return 25 + 25 * ((netWorth - data.p25) / (data.median - data.p25));
  } else if (netWorth <= data.p75) {
    return 50 + 25 * ((netWorth - data.median) / (data.p75 - data.median));
  } else if (netWorth <= data.p90) {
    return 75 + 15 * ((netWorth - data.p75) / (data.p90 - data.p75));
  } else {
    return Math.min(99, 90 + 10 * ((netWorth - data.p90) / data.p90));
  }
}

/**
 * Calculate financial health rating based on metrics
 */
function calculateHealthRating(
  debtToAssetRatio: number,
  liquidityRatio: number,
  debtToIncomeRatio: number | null,
  netWorth: number
): { rating: FinancialHealthRating; score: number } {
  let score = 50; // Start at neutral

  // Net worth impact (max 25 points)
  if (netWorth > 0) {
    score += Math.min(25, netWorth / 10000);
  } else {
    score -= Math.min(25, Math.abs(netWorth) / 10000);
  }

  // Debt-to-asset ratio (max 25 points)
  if (debtToAssetRatio === 0) {
    score += 25;
  } else if (debtToAssetRatio < 0.2) {
    score += 20;
  } else if (debtToAssetRatio < 0.4) {
    score += 10;
  } else if (debtToAssetRatio < 0.6) {
    score += 0;
  } else if (debtToAssetRatio < 0.8) {
    score -= 10;
  } else {
    score -= 20;
  }

  // Liquidity ratio (max 15 points)
  if (liquidityRatio > 0.3) {
    score += 15;
  } else if (liquidityRatio > 0.2) {
    score += 10;
  } else if (liquidityRatio > 0.1) {
    score += 5;
  } else {
    score -= 5;
  }

  // Debt-to-income ratio (max 10 points)
  if (debtToIncomeRatio !== null) {
    if (debtToIncomeRatio < 1) {
      score += 10;
    } else if (debtToIncomeRatio < 2) {
      score += 5;
    } else if (debtToIncomeRatio < 3) {
      score += 0;
    } else {
      score -= 5;
    }
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine rating
  let rating: FinancialHealthRating;
  if (score >= 80) {
    rating = 'excellent';
  } else if (score >= 60) {
    rating = 'good';
  } else if (score >= 40) {
    rating = 'fair';
  } else if (score >= 20) {
    rating = 'needs-improvement';
  } else {
    rating = 'critical';
  }

  return { rating, score };
}

/**
 * Generate recommendations based on financial metrics
 */
function generateRecommendations(
  netWorth: number,
  debtToAssetRatio: number,
  liquidityRatio: number,
  debtToIncomeRatio: number | null,
  assetSummary: AssetSummary,
  liabilitySummary: LiabilitySummary
): string[] {
  const recommendations: string[] = [];

  // Negative net worth
  if (netWorth < 0) {
    recommendations.push('Focus on paying down high-interest debt to improve your net worth.');
  }

  // High debt-to-asset ratio
  if (debtToAssetRatio > 0.5) {
    recommendations.push('Consider strategies to reduce debt relative to your assets.');
  }

  // Low liquidity
  if (liquidityRatio < 0.15) {
    recommendations.push('Build up emergency savings to improve financial flexibility.');
  }

  // High credit card debt
  if (liabilitySummary.creditCards > 0) {
    recommendations.push('Prioritize paying off credit card debt due to high interest rates.');
  }

  // Low retirement savings
  const totalAssets = Object.values(assetSummary).reduce((a, b) => a + b, 0);
  if (totalAssets > 0 && assetSummary.retirement / totalAssets < 0.15) {
    recommendations.push('Consider increasing retirement contributions for long-term growth.');
  }

  // High DTI ratio
  if (debtToIncomeRatio !== null && debtToIncomeRatio > 2) {
    recommendations.push('Your debt relative to income is high. Focus on debt reduction.');
  }

  // Good financial health
  if (recommendations.length === 0 && netWorth > 0) {
    recommendations.push('Your financial health looks good! Consider optimizing your investment allocation.');
    if (liquidityRatio > 0.3) {
      recommendations.push('You have strong liquidity. Ensure excess cash is earning competitive interest.');
    }
  }

  return recommendations.slice(0, 4); // Limit to 4 recommendations
}

// ============================================================================
// MAIN CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate complete net worth analysis
 * 
 * @param inputs - Asset and liability data along with optional user information
 * @returns Complete net worth calculation with breakdowns and projections
 * 
 * @example
 * ```typescript
 * const result = calculateNetWorth({
 *   assets: [
 *     { name: 'Checking', category: 'cash', value: 5000 },
 *     { name: 'Savings', category: 'cash', value: 15000, isLiquid: true },
 *     { name: '401(k)', category: 'retirement', value: 85000 },
 *     { name: 'Home', category: 'real-estate', value: 350000 },
 *   ],
 *   liabilities: [
 *     { name: 'Mortgage', category: 'mortgage', balance: 280000 },
 *     { name: 'Car Loan', category: 'auto-loans', balance: 15000 },
 *   ],
 *   age: 35,
 *   annualIncome: 100000,
 * });
 * 
 * console.log(result.netWorth); // 160,000
 * ```
 */
export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const {
    assets,
    liabilities,
    age,
    annualIncome,
    expectedReturnRate = 6,
    monthlySavingsRate = 0,
  } = inputs;

  // Calculate asset totals by category
  const assetSummary: AssetSummary = {
    cash: 0,
    investments: 0,
    retirement: 0,
    realEstate: 0,
    vehicles: 0,
    otherAssets: 0,
  };

  let liquidAssets = 0;
  let illiquidAssets = 0;

  for (const asset of assets) {
    const value = Math.max(0, asset.value);
    
    switch (asset.category) {
      case 'cash':
        assetSummary.cash += value;
        liquidAssets += value; // Cash is always liquid
        break;
      case 'investments':
        assetSummary.investments += value;
        // Investments are generally liquid unless specified otherwise
        if (asset.isLiquid !== false) {
          liquidAssets += value;
        } else {
          illiquidAssets += value;
        }
        break;
      case 'retirement':
        assetSummary.retirement += value;
        // Retirement accounts are generally illiquid
        if (asset.isLiquid === true) {
          liquidAssets += value;
        } else {
          illiquidAssets += value;
        }
        break;
      case 'real-estate':
        assetSummary.realEstate += value;
        illiquidAssets += value;
        break;
      case 'vehicles':
        assetSummary.vehicles += value;
        illiquidAssets += value;
        break;
      case 'other-assets':
        assetSummary.otherAssets += value;
        if (asset.isLiquid === true) {
          liquidAssets += value;
        } else {
          illiquidAssets += value;
        }
        break;
    }
  }

  // Calculate liability totals by category
  const liabilitySummary: LiabilitySummary = {
    mortgage: 0,
    autoLoans: 0,
    studentLoans: 0,
    creditCards: 0,
    personalLoans: 0,
    otherLiabilities: 0,
  };

  for (const liability of liabilities) {
    const balance = Math.max(0, liability.balance);
    
    switch (liability.category) {
      case 'mortgage':
        liabilitySummary.mortgage += balance;
        break;
      case 'auto-loans':
        liabilitySummary.autoLoans += balance;
        break;
      case 'student-loans':
        liabilitySummary.studentLoans += balance;
        break;
      case 'credit-cards':
        liabilitySummary.creditCards += balance;
        break;
      case 'personal-loans':
        liabilitySummary.personalLoans += balance;
        break;
      case 'other-liabilities':
        liabilitySummary.otherLiabilities += balance;
        break;
    }
  }

  // Calculate totals
  const totalAssets = 
    assetSummary.cash +
    assetSummary.investments +
    assetSummary.retirement +
    assetSummary.realEstate +
    assetSummary.vehicles +
    assetSummary.otherAssets;

  const totalLiabilities =
    liabilitySummary.mortgage +
    liabilitySummary.autoLoans +
    liabilitySummary.studentLoans +
    liabilitySummary.creditCards +
    liabilitySummary.personalLoans +
    liabilitySummary.otherLiabilities;

  const netWorth = totalAssets - totalLiabilities;

  // Create asset allocation for visualization
  const assetAllocation: AssetAllocation[] = [];
  if (assetSummary.cash > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['cash'],
      value: assetSummary.cash,
      percentage: totalAssets > 0 ? (assetSummary.cash / totalAssets) * 100 : 0,
      color: ASSET_COLORS['cash'],
    });
  }
  if (assetSummary.investments > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['investments'],
      value: assetSummary.investments,
      percentage: totalAssets > 0 ? (assetSummary.investments / totalAssets) * 100 : 0,
      color: ASSET_COLORS['investments'],
    });
  }
  if (assetSummary.retirement > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['retirement'],
      value: assetSummary.retirement,
      percentage: totalAssets > 0 ? (assetSummary.retirement / totalAssets) * 100 : 0,
      color: ASSET_COLORS['retirement'],
    });
  }
  if (assetSummary.realEstate > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['real-estate'],
      value: assetSummary.realEstate,
      percentage: totalAssets > 0 ? (assetSummary.realEstate / totalAssets) * 100 : 0,
      color: ASSET_COLORS['real-estate'],
    });
  }
  if (assetSummary.vehicles > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['vehicles'],
      value: assetSummary.vehicles,
      percentage: totalAssets > 0 ? (assetSummary.vehicles / totalAssets) * 100 : 0,
      color: ASSET_COLORS['vehicles'],
    });
  }
  if (assetSummary.otherAssets > 0) {
    assetAllocation.push({
      category: ASSET_CATEGORY_NAMES['other-assets'],
      value: assetSummary.otherAssets,
      percentage: totalAssets > 0 ? (assetSummary.otherAssets / totalAssets) * 100 : 0,
      color: ASSET_COLORS['other-assets'],
    });
  }

  // Create liability allocation for visualization
  const liabilityAllocation: LiabilityAllocation[] = [];
  if (liabilitySummary.mortgage > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['mortgage'],
      balance: liabilitySummary.mortgage,
      percentage: totalLiabilities > 0 ? (liabilitySummary.mortgage / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['mortgage'],
    });
  }
  if (liabilitySummary.autoLoans > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['auto-loans'],
      balance: liabilitySummary.autoLoans,
      percentage: totalLiabilities > 0 ? (liabilitySummary.autoLoans / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['auto-loans'],
    });
  }
  if (liabilitySummary.studentLoans > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['student-loans'],
      balance: liabilitySummary.studentLoans,
      percentage: totalLiabilities > 0 ? (liabilitySummary.studentLoans / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['student-loans'],
    });
  }
  if (liabilitySummary.creditCards > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['credit-cards'],
      balance: liabilitySummary.creditCards,
      percentage: totalLiabilities > 0 ? (liabilitySummary.creditCards / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['credit-cards'],
    });
  }
  if (liabilitySummary.personalLoans > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['personal-loans'],
      balance: liabilitySummary.personalLoans,
      percentage: totalLiabilities > 0 ? (liabilitySummary.personalLoans / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['personal-loans'],
    });
  }
  if (liabilitySummary.otherLiabilities > 0) {
    liabilityAllocation.push({
      category: LIABILITY_CATEGORY_NAMES['other-liabilities'],
      balance: liabilitySummary.otherLiabilities,
      percentage: totalLiabilities > 0 ? (liabilitySummary.otherLiabilities / totalLiabilities) * 100 : 0,
      color: LIABILITY_COLORS['other-liabilities'],
    });
  }

  // Calculate financial health metrics
  const debtToAssetRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
  const liquidityRatio = totalAssets > 0 ? liquidAssets / totalAssets : 0;
  const debtToIncomeRatio = annualIncome ? totalLiabilities / annualIncome : null;
  
  // Estimate emergency fund coverage (assume monthly expenses = income/12 * 0.8)
  const estimatedMonthlyExpenses = annualIncome ? (annualIncome / 12) * 0.8 : null;
  const emergencyFundMonths = estimatedMonthlyExpenses 
    ? liquidAssets / estimatedMonthlyExpenses 
    : null;

  const { rating, score } = calculateHealthRating(
    debtToAssetRatio,
    liquidityRatio,
    debtToIncomeRatio,
    netWorth
  );

  const recommendations = generateRecommendations(
    netWorth,
    debtToAssetRatio,
    liquidityRatio,
    debtToIncomeRatio,
    assetSummary,
    liabilitySummary
  );

  const financialHealth: FinancialHealthMetrics = {
    debtToAssetRatio,
    debtToIncomeRatio,
    liquidityRatio,
    emergencyFundMonths,
    rating,
    score,
    recommendations,
  };

  // Age-based comparison
  let ageComparison: AgeBasedComparison | null = null;
  if (age !== undefined && age > 0) {
    const ageBracket = getAgeBracket(age);
    const bracketData = NET_WORTH_BY_AGE[ageBracket];
    const percentile = calculatePercentile(netWorth, ageBracket);
    
    let status: 'above-median' | 'below-median' | 'at-median';
    if (netWorth > bracketData.median * 1.1) {
      status = 'above-median';
    } else if (netWorth < bracketData.median * 0.9) {
      status = 'below-median';
    } else {
      status = 'at-median';
    }

    ageComparison = {
      ageBracket: getAgeBracketLabel(ageBracket),
      percentile,
      medianNetWorth: bracketData.median,
      percentile25: bracketData.p25,
      percentile75: bracketData.p75,
      percentile90: bracketData.p90,
      status,
    };
  }

  // Generate 10-year projections
  const projections: YearlyProjection[] = [];
  const annualReturnRate = expectedReturnRate / 100;
  const annualSavings = monthlySavingsRate * 12;
  
  let projectedAssets = totalAssets;
  let projectedLiabilities = totalLiabilities;

  for (let year = 0; year <= 10; year++) {
    projections.push({
      year,
      projectedAssets,
      projectedLiabilities,
      projectedNetWorth: projectedAssets - projectedLiabilities,
      age: age !== undefined ? age + year : null,
    });

    // Project next year
    // Assets grow by return rate and savings
    projectedAssets = projectedAssets * (1 + annualReturnRate) + annualSavings;
    
    // Liabilities decrease by estimated payments (simplified)
    // Assume liabilities reduce by ~5% per year through payments
    projectedLiabilities = Math.max(0, projectedLiabilities * 0.95);
  }

  return {
    netWorth,
    totalAssets,
    totalLiabilities,
    assetSummary,
    liabilitySummary,
    liquidAssets,
    illiquidAssets,
    assetAllocation,
    liabilityAllocation,
    financialHealth,
    ageComparison,
    projections,
    isPositive: netWorth >= 0,
  };
}

/**
 * Quick net worth calculation with simplified inputs
 * 
 * @param totalAssets - Total value of all assets
 * @param totalLiabilities - Total value of all liabilities
 * @returns Simple net worth value
 */
export function quickNetWorth(totalAssets: number, totalLiabilities: number): number {
  return totalAssets - totalLiabilities;
}

/**
 * Calculate target net worth by age using the "Net Worth Formula"
 * 
 * Formula: Target Net Worth = (Age × Annual Income) / 10
 * Source: "The Millionaire Next Door" by Thomas Stanley
 * 
 * @param age - Current age
 * @param annualIncome - Current annual income
 * @returns Target net worth
 */
export function calculateTargetNetWorth(age: number, annualIncome: number): number {
  if (age <= 0 || annualIncome <= 0) return 0;
  return (age * annualIncome) / 10;
}

/**
 * Get median net worth for an age bracket
 * 
 * @param age - Current age
 * @returns Median net worth for the age bracket
 */
export function getMedianNetWorthByAge(age: number): number {
  const bracket = getAgeBracket(age);
  return NET_WORTH_BY_AGE[bracket]?.median ?? 0;
}

/**
 * Calculate how long until net worth reaches a target
 * 
 * @param currentNetWorth - Current net worth
 * @param targetNetWorth - Target net worth to reach
 * @param annualReturnRate - Expected annual return rate (percentage)
 * @param annualSavings - Annual savings contribution
 * @returns Years to reach target (or Infinity if not achievable)
 */
export function yearsToReachNetWorth(
  currentNetWorth: number,
  targetNetWorth: number,
  annualReturnRate: number,
  annualSavings: number
): number {
  if (currentNetWorth >= targetNetWorth) return 0;
  if (annualReturnRate <= 0 && annualSavings <= 0) return Infinity;

  const rate = annualReturnRate / 100;
  let netWorth = currentNetWorth;
  let years = 0;
  const maxYears = 100;

  while (netWorth < targetNetWorth && years < maxYears) {
    netWorth = netWorth * (1 + rate) + annualSavings;
    years++;
  }

  return years >= maxYears ? Infinity : years;
}
