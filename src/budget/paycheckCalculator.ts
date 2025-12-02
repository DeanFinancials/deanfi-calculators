/**
 * Paycheck Calculator
 * 
 * Calculate take-home pay after federal, state, and FICA taxes.
 * Supports salary and hourly pay types, multiple pay frequencies,
 * pre-tax and post-tax deductions, and all 50 US states.
 * 
 * @module budget/paycheckCalculator
 * @see https://www.irs.gov/individuals/tax-withholding-estimator
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Pay type - salary or hourly
 */
export type PayType = 'salary' | 'hourly';

/**
 * Pay frequency options
 */
export type PayFrequency = 
  | 'weekly'        // 52 paychecks/year
  | 'bi-weekly'     // 26 paychecks/year
  | 'semi-monthly'  // 24 paychecks/year
  | 'monthly';      // 12 paychecks/year

/**
 * Filing status for federal taxes
 */
export type FilingStatus = 
  | 'single'
  | 'married_jointly'
  | 'married_separately'
  | 'head_of_household';

/**
 * US States (including DC)
 */
export type USState = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL'
  | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME'
  | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH'
  | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI'
  | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

/**
 * Pre-tax deduction types
 */
export interface PreTaxDeductions {
  /** Traditional 401(k) contribution per paycheck */
  traditional401k?: number;
  /** 403(b) contribution per paycheck */
  traditional403b?: number;
  /** Health insurance premium per paycheck */
  healthInsurance?: number;
  /** Dental insurance premium per paycheck */
  dentalInsurance?: number;
  /** Vision insurance premium per paycheck */
  visionInsurance?: number;
  /** HSA contribution per paycheck */
  hsa?: number;
  /** FSA contribution per paycheck */
  fsa?: number;
  /** Dependent care FSA per paycheck */
  dependentCareFsa?: number;
  /** Commuter benefits per paycheck */
  commuterBenefits?: number;
  /** Other pre-tax deductions per paycheck */
  other?: number;
}

/**
 * Post-tax deduction types
 */
export interface PostTaxDeductions {
  /** Roth 401(k) contribution per paycheck */
  roth401k?: number;
  /** Roth 403(b) contribution per paycheck */
  roth403b?: number;
  /** Life insurance premium per paycheck */
  lifeInsurance?: number;
  /** Disability insurance per paycheck */
  disabilityInsurance?: number;
  /** Union dues per paycheck */
  unionDues?: number;
  /** Charitable contributions per paycheck */
  charitableContributions?: number;
  /** Wage garnishments per paycheck */
  garnishments?: number;
  /** Other post-tax deductions per paycheck */
  other?: number;
}

/**
 * Input for paycheck calculation
 */
export interface PaycheckInputs {
  /** Pay type: salary or hourly */
  payType: PayType;
  /** Annual salary (if salary type) */
  annualSalary?: number;
  /** Hourly rate (if hourly type) */
  hourlyRate?: number;
  /** Hours per week (if hourly type, default 40) */
  hoursPerWeek?: number;
  /** Pay frequency */
  payFrequency: PayFrequency;
  /** Federal filing status */
  filingStatus: FilingStatus;
  /** State of residence */
  state: USState;
  /** Number of federal allowances/dependents (for W-4) */
  federalAllowances?: number;
  /** Additional federal withholding per paycheck */
  additionalFederalWithholding?: number;
  /** Pre-tax deductions */
  preTaxDeductions?: PreTaxDeductions;
  /** Post-tax deductions */
  postTaxDeductions?: PostTaxDeductions;
  /** Year-to-date gross income (for Social Security cap) */
  ytdGrossIncome?: number;
  /** Exempt from federal tax (rare) */
  federalExempt?: boolean;
  /** Exempt from state tax */
  stateExempt?: boolean;
  /** Exempt from FICA (rare, religious exemption) */
  ficaExempt?: boolean;
}

/**
 * Tax breakdown for a single tax type
 */
export interface TaxBreakdown {
  /** Tax name */
  name: string;
  /** Tax amount per paycheck */
  amount: number;
  /** Tax rate (effective rate on gross) */
  rate: number;
  /** Annual amount */
  annualAmount: number;
}

/**
 * Deduction breakdown
 */
