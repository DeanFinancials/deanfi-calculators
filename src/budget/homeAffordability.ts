/**
 * Home Affordability Calculator
 *
 * Helps users determine "how much house can I afford" based on income, debts,
 * down payment, and other factors. This is a pre-qualification estimate.
 *
 * Features:
 * - Front-end DTI (housing expense ratio): 28% rule
 * - Back-end DTI (total debt ratio): 36% rule
 * - PMI calculation when down payment < 20%
 * - Property tax and homeowners insurance estimates
 * - HOA dues support
 * - Multiple loan term options (15, 20, 30 years)
 * - Loan type comparison (Conventional, FHA, VA)
 * - Affordability stress test (rate increase scenarios)
 * - Monthly payment breakdown visualization
 * - Unique feature: "Comfort Zone" analysis showing affordable vs stretch budgets
 *
 * Based on industry standards:
 * - 28/36 rule for conventional loans
 * - 31/43 rule for FHA loans
 * - No standard DTI for VA loans (residual income based)
 *
 * @module budget/homeAffordability
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Loan type options
 */
export type LoanType = 'conventional' | 'fha' | 'va' | 'usda';

/**
 * Loan term in years
 */
export type LoanTermYears = 15 | 20 | 30;

/**
 * Affordability comfort level
 */
export type ComfortLevel = 'comfortable' | 'moderate' | 'stretch' | 'risky';

/**
 * Input parameters for home affordability calculation
 */
export interface HomeAffordabilityInputs {
  /** Annual gross income (before taxes) */
  annualIncome: number;

  /** Monthly debt payments (car loans, student loans, credit cards, etc.) */
  monthlyDebts: number;

  /** Available down payment amount */
  downPayment: number;

  /** Annual interest rate as decimal (e.g., 0.065 for 6.5%) */
  interestRate: number;

  /** Loan term in years */
  loanTermYears?: LoanTermYears;

  /** Type of loan */
  loanType?: LoanType;

  /** Annual property tax rate as decimal (e.g., 0.0125 for 1.25%) */
  propertyTaxRate?: number;

  /** Annual homeowners insurance rate as decimal of home value */
  homeInsuranceRate?: number;

  /** Monthly HOA dues (if applicable) */
  monthlyHOA?: number;

  /** Credit score (affects PMI rates) */
  creditScore?: number;

  /** Include PMI in calculations when applicable */
  includePMI?: boolean;

  /** Custom front-end DTI limit (default based on loan type) */
  customFrontEndDTI?: number;

  /** Custom back-end DTI limit (default based on loan type) */
  customBackEndDTI?: number;

  /**
   * Internal flag - skip nested calculations (loan comparisons, stress tests)
   * @internal
   */
  _skipNestedCalculations?: boolean;
}

/**
 * Monthly payment breakdown
 */
export interface MonthlyPaymentBreakdown {
  /** Principal and interest payment */
  principalAndInterest: number;

  /** Monthly property tax */
  propertyTax: number;

  /** Monthly homeowners insurance */
  homeInsurance: number;

  /** Monthly PMI (if applicable) */
  pmi: number;

  /** Monthly HOA dues */
  hoa: number;

  /** Total monthly housing payment (PITI + HOA) */
  totalHousing: number;

  /** Total monthly obligations (housing + other debts) */
  totalMonthly: number;
}

/**
 * DTI (Debt-to-Income) analysis
 */
export interface DTIAnalysis {
  /** Front-end ratio (housing/income) */
  frontEndRatio: number;

  /** Back-end ratio (total debt/income) */
  backEndRatio: number;

  /** Front-end DTI limit used */
  frontEndLimit: number;

  /** Back-end DTI limit used */
  backEndLimit: number;

  /** Whether front-end is within limit */
  frontEndOK: boolean;

  /** Whether back-end is within limit */
  backEndOK: boolean;

  /** Overall DTI assessment */
  status: 'excellent' | 'good' | 'acceptable' | 'high' | 'too-high';

  /** Recommendation message */
  message: string;
}

/**
 * Loan comparison entry for different loan types
 */
export interface LoanComparison {
  /** Loan type */
  loanType: LoanType;

  /** Maximum affordable home price */
  maxHomePrice: number;

  /** Required down payment amount */
  downPaymentRequired: number;

  /** Down payment percentage */
  downPaymentPercent: number;

  /** Monthly payment */
  monthlyPayment: number;