export interface DeductionBreakdown {
  /** Deduction name */
  name: string;
  /** Amount per paycheck */
  amount: number;
  /** Annual amount */
  annualAmount: number;
  /** Whether it's pre-tax */
  preTax: boolean;
}

/**
 * Paycheck calculation result
 */
export interface PaycheckResult {
  // Pay period amounts
  /** Gross pay per paycheck */
  grossPay: number;
  /** Net (take-home) pay per paycheck */
  netPay: number;
  /** Total taxes per paycheck */
  totalTaxes: number;
  /** Total deductions per paycheck */
  totalDeductions: number;
  /** Total pre-tax deductions per paycheck */
  totalPreTaxDeductions: number;
  /** Total post-tax deductions per paycheck */
  totalPostTaxDeductions: number;
  
  // Annual amounts
  /** Gross annual income */
  annualGross: number;
  /** Net annual income */
  annualNet: number;
  /** Total annual taxes */
  annualTaxes: number;
  /** Total annual deductions */
  annualDeductions: number;
  
  // Tax breakdown
  /** Federal income tax */
  federalTax: TaxBreakdown;
  /** State income tax */
  stateTax: TaxBreakdown;
  /** Local income tax (if applicable) */
  localTax: TaxBreakdown;
  /** Social Security tax */
  socialSecurityTax: TaxBreakdown;
  /** Medicare tax */
  medicareTax: TaxBreakdown;
  /** Additional Medicare tax (if applicable) */
  additionalMedicareTax: TaxBreakdown;
  /** Array of all tax breakdowns */
  taxBreakdown: TaxBreakdown[];
  
  // Deduction breakdown
  /** Array of all deductions */
  deductionBreakdown: DeductionBreakdown[];
  
  // Rates
  /** Effective tax rate (total taxes / gross) */
  effectiveTaxRate: number;
  /** Marginal tax rate (federal) */
  marginalFederalRate: number;
  /** Marginal tax rate (state) */
  marginalStateRate: number;
  
  // Conversion helpers
  /** Equivalent hourly rate */
  hourlyEquivalent: number;
  /** Pay periods per year */
  payPeriodsPerYear: number;
  
  // Percentages for visualization
  /** Percentage of gross going to taxes */
  taxPercentage: number;
  /** Percentage of gross going to deductions */
  deductionPercentage: number;
  /** Percentage of gross as take-home */
  takeHomePercentage: number;
}

/**
 * Comparison of two paycheck scenarios
 */
export interface PaycheckComparison {
  scenario1: PaycheckResult;
  scenario2: PaycheckResult;
  /** Difference in net pay per paycheck */
  netPayDifference: number;
  /** Difference in annual net */
  annualNetDifference: number;
  /** Difference in total taxes */
  taxDifference: number;
  /** Percentage increase/decrease in net pay */
  netPayChangePercent: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Number of pay periods per year for each frequency
 */
export const PAY_PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  'weekly': 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  'monthly': 12,
};

/**
 * 2024 Federal Income Tax Brackets (for taxes filed in 2025)
 */
export const FEDERAL_TAX_BRACKETS_2024: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  'single': [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  'married_jointly': [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  'married_separately': [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  'head_of_household': [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

/**
 * 2024 Standard deductions by filing status
 */
export const STANDARD_DEDUCTIONS_2024: Record<FilingStatus, number> = {
  'single': 14600,
  'married_jointly': 29200,
  'married_separately': 14600,
  'head_of_household': 21900,
};

/**
 * 2024 FICA tax rates and limits
 */
export const FICA_2024 = {
  /** Social Security rate (employee portion) */
  socialSecurityRate: 0.062,
  /** Social Security wage base limit */
  socialSecurityLimit: 168600,
  /** Medicare rate (employee portion) */
  medicareRate: 0.0145,
  /** Additional Medicare rate (0.9% on wages above threshold) */
  additionalMedicareRate: 0.009,
  /** Additional Medicare threshold - Single/HoH */
  additionalMedicareThresholdSingle: 200000,
  /** Additional Medicare threshold - Married Jointly */
  additionalMedicareThresholdJoint: 250000,
  /** Additional Medicare threshold - Married Separately */
  additionalMedicareThresholdSeparate: 125000,
};

/**
 * 2025 Federal Income Tax Brackets (for taxes filed in 2026)
 */
export const FEDERAL_TAX_BRACKETS_2025: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  'single': [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  'married_jointly': [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  'married_separately': [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  'head_of_household': [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
};

/**
 * 2025 Standard deductions by filing status
 */
export const STANDARD_DEDUCTIONS_2025: Record<FilingStatus, number> = {
  'single': 15000,
  'married_jointly': 30000,
  'married_separately': 15000,
  'head_of_household': 22500,
};

/**
 * 2025 FICA tax rates and limits
 */
export const FICA_2025 = {
  socialSecurityRate: 0.062,
  socialSecurityLimit: 176100,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThresholdSingle: 200000,
  additionalMedicareThresholdJoint: 250000,
  additionalMedicareThresholdSeparate: 125000,
};

/**
 * State income tax rates (simplified - flat or top marginal rates)
 * States with no income tax: AK, FL, NV, NH (dividends only), SD, TN, TX, WA, WY
 * This is a simplified model; actual state taxes can be much more complex
 */
export const STATE_TAX_INFO: Record<USState, { 
  hasIncomeTax: boolean; 
  flatRate?: number; 
  topRate?: number;
  brackets?: { min: number; max: number; rate: number }[];
}> = {
  'AL': { hasIncomeTax: true, topRate: 0.05 },
  'AK': { hasIncomeTax: false },
  'AZ': { hasIncomeTax: true, flatRate: 0.025 },
  'AR': { hasIncomeTax: true, topRate: 0.039 },
  'CA': { hasIncomeTax: true, topRate: 0.133 },
  'CO': { hasIncomeTax: true, flatRate: 0.044 },
  'CT': { hasIncomeTax: true, topRate: 0.0699 },
  'DE': { hasIncomeTax: true, topRate: 0.066 },
  'DC': { hasIncomeTax: true, topRate: 0.1075 },
  'FL': { hasIncomeTax: false },
  'GA': { hasIncomeTax: true, flatRate: 0.0549 },
  'HI': { hasIncomeTax: true, topRate: 0.11 },
  'ID': { hasIncomeTax: true, flatRate: 0.058 },
  'IL': { hasIncomeTax: true, flatRate: 0.0495 },
  'IN': { hasIncomeTax: true, flatRate: 0.0305 },
  'IA': { hasIncomeTax: true, topRate: 0.057 },
  'KS': { hasIncomeTax: true, topRate: 0.057 },
  'KY': { hasIncomeTax: true, flatRate: 0.04 },
  'LA': { hasIncomeTax: true, topRate: 0.0425 },
  'ME': { hasIncomeTax: true, topRate: 0.0715 },
  'MD': { hasIncomeTax: true, topRate: 0.0575 },
  'MA': { hasIncomeTax: true, flatRate: 0.09 },
  'MI': { hasIncomeTax: true, flatRate: 0.0425 },
  'MN': { hasIncomeTax: true, topRate: 0.0985 },
  'MS': { hasIncomeTax: true, flatRate: 0.047 },
  'MO': { hasIncomeTax: true, topRate: 0.048 },
  'MT': { hasIncomeTax: true, topRate: 0.059 },
  'NE': { hasIncomeTax: true, topRate: 0.0584 },
  'NV': { hasIncomeTax: false },
  'NH': { hasIncomeTax: false }, // No tax on wages (only dividends/interest, phasing out)
  'NJ': { hasIncomeTax: true, topRate: 0.1075 },
  'NM': { hasIncomeTax: true, topRate: 0.059 },
  'NY': { hasIncomeTax: true, topRate: 0.109 },
  'NC': { hasIncomeTax: true, flatRate: 0.0475 },
  'ND': { hasIncomeTax: true, topRate: 0.025 },
  'OH': { hasIncomeTax: true, topRate: 0.035 },
  'OK': { hasIncomeTax: true, topRate: 0.0475 },
  'OR': { hasIncomeTax: true, topRate: 0.099 },
  'PA': { hasIncomeTax: true, flatRate: 0.0307 },
  'RI': { hasIncomeTax: true, topRate: 0.0599 },
  'SC': { hasIncomeTax: true, topRate: 0.064 },
  'SD': { hasIncomeTax: false },
  'TN': { hasIncomeTax: false }, // No tax on wages
  'TX': { hasIncomeTax: false },
  'UT': { hasIncomeTax: true, flatRate: 0.0465 },
  'VT': { hasIncomeTax: true, topRate: 0.0875 },
  'VA': { hasIncomeTax: true, topRate: 0.0575 },
  'WA': { hasIncomeTax: false },
  'WV': { hasIncomeTax: true, topRate: 0.0512 },
  'WI': { hasIncomeTax: true, topRate: 0.0765 },
  'WY': { hasIncomeTax: false },
};

/**
 * States with no income tax
 */
export const NO_INCOME_TAX_STATES: USState[] = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

/**
 * State full names
 */
export const STATE_NAMES: Record<USState, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii',
  'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
  'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
  'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska',
  'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
  'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
  'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
  'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate annual gross income from inputs
 */
export function calculateAnnualGross(inputs: PaycheckInputs): number {
  if (inputs.payType === 'salary') {
    return inputs.annualSalary || 0;
  } else {
    const hourlyRate = inputs.hourlyRate || 0;
    const hoursPerWeek = inputs.hoursPerWeek || 40;
    return hourlyRate * hoursPerWeek * 52;
  }
}

/**
 * Calculate federal income tax using progressive brackets
 */
export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
  taxYear: 2024 | 2025 = 2025
): { tax: number; marginalRate: number } {
  const brackets = taxYear === 2024 
    ? FEDERAL_TAX_BRACKETS_2024[filingStatus]
    : FEDERAL_TAX_BRACKETS_2025[filingStatus];
  
  let tax = 0;
  let marginalRate = 0;
  
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) {
      break;
    }
    
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
      marginalRate = bracket.rate;
    }
  }
  
  return { tax: Math.max(0, tax), marginalRate };
}

/**
 * Calculate state income tax (simplified model)
 */
export function calculateStateTax(
  taxableIncome: number,
  state: USState
): { tax: number; marginalRate: number } {
  const stateInfo = STATE_TAX_INFO[state];
  
  if (!stateInfo.hasIncomeTax) {
    return { tax: 0, marginalRate: 0 };
  }
  
  // Use flat rate if available, otherwise use top marginal rate as approximation
  const rate = stateInfo.flatRate || stateInfo.topRate || 0;
  const tax = taxableIncome * rate;
  
  return { tax: Math.max(0, tax), marginalRate: rate };
}

/**
 * Calculate Social Security tax
 */
export function calculateSocialSecurityTax(
  annualGross: number,
  ytdGrossIncome: number = 0,
  taxYear: 2024 | 2025 = 2025
): number {
  const fica = taxYear === 2024 ? FICA_2024 : FICA_2025;
  const limit = fica.socialSecurityLimit;
  
  // Already earned up to the limit this year?
  if (ytdGrossIncome >= limit) {
    return 0;
  }
  
  // Calculate taxable amount up to the limit
  const taxableAmount = Math.min(annualGross, limit - ytdGrossIncome);
  return taxableAmount * fica.socialSecurityRate;
}

/**
 * Calculate Medicare tax (including additional Medicare tax if applicable)
 */
export function calculateMedicareTax(
  annualGross: number,
  filingStatus: FilingStatus,
  taxYear: 2024 | 2025 = 2025
): { baseTax: number; additionalTax: number } {
  const fica = taxYear === 2024 ? FICA_2024 : FICA_2025;
  
  // Base Medicare tax on all wages
  const baseTax = annualGross * fica.medicareRate;
  
  // Additional Medicare tax threshold based on filing status
  let threshold: number;
  switch (filingStatus) {
    case 'married_jointly':
      threshold = fica.additionalMedicareThresholdJoint;
      break;
    case 'married_separately':
      threshold = fica.additionalMedicareThresholdSeparate;
      break;
    default:
      threshold = fica.additionalMedicareThresholdSingle;
  }
  
  // Additional Medicare tax on wages above threshold
  const additionalTax = annualGross > threshold
    ? (annualGross - threshold) * fica.additionalMedicareRate
    : 0;
  
  return { baseTax, additionalTax };
}

/**
 * Sum all pre-tax deductions per paycheck
 */
export function sumPreTaxDeductions(deductions?: PreTaxDeductions): number {
  if (!deductions) return 0;
  
  return (
    (deductions.traditional401k || 0) +
    (deductions.traditional403b || 0) +
    (deductions.healthInsurance || 0) +
    (deductions.dentalInsurance || 0) +
    (deductions.visionInsurance || 0) +
    (deductions.hsa || 0) +
    (deductions.fsa || 0) +
    (deductions.dependentCareFsa || 0) +
    (deductions.commuterBenefits || 0) +
    (deductions.other || 0)
  );
}

/**
 * Sum all post-tax deductions per paycheck
 */
export function sumPostTaxDeductions(deductions?: PostTaxDeductions): number {
  if (!deductions) return 0;
  
  return (
    (deductions.roth401k || 0) +
    (deductions.roth403b || 0) +
    (deductions.lifeInsurance || 0) +
    (deductions.disabilityInsurance || 0) +
    (deductions.unionDues || 0) +
    (deductions.charitableContributions || 0) +
    (deductions.garnishments || 0) +
    (deductions.other || 0)
  );
}

/**
 * Build deduction breakdown array
 */
function buildDeductionBreakdown(
  preTax?: PreTaxDeductions,
  postTax?: PostTaxDeductions,
  payPeriods: number = 1
): DeductionBreakdown[] {
  const breakdown: DeductionBreakdown[] = [];
  
  if (preTax) {
    if (preTax.traditional401k) breakdown.push({ name: '401(k)', amount: preTax.traditional401k, annualAmount: preTax.traditional401k * payPeriods, preTax: true });
    if (preTax.traditional403b) breakdown.push({ name: '403(b)', amount: preTax.traditional403b, annualAmount: preTax.traditional403b * payPeriods, preTax: true });
    if (preTax.healthInsurance) breakdown.push({ name: 'Health Insurance', amount: preTax.healthInsurance, annualAmount: preTax.healthInsurance * payPeriods, preTax: true });
    if (preTax.dentalInsurance) breakdown.push({ name: 'Dental Insurance', amount: preTax.dentalInsurance, annualAmount: preTax.dentalInsurance * payPeriods, preTax: true });
    if (preTax.visionInsurance) breakdown.push({ name: 'Vision Insurance', amount: preTax.visionInsurance, annualAmount: preTax.visionInsurance * payPeriods, preTax: true });
    if (preTax.hsa) breakdown.push({ name: 'HSA', amount: preTax.hsa, annualAmount: preTax.hsa * payPeriods, preTax: true });
    if (preTax.fsa) breakdown.push({ name: 'FSA', amount: preTax.fsa, annualAmount: preTax.fsa * payPeriods, preTax: true });
    if (preTax.dependentCareFsa) breakdown.push({ name: 'Dependent Care FSA', amount: preTax.dependentCareFsa, annualAmount: preTax.dependentCareFsa * payPeriods, preTax: true });
    if (preTax.commuterBenefits) breakdown.push({ name: 'Commuter Benefits', amount: preTax.commuterBenefits, annualAmount: preTax.commuterBenefits * payPeriods, preTax: true });
    if (preTax.other) breakdown.push({ name: 'Other Pre-Tax', amount: preTax.other, annualAmount: preTax.other * payPeriods, preTax: true });
  }
  
  if (postTax) {
    if (postTax.roth401k) breakdown.push({ name: 'Roth 401(k)', amount: postTax.roth401k, annualAmount: postTax.roth401k * payPeriods, preTax: false });
    if (postTax.roth403b) breakdown.push({ name: 'Roth 403(b)', amount: postTax.roth403b, annualAmount: postTax.roth403b * payPeriods, preTax: false });
    if (postTax.lifeInsurance) breakdown.push({ name: 'Life Insurance', amount: postTax.lifeInsurance, annualAmount: postTax.lifeInsurance * payPeriods, preTax: false });
    if (postTax.disabilityInsurance) breakdown.push({ name: 'Disability Insurance', amount: postTax.disabilityInsurance, annualAmount: postTax.disabilityInsurance * payPeriods, preTax: false });
    if (postTax.unionDues) breakdown.push({ name: 'Union Dues', amount: postTax.unionDues, annualAmount: postTax.unionDues * payPeriods, preTax: false });
    if (postTax.charitableContributions) breakdown.push({ name: 'Charitable Contributions', amount: postTax.charitableContributions, annualAmount: postTax.charitableContributions * payPeriods, preTax: false });
    if (postTax.garnishments) breakdown.push({ name: 'Garnishments', amount: postTax.garnishments, annualAmount: postTax.garnishments * payPeriods, preTax: false });
    if (postTax.other) breakdown.push({ name: 'Other Post-Tax', amount: postTax.other, annualAmount: postTax.other * payPeriods, preTax: false });
  }
  
  return breakdown;
}

// ============================================================================
// Main Calculator Functions
// ============================================================================

/**
 * Calculate paycheck details including all taxes and deductions
 * 
 * @param inputs - Paycheck calculation inputs
 * @returns Complete paycheck breakdown
 * 
 * @example
 * ```typescript
 * const result = calculatePaycheck({
 *   payType: 'salary',
 *   annualSalary: 75000,
 *   payFrequency: 'bi-weekly',
 *   filingStatus: 'single',
 *   state: 'CA',
 *   preTaxDeductions: {
 *     traditional401k: 200,
 *     healthInsurance: 150
 *   }
 * });
 * 
 * console.log(result.netPay);        // Take-home per paycheck
 * console.log(result.effectiveTaxRate); // Total tax rate
 * ```
 */
export function calculatePaycheck(inputs: PaycheckInputs): PaycheckResult {
  const payPeriods = PAY_PERIODS_PER_YEAR[inputs.payFrequency];
  const annualGross = calculateAnnualGross(inputs);
  const grossPerPaycheck = annualGross / payPeriods;
  
  // Calculate pre-tax deductions
  const preTaxDeductionsPerPaycheck = sumPreTaxDeductions(inputs.preTaxDeductions);
  const annualPreTaxDeductions = preTaxDeductionsPerPaycheck * payPeriods;
  
  // Taxable income (gross minus pre-tax deductions and standard deduction)
  const standardDeduction = STANDARD_DEDUCTIONS_2025[inputs.filingStatus];
  const taxableIncome = Math.max(0, annualGross - annualPreTaxDeductions - standardDeduction);
  
  // Calculate federal tax
  let federalTaxAnnual = 0;
  let marginalFederalRate = 0;
  if (!inputs.federalExempt) {
    const federal = calculateFederalTax(taxableIncome, inputs.filingStatus, 2025);
    federalTaxAnnual = federal.tax;
    marginalFederalRate = federal.marginalRate;
  }
  
  // Calculate state tax
  let stateTaxAnnual = 0;
  let marginalStateRate = 0;
  if (!inputs.stateExempt) {
    const state = calculateStateTax(taxableIncome, inputs.state);
    stateTaxAnnual = state.tax;
    marginalStateRate = state.marginalRate;
  }
  
  // Calculate FICA taxes (on gross, not taxable income)
  const ficaGross = annualGross - annualPreTaxDeductions; // Some pre-tax deductions don't reduce FICA
  let socialSecurityAnnual = 0;
  let medicareAnnual = 0;
  let additionalMedicareAnnual = 0;
  
  if (!inputs.ficaExempt) {
    socialSecurityAnnual = calculateSocialSecurityTax(ficaGross, inputs.ytdGrossIncome || 0, 2025);
    const medicare = calculateMedicareTax(ficaGross, inputs.filingStatus, 2025);
    medicareAnnual = medicare.baseTax;
    additionalMedicareAnnual = medicare.additionalTax;
  }
  
  // Calculate post-tax deductions
  const postTaxDeductionsPerPaycheck = sumPostTaxDeductions(inputs.postTaxDeductions);
  const annualPostTaxDeductions = postTaxDeductionsPerPaycheck * payPeriods;
  
  // Total taxes
  const totalAnnualTaxes = federalTaxAnnual + stateTaxAnnual + socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual;
  
  // Total deductions
  const totalAnnualDeductions = annualPreTaxDeductions + annualPostTaxDeductions;
  
  // Net pay
  const annualNet = annualGross - totalAnnualTaxes - totalAnnualDeductions;
  const netPerPaycheck = annualNet / payPeriods;
  
  // Build tax breakdown
  const federalTax: TaxBreakdown = {
    name: 'Federal Income Tax',
    amount: federalTaxAnnual / payPeriods,
    rate: annualGross > 0 ? federalTaxAnnual / annualGross : 0,
    annualAmount: federalTaxAnnual,
  };
  
  const stateTax: TaxBreakdown = {
    name: `State Income Tax (${inputs.state})`,
    amount: stateTaxAnnual / payPeriods,
    rate: annualGross > 0 ? stateTaxAnnual / annualGross : 0,
    annualAmount: stateTaxAnnual,
  };
  
  const localTax: TaxBreakdown = {
    name: 'Local Tax',
    amount: 0,
    rate: 0,
    annualAmount: 0,
  };
  
  const socialSecurityTax: TaxBreakdown = {
    name: 'Social Security',
    amount: socialSecurityAnnual / payPeriods,
    rate: annualGross > 0 ? socialSecurityAnnual / annualGross : 0,
    annualAmount: socialSecurityAnnual,
  };
  
  const medicareTax: TaxBreakdown = {
    name: 'Medicare',
    amount: medicareAnnual / payPeriods,
    rate: annualGross > 0 ? medicareAnnual / annualGross : 0,
    annualAmount: medicareAnnual,
  };
  
  const additionalMedicareTax: TaxBreakdown = {
    name: 'Additional Medicare',
    amount: additionalMedicareAnnual / payPeriods,
    rate: annualGross > 0 ? additionalMedicareAnnual / annualGross : 0,
    annualAmount: additionalMedicareAnnual,
  };
  
  // Build arrays
  const taxBreakdown: TaxBreakdown[] = [
    federalTax,
    stateTax,
    socialSecurityTax,
    medicareTax,
  ];
  if (additionalMedicareAnnual > 0) {
    taxBreakdown.push(additionalMedicareTax);
  }
  
  const deductionBreakdown = buildDeductionBreakdown(
    inputs.preTaxDeductions,
    inputs.postTaxDeductions,
    payPeriods
  );
  
  // Calculate rates and percentages
  const effectiveTaxRate = annualGross > 0 ? totalAnnualTaxes / annualGross : 0;
  const taxPercentage = annualGross > 0 ? (totalAnnualTaxes / annualGross) * 100 : 0;
  const deductionPercentage = annualGross > 0 ? (totalAnnualDeductions / annualGross) * 100 : 0;
  const takeHomePercentage = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;
  
  // Hourly equivalent (based on 2080 working hours/year = 40 hrs × 52 weeks)
  const hourlyEquivalent = annualNet / 2080;
  
  return {
    // Pay period amounts
    grossPay: grossPerPaycheck,
    netPay: netPerPaycheck,
    totalTaxes: totalAnnualTaxes / payPeriods,
    totalDeductions: totalAnnualDeductions / payPeriods,
    totalPreTaxDeductions: preTaxDeductionsPerPaycheck,
    totalPostTaxDeductions: postTaxDeductionsPerPaycheck,
    
    // Annual amounts
    annualGross,
    annualNet,
    annualTaxes: totalAnnualTaxes,
    annualDeductions: totalAnnualDeductions,
    
    // Tax breakdown
    federalTax,
    stateTax,
    localTax,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    taxBreakdown,
    
    // Deduction breakdown
    deductionBreakdown,
    
    // Rates
    effectiveTaxRate,
    marginalFederalRate,
    marginalStateRate,
    
    // Conversion helpers
    hourlyEquivalent,
    payPeriodsPerYear: payPeriods,
    
    // Percentages
    taxPercentage,
    deductionPercentage,
    takeHomePercentage,
  };
}

/**
 * Quick paycheck calculation with minimal inputs
 * 
 * @param annualSalary - Annual salary
 * @param state - State of residence
 * @param filingStatus - Filing status (default: single)
 * @param payFrequency - Pay frequency (default: bi-weekly)
 * @returns Simplified paycheck result
 */
export function quickPaycheckEstimate(
  annualSalary: number,
  state: USState,
  filingStatus: FilingStatus = 'single',
  payFrequency: PayFrequency = 'bi-weekly'
): PaycheckResult {
  return calculatePaycheck({
    payType: 'salary',
    annualSalary,
    payFrequency,
    filingStatus,
    state,
  });
}

/**
 * Convert hourly rate to annual salary
 * 
 * @param hourlyRate - Hourly rate
 * @param hoursPerWeek - Hours worked per week (default: 40)
 * @returns Annual salary
 */
export function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number = 40): number {
  return hourlyRate * hoursPerWeek * 52;
}

/**
 * Convert annual salary to hourly rate
 * 
 * @param annualSalary - Annual salary
 * @param hoursPerWeek - Hours worked per week (default: 40)
 * @returns Hourly rate
 */
export function annualToHourly(annualSalary: number, hoursPerWeek: number = 40): number {
  return annualSalary / (hoursPerWeek * 52);
}

/**
 * Compare two paycheck scenarios
 * 
 * @param scenario1Inputs - First scenario inputs
 * @param scenario2Inputs - Second scenario inputs
 * @returns Comparison results
 * 
 * @example
 * ```typescript
 * const comparison = comparePaychecks(
 *   { payType: 'salary', annualSalary: 75000, ... },
 *   { payType: 'salary', annualSalary: 85000, ... }
 * );
 * console.log(comparison.annualNetDifference); // Increase in take-home
 * ```
 */
export function comparePaychecks(
  scenario1Inputs: PaycheckInputs,
  scenario2Inputs: PaycheckInputs
): PaycheckComparison {
  const scenario1 = calculatePaycheck(scenario1Inputs);
  const scenario2 = calculatePaycheck(scenario2Inputs);
  
  const netPayDifference = scenario2.netPay - scenario1.netPay;
  const annualNetDifference = scenario2.annualNet - scenario1.annualNet;
  const taxDifference = scenario2.annualTaxes - scenario1.annualTaxes;
  const netPayChangePercent = scenario1.netPay > 0 
    ? (netPayDifference / scenario1.netPay) * 100 
    : 0;
  
  return {
    scenario1,
    scenario2,
    netPayDifference,
    annualNetDifference,
    taxDifference,
    netPayChangePercent,
  };
}

/**
 * Compare take-home pay across multiple states
 * 
 * @param baseInputs - Base paycheck inputs (state will be overridden)
 * @param states - Array of states to compare
 * @returns Array of results sorted by net pay (highest first)
 */
export function compareStates(
  baseInputs: Omit<PaycheckInputs, 'state'>,
  states: USState[]
): { state: USState; stateName: string; result: PaycheckResult }[] {
  const results = states.map((state) => ({
    state,
    stateName: STATE_NAMES[state],
    result: calculatePaycheck({ ...baseInputs, state }),
  }));
  
  // Sort by net pay (highest first)
  return results.sort((a, b) => b.result.netPay - a.result.netPay);
}

/**
 * Get the federal tax bracket for a given taxable income
 * 
 * @param taxableIncome - Taxable income
 * @param filingStatus - Filing status
 * @param taxYear - Tax year
 * @returns Current and next bracket information
 */
export function getTaxBracketInfo(
  taxableIncome: number,
  filingStatus: FilingStatus,
  taxYear: 2024 | 2025 = 2025
): {
  currentBracket: { rate: number; min: number; max: number };
  nextBracket: { rate: number; min: number; max: number } | null;
  incomeUntilNextBracket: number;
} {
  const brackets = taxYear === 2024 
    ? FEDERAL_TAX_BRACKETS_2024[filingStatus]
    : FEDERAL_TAX_BRACKETS_2025[filingStatus];
  
  let currentBracket = brackets[0]!;
  let nextBracket: typeof currentBracket | null = null;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i]!;
    if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
      currentBracket = bracket;
      nextBracket = brackets[i + 1] || null;
      break;
    }
    if (taxableIncome >= bracket.max && i === brackets.length - 1) {
      currentBracket = bracket;
      nextBracket = null;
    }
  }
  
  const incomeUntilNextBracket = currentBracket.max === Infinity 
    ? 0 
    : currentBracket.max - taxableIncome;
  
  return {
    currentBracket,
    nextBracket,
    incomeUntilNextBracket,
  };
}