  /** Whether user qualifies based on DTI */
  qualifies: boolean;

  /** Key benefits of this loan type */
  benefits: string[];

  /** Key drawbacks */
  drawbacks: string[];
}

/**
 * Stress test scenario for rate increases
 */
export interface StressTestScenario {
  /** Interest rate for this scenario */
  rate: number;

  /** Rate increase from current */
  rateIncrease: number;

  /** Maximum affordable home price at this rate */
  maxHomePrice: number;

  /** Monthly payment at this rate */
  monthlyPayment: number;

  /** Whether still affordable */
  stillAffordable: boolean;
}

/**
 * Affordability zones showing different comfort levels
 */
export interface AffordabilityZone {
  /** Comfort level label */
  level: ComfortLevel;

  /** Home price range minimum */
  minPrice: number;

  /** Home price range maximum */
  maxPrice: number;

  /** Monthly payment at max price */
  monthlyPayment: number;

  /** Back-end DTI at max price */
  backEndDTI: number;

  /** Description of this zone */
  description: string;

  /** Color for visualization */
  color: string;
}

/**
 * Complete home affordability calculation result
 */
export interface HomeAffordabilityResult {
  /** Maximum affordable home price based on DTI limits */
  maxHomePrice: number;

  /** Loan amount (home price - down payment) */
  loanAmount: number;

  /** Down payment amount */
  downPayment: number;

  /** Down payment as percentage of home price */
  downPaymentPercent: number;

  /** Monthly income (gross) */
  monthlyIncome: number;

  /** Monthly payment breakdown */
  monthlyBreakdown: MonthlyPaymentBreakdown;

  /** DTI analysis */
  dtiAnalysis: DTIAnalysis;

  /** Loan type used */
  loanType: LoanType;

  /** Loan term in years */
  loanTermYears: LoanTermYears;

  /** Interest rate used */
  interestRate: number;

  /** Whether PMI is required */
  pmiRequired: boolean;

  /** Annual PMI cost (if applicable) */
  annualPMI: number;

  /** Affordability zones (comfortable to risky) */
  affordabilityZones: AffordabilityZone[];

  /** Comparison of different loan types */
  loanComparisons: LoanComparison[];

  /** Stress test scenarios for rate increases */
  stressTestScenarios: StressTestScenario[];

  /** Closing costs estimate (2-5% of home price) */
  estimatedClosingCosts: number;

  /** Total cash needed (down payment + closing costs) */
  totalCashNeeded: number;

  /** Effective mortgage rate (rate + PMI impact) */
  effectiveRate: number;

  /** Recommendations based on analysis */
  recommendations: string[];

  /** Warning messages */
  warnings: string[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default DTI limits by loan type
 */
export const DTI_LIMITS: Record<
  LoanType,
  { frontEnd: number; backEnd: number }
> = {
  conventional: { frontEnd: 0.28, backEnd: 0.36 },
  fha: { frontEnd: 0.31, backEnd: 0.43 },
  va: { frontEnd: 0.41, backEnd: 0.41 }, // VA uses residual income, but 41% is guideline
  usda: { frontEnd: 0.29, backEnd: 0.41 },
};

/**
 * Minimum down payment requirements by loan type
 */
export const MIN_DOWN_PAYMENT: Record<LoanType, number> = {
  conventional: 0.03, // 3% minimum for conventional
  fha: 0.035, // 3.5% for FHA
  va: 0.0, // 0% for VA
  usda: 0.0, // 0% for USDA
};

/**
 * PMI rates based on down payment and credit score ranges
 * Rates are annual as percentage of loan amount
 */
export const PMI_RATES: Record<string, number> = {
  // Down payment 3-5%
  'low_excellent': 0.0055, // 0.55%
  'low_good': 0.0078, // 0.78%
  'low_fair': 0.0105, // 1.05%
  'low_poor': 0.0135, // 1.35%
  // Down payment 5-10%
  'mid_excellent': 0.0041,
  'mid_good': 0.0058,
  'mid_fair': 0.0085,
  'mid_poor': 0.0115,
  // Down payment 10-15%
  'high_excellent': 0.0032,
  'high_good': 0.0044,
  'high_fair': 0.0065,
  'high_poor': 0.0095,
  // Down payment 15-20%
  'highest_excellent': 0.0019,
  'highest_good': 0.0027,
  'highest_fair': 0.0045,
  'highest_poor': 0.0065,
};

/**
 * FHA MIP (Mortgage Insurance Premium) rates
 * Upfront: 1.75% of loan amount
 * Annual: varies by loan term and LTV
 */
export const FHA_MIP = {
  upfront: 0.0175,
  annual: {
    '30year_over95ltv': 0.0085, // 0.85%
    '30year_under95ltv': 0.008, // 0.80%
    '15year_over90ltv': 0.007, // 0.70%
    '15year_under90ltv': 0.0045, // 0.45%
  },
};

/**
 * VA Funding Fee rates (one-time)
 */
export const VA_FUNDING_FEE = {
  firstUse: {
    downPaymentUnder5: 0.023, // 2.3%
    downPayment5to10: 0.0165, // 1.65%
    downPaymentOver10: 0.0140, // 1.4%
  },
  subsequentUse: {
    downPaymentUnder5: 0.036, // 3.6%
    downPayment5to10: 0.0165, // 1.65%
    downPaymentOver10: 0.0140, // 1.4%
  },
};

/**
 * Affordability zone colors for visualization
 */
export const ZONE_COLORS: Record<ComfortLevel, string> = {
  comfortable: '#10b981', // emerald-500
  moderate: '#3b82f6', // blue-500
  stretch: '#f59e0b', // amber-500
  risky: '#ef4444', // red-500
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get credit score tier for PMI calculation
 */
function getCreditTier(
  creditScore: number
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (creditScore >= 760) return 'excellent';
  if (creditScore >= 700) return 'good';
  if (creditScore >= 640) return 'fair';
  return 'poor';
}

/**
 * Get down payment tier for PMI calculation
 */
function getDownPaymentTier(
  downPaymentPercent: number
): 'low' | 'mid' | 'high' | 'highest' {
  if (downPaymentPercent < 0.05) return 'low';
  if (downPaymentPercent < 0.1) return 'mid';
  if (downPaymentPercent < 0.15) return 'high';
  return 'highest';
}

/**
 * Calculate monthly PMI payment
 */
export function calculatePMI(
  loanAmount: number,
  homePrice: number,
  creditScore: number = 700
): number {
  const ltv = loanAmount / homePrice;

  // No PMI if LTV <= 80%
  if (ltv <= 0.8) return 0;

  const downPaymentPercent = 1 - ltv;
  const creditTier = getCreditTier(creditScore);
  const dpTier = getDownPaymentTier(downPaymentPercent);

  const rateKey = `${dpTier}_${creditTier}`;
  const annualRate = PMI_RATES[rateKey] ?? 0.008; // Default to 0.8%

  return (loanAmount * annualRate) / 12;
}

/**
 * Calculate FHA MIP (Mortgage Insurance Premium)
 */
export function calculateFHAMIP(
  loanAmount: number,
  homePrice: number,
  loanTermYears: LoanTermYears
): { upfront: number; monthly: number } {
  const ltv = loanAmount / homePrice;

  const upfront = loanAmount * FHA_MIP.upfront;

  let annualRate: number;
  if (loanTermYears <= 15) {
    annualRate =
      ltv > 0.9
        ? FHA_MIP.annual['15year_over90ltv']
        : FHA_MIP.annual['15year_under90ltv'];
  } else {
    annualRate =
      ltv > 0.95
        ? FHA_MIP.annual['30year_over95ltv']
        : FHA_MIP.annual['30year_under95ltv'];
  }

  const monthly = (loanAmount * annualRate) / 12;

  return { upfront, monthly };
}

/**
 * Calculate monthly mortgage payment (principal and interest only)
 */
export function calculateMonthlyMortgagePayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (loanAmount <= 0) return 0;
  if (annualInterestRate <= 0) return loanAmount / (loanTermYears * 12);

  const monthlyRate = annualInterestRate / 12;
  const numPayments = loanTermYears * 12;

  const payment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
}

/**
 * Calculate maximum loan amount based on target monthly payment
 */
export function calculateMaxLoanFromPayment(
  targetMonthlyPayment: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (targetMonthlyPayment <= 0) return 0;
  if (annualInterestRate <= 0) return targetMonthlyPayment * loanTermYears * 12;

  const monthlyRate = annualInterestRate / 12;
  const numPayments = loanTermYears * 12;

  const maxLoan =
    (targetMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

  return maxLoan;
}

/**
 * Get DTI status assessment
 */
function getDTIStatus(
  frontEndRatio: number,
  backEndRatio: number,
  frontEndLimit: number,
  backEndLimit: number
): { status: DTIAnalysis['status']; message: string } {
  // Both well under limits
  if (frontEndRatio <= frontEndLimit * 0.8 && backEndRatio <= backEndLimit * 0.8) {
    return {
      status: 'excellent',
      message:
        'Your debt-to-income ratios are excellent. You have room for unexpected expenses.',
    };
  }

  // Both under limits
  if (frontEndRatio <= frontEndLimit && backEndRatio <= backEndLimit) {
    return {
      status: 'good',
      message:
        'Your debt-to-income ratios are within acceptable limits for this loan type.',
    };
  }

  // Close to limits
  if (
    frontEndRatio <= frontEndLimit * 1.05 &&
    backEndRatio <= backEndLimit * 1.05
  ) {
    return {
      status: 'acceptable',
      message:
        'Your ratios are at the limit. You may qualify but with less financial flexibility.',
    };
  }

  // Over front-end or back-end by up to 10%
  if (
    frontEndRatio <= frontEndLimit * 1.1 ||
    backEndRatio <= backEndLimit * 1.1
  ) {
    return {
      status: 'high',
      message:
        'Your debt ratios are high. Consider a smaller home or paying down debt first.',
    };
  }

  // Significantly over limits
  return {
    status: 'too-high',
    message:
      'Your debt ratios exceed recommended limits. Focus on reducing debt or increasing income.',
  };
}

// ============================================================================
// Main Calculation Functions
// ============================================================================

/**
 * Calculate home affordability based on income, debts, and down payment
 *
 * @param inputs - Home affordability input parameters
 * @returns Complete affordability analysis
 *
 * @example
 * ```typescript
 * const result = calculateHomeAffordability({
 *   annualIncome: 100000,
 *   monthlyDebts: 500,
 *   downPayment: 60000,
 *   interestRate: 0.065,
 *   loanTermYears: 30,
 *   loanType: 'conventional'
 * });
 *
 * console.log(result.maxHomePrice); // Maximum affordable home price
 * console.log(result.monthlyBreakdown); // Payment breakdown
 * ```
 */
export function calculateHomeAffordability(
  inputs: HomeAffordabilityInputs
): HomeAffordabilityResult {
  const {
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTermYears = 30,
    loanType = 'conventional',
    propertyTaxRate = 0.0125, // 1.25% default
    homeInsuranceRate = 0.0035, // 0.35% default ($35 per $100 per year)
    monthlyHOA = 0,
    creditScore = 700,
    includePMI = true,
    customFrontEndDTI,
    customBackEndDTI,
    _skipNestedCalculations = false,
  } = inputs;

  const monthlyIncome = annualIncome / 12;

  // Get DTI limits (use custom if provided)
  const frontEndLimit = customFrontEndDTI ?? DTI_LIMITS[loanType].frontEnd;
  const backEndLimit = customBackEndDTI ?? DTI_LIMITS[loanType].backEnd;

  // Calculate max housing payment based on front-end DTI
  const maxHousingFromFrontEnd = monthlyIncome * frontEndLimit;

  // Calculate max total payment based on back-end DTI
  const maxTotalPayment = monthlyIncome * backEndLimit;
  const maxHousingFromBackEnd = maxTotalPayment - monthlyDebts;

  // Use the more restrictive limit
  const maxHousingPayment = Math.min(
    maxHousingFromFrontEnd,
    maxHousingFromBackEnd
  );

  // Iteratively solve for max home price (accounting for PMI, taxes, insurance)
  let maxHomePrice = 0;
  let iteration = 0;
  const maxIterations = 50;

  // Start with an estimate based on pure P&I
  let estimatedHomePrice = downPayment / 0.2; // Assume 20% down as starting point

  while (iteration < maxIterations) {
    iteration++;

    const loanAmount = Math.max(0, estimatedHomePrice - downPayment);
    const downPaymentPercent =
      estimatedHomePrice > 0 ? downPayment / estimatedHomePrice : 0;

    // Calculate P&I
    const monthlyPI = calculateMonthlyMortgagePayment(
      loanAmount,
      interestRate,
      loanTermYears
    );

    // Calculate monthly property tax
    const monthlyPropertyTax = (estimatedHomePrice * propertyTaxRate) / 12;

    // Calculate monthly insurance
    const monthlyInsurance = (estimatedHomePrice * homeInsuranceRate) / 12;

    // Calculate PMI if applicable
    let monthlyPMI = 0;
    if (includePMI && downPaymentPercent < 0.2 && loanType === 'conventional') {
      monthlyPMI = calculatePMI(loanAmount, estimatedHomePrice, creditScore);
    } else if (loanType === 'fha') {
      const fhaMIP = calculateFHAMIP(
        loanAmount,
        estimatedHomePrice,
        loanTermYears
      );
      monthlyPMI = fhaMIP.monthly;
    }

    // Total housing payment
    const totalHousing =
      monthlyPI +
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyPMI +
      monthlyHOA;

    // Check if within budget
    if (Math.abs(totalHousing - maxHousingPayment) < 1) {
      maxHomePrice = estimatedHomePrice;
      break;
    }

    // Adjust estimate
    if (totalHousing > maxHousingPayment) {
      estimatedHomePrice *= maxHousingPayment / totalHousing;
    } else {
      // Increase slightly
      estimatedHomePrice *= 1 + (maxHousingPayment - totalHousing) / totalHousing / 2;
    }

    maxHomePrice = estimatedHomePrice;
  }

  // Round to nearest $1000
  maxHomePrice = Math.floor(maxHomePrice / 1000) * 1000;

  // Ensure minimum down payment requirements are met
  const minDownPaymentRequired = maxHomePrice * MIN_DOWN_PAYMENT[loanType];
  if (downPayment < minDownPaymentRequired) {
    // Adjust home price to what down payment can cover
    maxHomePrice = downPayment / MIN_DOWN_PAYMENT[loanType];
    maxHomePrice = Math.floor(maxHomePrice / 1000) * 1000;
  }

  // Calculate final values with determined home price
  const loanAmount = Math.max(0, maxHomePrice - downPayment);
  const downPaymentPercent =
    maxHomePrice > 0 ? downPayment / maxHomePrice : 0;

  // Monthly breakdown
  const monthlyPI = calculateMonthlyMortgagePayment(
    loanAmount,
    interestRate,
    loanTermYears
  );
  const monthlyPropertyTax = (maxHomePrice * propertyTaxRate) / 12;
  const monthlyInsurance = (maxHomePrice * homeInsuranceRate) / 12;

  let monthlyPMI = 0;
  let annualPMI = 0;
  const pmiRequired = downPaymentPercent < 0.2;

  if (pmiRequired && loanType === 'conventional' && includePMI) {
    monthlyPMI = calculatePMI(loanAmount, maxHomePrice, creditScore);
    annualPMI = monthlyPMI * 12;
  } else if (loanType === 'fha') {
    const fhaMIP = calculateFHAMIP(loanAmount, maxHomePrice, loanTermYears);
    monthlyPMI = fhaMIP.monthly;
    annualPMI = monthlyPMI * 12;
  }

  const totalHousing =
    monthlyPI +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI +
    monthlyHOA;
  const totalMonthly = totalHousing + monthlyDebts;

  const monthlyBreakdown: MonthlyPaymentBreakdown = {
    principalAndInterest: Math.round(monthlyPI * 100) / 100,
    propertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    homeInsurance: Math.round(monthlyInsurance * 100) / 100,
    pmi: Math.round(monthlyPMI * 100) / 100,
    hoa: monthlyHOA,
    totalHousing: Math.round(totalHousing * 100) / 100,
    totalMonthly: Math.round(totalMonthly * 100) / 100,
  };

  // DTI Analysis
  const frontEndRatio = totalHousing / monthlyIncome;
  const backEndRatio = totalMonthly / monthlyIncome;
  const frontEndOK = frontEndRatio <= frontEndLimit;
  const backEndOK = backEndRatio <= backEndLimit;

  const { status, message } = getDTIStatus(
    frontEndRatio,
    backEndRatio,
    frontEndLimit,
    backEndLimit
  );

  const dtiAnalysis: DTIAnalysis = {
    frontEndRatio: Math.round(frontEndRatio * 1000) / 10,
    backEndRatio: Math.round(backEndRatio * 1000) / 10,
    frontEndLimit: frontEndLimit * 100,
    backEndLimit: backEndLimit * 100,
    frontEndOK,
    backEndOK,
    status,
    message,
  };

  // Calculate affordability zones (skip if in nested call to prevent recursion)
  const affordabilityZones = _skipNestedCalculations
    ? []
    : calculateAffordabilityZones(
        monthlyIncome,
        monthlyDebts,
        downPayment,
        interestRate,
        loanTermYears,
        propertyTaxRate,
        homeInsuranceRate,
        monthlyHOA,
        creditScore,
        loanType
      );

  // Calculate loan comparisons (skip if in nested call to prevent recursion)
  const loanComparisons = _skipNestedCalculations
    ? []
    : compareLoanTypes(
        annualIncome,
        monthlyDebts,
        downPayment,
        interestRate,
        loanTermYears,
        propertyTaxRate,
        homeInsuranceRate,
        monthlyHOA,
        creditScore
      );

  // Stress test scenarios (skip if in nested call to prevent recursion)
  const stressTestScenarios = _skipNestedCalculations
    ? []
    : calculateStressTest(
        annualIncome,
        monthlyDebts,
        downPayment,
        interestRate,
        loanTermYears,
        propertyTaxRate,
        homeInsuranceRate,
        monthlyHOA,
        loanType
      );

  // Closing costs estimate (2-5% of home price)
  const estimatedClosingCosts = maxHomePrice * 0.03; // 3% estimate
  const totalCashNeeded = downPayment + estimatedClosingCosts;

  // Effective rate (accounting for PMI)
  const effectiveRate =
    interestRate + (pmiRequired ? annualPMI / loanAmount : 0);

  // Generate recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];

  if (downPaymentPercent < 0.2) {
    recommendations.push(
      `Consider saving for a 20% down payment (${formatCurrency(maxHomePrice * 0.2)}) to avoid PMI and get better rates.`
    );
  }

  if (backEndRatio > 0.36) {
    warnings.push(
      'Your debt-to-income ratio is high. This may limit your loan options or result in higher rates.'
    );
  }

  if (monthlyDebts > monthlyIncome * 0.15) {
    recommendations.push(
      'Paying down existing debt could significantly increase your home buying power.'
    );
  }

  if (loanType === 'conventional' && downPaymentPercent < 0.03) {
    warnings.push(
      'Conventional loans require at least 3% down payment. Consider FHA or VA loans for lower down payment options.'
    );
  }

  if (interestRate > 0.07) {
    recommendations.push(
      'Interest rates are relatively high. Consider waiting for rates to drop or buying down your rate with points.'
    );
  }

  return {
    maxHomePrice,
    loanAmount,
    downPayment,
    downPaymentPercent: Math.round(downPaymentPercent * 1000) / 10,
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    monthlyBreakdown,
    dtiAnalysis,
    loanType,
    loanTermYears,
    interestRate,
    pmiRequired,
    annualPMI: Math.round(annualPMI * 100) / 100,
    affordabilityZones,
    loanComparisons,
    stressTestScenarios,
    estimatedClosingCosts: Math.round(estimatedClosingCosts),
    totalCashNeeded: Math.round(totalCashNeeded),
    effectiveRate: Math.round(effectiveRate * 10000) / 10000,
    recommendations,
    warnings,
  };
}

/**
 * Calculate affordability zones (comfortable to risky)
 */
function calculateAffordabilityZones(
  monthlyIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: LoanTermYears,
  propertyTaxRate: number,
  homeInsuranceRate: number,
  monthlyHOA: number,
  creditScore: number,
  loanType: LoanType
): AffordabilityZone[] {
  const zones: AffordabilityZone[] = [];

  // Define DTI thresholds for each zone
  const zoneThresholds: Array<{
    level: ComfortLevel;
    maxBackEndDTI: number;
    description: string;
  }> = [
    {
      level: 'comfortable',
      maxBackEndDTI: 0.28,
      description:
        'Plenty of breathing room for savings and unexpected expenses.',
    },
    {
      level: 'moderate',
      maxBackEndDTI: 0.33,
      description:
        'Balanced budget with room for some discretionary spending.',
    },
    {
      level: 'stretch',
      maxBackEndDTI: 0.4,
      description: 'Tight budget - may need to cut back on other expenses.',
    },
    {
      level: 'risky',
      maxBackEndDTI: 0.45,
      description:
        'Very tight - little room for emergencies or lifestyle expenses.',
    },
  ];

  let previousMaxPrice = 0;

  for (const threshold of zoneThresholds) {
    // Calculate max housing payment for this DTI threshold
    const maxTotalPayment = monthlyIncome * threshold.maxBackEndDTI;
    const maxHousingPayment = maxTotalPayment - monthlyDebts;

    if (maxHousingPayment <= 0) continue;

    // Iteratively solve for home price
    let homePrice = downPayment / 0.2;
    for (let i = 0; i < 20; i++) {
      const loanAmount = Math.max(0, homePrice - downPayment);
      const monthlyPI = calculateMonthlyMortgagePayment(
        loanAmount,
        interestRate,
        loanTermYears
      );
      const monthlyTax = (homePrice * propertyTaxRate) / 12;
      const monthlyIns = (homePrice * homeInsuranceRate) / 12;
      const downPaymentPercent = homePrice > 0 ? downPayment / homePrice : 0;
      const monthlyPMI =
        downPaymentPercent < 0.2 && loanType === 'conventional'
          ? calculatePMI(loanAmount, homePrice, creditScore)
          : 0;

      const totalHousing =
        monthlyPI + monthlyTax + monthlyIns + monthlyPMI + monthlyHOA;

      if (Math.abs(totalHousing - maxHousingPayment) < 10) break;

      homePrice *= maxHousingPayment / totalHousing;
    }

    homePrice = Math.floor(homePrice / 1000) * 1000;

    // Calculate monthly payment at this price
    const loanAmount = Math.max(0, homePrice - downPayment);
    const monthlyPI = calculateMonthlyMortgagePayment(
      loanAmount,
      interestRate,
      loanTermYears
    );
    const monthlyTax = (homePrice * propertyTaxRate) / 12;
    const monthlyIns = (homePrice * homeInsuranceRate) / 12;
    const downPaymentPercent = homePrice > 0 ? downPayment / homePrice : 0;
    const monthlyPMI =
      downPaymentPercent < 0.2 && loanType === 'conventional'
        ? calculatePMI(loanAmount, homePrice, creditScore)
        : 0;
    const totalHousing =
      monthlyPI + monthlyTax + monthlyIns + monthlyPMI + monthlyHOA;
    const totalMonthly = totalHousing + monthlyDebts;
    const actualBackEndDTI = totalMonthly / monthlyIncome;

    zones.push({
      level: threshold.level,
      minPrice: previousMaxPrice,
      maxPrice: homePrice,
      monthlyPayment: Math.round(totalHousing),
      backEndDTI: Math.round(actualBackEndDTI * 1000) / 10,
      description: threshold.description,
      color: ZONE_COLORS[threshold.level],
    });

    previousMaxPrice = homePrice;
  }

  return zones;
}

/**
 * Compare different loan types
 */
function compareLoanTypes(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: LoanTermYears,
  propertyTaxRate: number,
  homeInsuranceRate: number,
  monthlyHOA: number,
  creditScore: number
): LoanComparison[] {
  const loanTypes: LoanType[] = ['conventional', 'fha', 'va'];
  const comparisons: LoanComparison[] = [];

  for (const lt of loanTypes) {
    const result = calculateHomeAffordability({
      annualIncome,
      monthlyDebts,
      downPayment,
      interestRate,
      loanTermYears,
      loanType: lt,
      propertyTaxRate,
      homeInsuranceRate,
      monthlyHOA,
      creditScore,
      _skipNestedCalculations: true, // Prevent infinite recursion
    });

    const benefits: string[] = [];
    const drawbacks: string[] = [];

    switch (lt) {
      case 'conventional':
        benefits.push('No upfront mortgage insurance fee');
        benefits.push('PMI cancellable at 80% LTV');
        benefits.push('Lower mortgage insurance costs with good credit');
        drawbacks.push('Requires higher credit score (620+)');
        drawbacks.push('Stricter DTI requirements');
        break;
      case 'fha':
        benefits.push('Lower credit score accepted (580+)');
        benefits.push('Only 3.5% down payment required');
        benefits.push('More flexible DTI limits');
        drawbacks.push('Mortgage insurance for life of loan');
        drawbacks.push('1.75% upfront MIP fee');
        drawbacks.push('Property must meet FHA standards');
        break;
      case 'va':
        benefits.push('No down payment required');
        benefits.push('No monthly mortgage insurance');
        benefits.push('Competitive interest rates');
        benefits.push('No DTI limit (residual income based)');
        drawbacks.push('Must be veteran or active military');
        drawbacks.push('VA funding fee required (can be financed)');
        drawbacks.push('Property must meet VA requirements');
        break;
    }

    comparisons.push({
      loanType: lt,
      maxHomePrice: result.maxHomePrice,
      downPaymentRequired: result.downPayment,
      downPaymentPercent: result.downPaymentPercent,
      monthlyPayment: result.monthlyBreakdown.totalHousing,
      qualifies: result.dtiAnalysis.frontEndOK && result.dtiAnalysis.backEndOK,
      benefits,
      drawbacks,
    });
  }

  return comparisons;
}

/**
 * Calculate stress test scenarios for rate increases
 */
function calculateStressTest(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  currentRate: number,
  loanTermYears: LoanTermYears,
  propertyTaxRate: number,
  homeInsuranceRate: number,
  monthlyHOA: number,
  loanType: LoanType
): StressTestScenario[] {
  const rateIncreases = [0, 0.005, 0.01, 0.015, 0.02]; // 0%, 0.5%, 1%, 1.5%, 2%
  const scenarios: StressTestScenario[] = [];

  // Get baseline max home price at current rate
  const baseline = calculateHomeAffordability({
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate: currentRate,
    loanTermYears,
    loanType,
    propertyTaxRate,
    homeInsuranceRate,
    monthlyHOA,
    _skipNestedCalculations: true, // Prevent infinite recursion
  });

  const baselineMaxPrice = baseline.maxHomePrice;

  for (const increase of rateIncreases) {
    const testRate = currentRate + increase;

    const result = calculateHomeAffordability({
      annualIncome,
      monthlyDebts,
      downPayment,
      interestRate: testRate,
      loanTermYears,
      loanType,
      propertyTaxRate,
      homeInsuranceRate,
      monthlyHOA,
      _skipNestedCalculations: true, // Prevent infinite recursion
    });

    scenarios.push({
      rate: testRate,
      rateIncrease: increase,
      maxHomePrice: result.maxHomePrice,
      monthlyPayment: result.monthlyBreakdown.totalHousing,
      stillAffordable: result.maxHomePrice >= baselineMaxPrice * 0.9, // 90% of baseline
    });
  }

  return scenarios;
}

/**
 * Quick affordability estimate based on income only
 * Uses 28% front-end DTI rule
 *
 * @param annualIncome - Annual gross income
 * @param interestRate - Annual interest rate as decimal
 * @param downPaymentPercent - Down payment as percentage (default 20%)
 * @returns Estimated maximum home price
 *
 * @example
 * ```typescript
 * const maxPrice = quickAffordabilityEstimate(100000, 0.065, 0.2);
 * console.log(maxPrice); // Estimated max home price
 * ```
 */
export function quickAffordabilityEstimate(
  annualIncome: number,
  interestRate: number,
  downPaymentPercent: number = 0.2
): number {
  const monthlyIncome = annualIncome / 12;
  const maxHousingPayment = monthlyIncome * 0.28; // 28% rule

  // Assume 1.5% of home value for taxes + insurance
  const taxInsuranceRate = 0.015 / 12;

  // Rough estimate: monthly payment = P&I + 1.5%/12 of home value
  // Solve for home price where payment = maxHousingPayment

  // Start with P&I only estimate
  const piOnlyLoan = calculateMaxLoanFromPayment(
    maxHousingPayment * 0.85, // Assume 85% goes to P&I
    interestRate,
    30
  );

  const homePrice = piOnlyLoan / (1 - downPaymentPercent);

  return Math.floor(homePrice / 1000) * 1000;
}

/**
 * Calculate how much home price changes for each $100/month in debt
 * Useful for showing impact of paying off debt
 *
 * @param annualIncome - Annual gross income
 * @param interestRate - Annual interest rate
 * @returns Home price increase per $100 monthly debt reduction
 */
export function calculateDebtImpact(
  annualIncome: number,
  interestRate: number
): number {
  const withDebt = calculateHomeAffordability({
    annualIncome,
    monthlyDebts: 500,
    downPayment: 50000,
    interestRate,
  });

  const withoutDebt = calculateHomeAffordability({
    annualIncome,
    monthlyDebts: 400,
    downPayment: 50000,
    interestRate,
  });

  return withoutDebt.maxHomePrice - withDebt.maxHomePrice;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
