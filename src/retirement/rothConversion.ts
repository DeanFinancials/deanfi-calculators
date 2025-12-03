/**
 * Roth IRA Conversion Calculator
 * 
 * Calculates the tax implications of converting traditional IRA/401(k) funds to Roth IRA.
 * Includes break-even analysis, tax bracket impact, multi-year projections,
 * and optimal conversion strategies.
 * 
 * Key Concepts:
 * - Roth conversions are taxable as ordinary income in the year of conversion
 * - After conversion, growth in Roth IRA is tax-free
 * - No RMDs for Roth IRAs (during owner's lifetime)
 * - 5-year rule applies to converted amounts for penalty-free withdrawal
 * 
 * Sources:
 * - IRS Publication 590-A (Contributions to IRAs)
 * - IRS Publication 590-B (Distributions from IRAs)
 * - Federal Tax Brackets (updated annually)
 */

// =============================================================================
// Types
// =============================================================================

/** Filing status for tax calculations */
export type RothFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

/** Account type that can be converted to Roth */
export type ConvertibleAccountType = 'traditional_ira' | '401k' | '403b' | '457b' | 'sep_ira' | 'simple_ira';

/** Conversion input parameters */
export interface RothConversionInputs {
  /** Current age */
  currentAge: number;
  
  /** Expected retirement age */
  retirementAge: number;
  
  /** Current balance in traditional account(s) */
  traditionalBalance: number;
  
  /** Amount to convert this year */
  conversionAmount: number;
  
  /** Current year taxable income (before conversion) */
  currentTaxableIncome: number;
  
  /** Expected taxable income in retirement */
  retirementTaxableIncome: number;
  
  /** Filing status */
  filingStatus: RothFilingStatus;
  
  /** Expected annual return rate (percentage) */
  expectedReturnRate: number;
  
  /** Expected inflation rate (percentage) */
  inflationRate?: number;
  
  /** State income tax rate (percentage) - optional */
  stateTaxRate?: number;
  
  /** Current Roth IRA balance (optional) */
  currentRothBalance?: number;
  
  /** Account type being converted (optional, for display purposes) */
  accountType?: ConvertibleAccountType;
}

/** Federal tax bracket information */
export interface TaxBracket {
  /** Minimum income for this bracket */
  min: number;
  /** Maximum income for this bracket (Infinity for top bracket) */
  max: number;
  /** Marginal tax rate (percentage) */
  rate: number;
}

/** Tax impact analysis result */
export interface TaxImpact {
  /** Federal tax on conversion */
  federalTax: number;
  /** State tax on conversion */
  stateTax: number;
  /** Total tax on conversion */
  totalTax: number;
  /** Marginal tax rate applied to conversion */
  marginalRate: number;
  /** Effective tax rate on conversion */
  effectiveRate: number;
  /** Tax bracket before conversion */
  bracketBefore: number;
  /** Tax bracket after conversion */
  bracketAfter: number;
  /** Whether conversion pushes into higher bracket */
  pushesIntoBiggerBracket: boolean;
  /** Amount that fits in current bracket */
  amountInCurrentBracket: number;
  /** Amount that spills into next bracket */
  amountInNextBracket: number;
}

/** Year-by-year projection data */
export interface YearlyProjection {
  /** Year number (0 = current year) */
  year: number;
  /** Age at this year */
  age: number;
  /** Traditional IRA balance (no conversion scenario) */
  traditionalBalance: number;
  /** Roth IRA balance (with conversion) */
  rothBalance: number;
  /** Traditional after-tax value (accounting for future taxes) */
  traditionalAfterTax: number;
  /** Cumulative tax savings from conversion */
  cumulativeTaxSavings: number;
  /** Whether conversion has paid off by this year */
  conversionPaidOff: boolean;
}

/** Break-even analysis result */
export interface BreakEvenAnalysis {
  /** Years until break-even */
  yearsToBreakEven: number;
  /** Age at break-even */
  ageAtBreakEven: number;
  /** Whether break-even is achievable within projection period */
  breakEvenAchievable: boolean;
  /** Lifetime tax savings if conversion done */
  lifetimeTaxSavings: number;
  /** Net benefit at retirement */
  netBenefitAtRetirement: number;
  /** Net benefit at age 90 (for long-term view) */
  netBenefitAtAge90: number;
}

/** Optimal conversion recommendation */
export interface OptimalConversion {
  /** Recommended conversion amount */
  recommendedAmount: number;
  /** Maximum to stay in current bracket */
  maxInCurrentBracket: number;
  /** Reason for recommendation */
  reason: string;
  /** Tax cost of recommended conversion */
  taxCost: number;
  /** Potential long-term benefit */
  longTermBenefit: number;
  /** Is conversion recommended? */
  isRecommended: boolean;
}

/** Main conversion result */
export interface RothConversionResult {
  /** Input summary */
  inputs: RothConversionInputs;
  
  /** Tax impact of the conversion */
  taxImpact: TaxImpact;
  
  /** Break-even analysis */
  breakEven: BreakEvenAnalysis;
  
  /** Optimal conversion recommendation */
  optimal: OptimalConversion;
  
  /** Year-by-year projections (30 years) */
  projections: YearlyProjection[];
  
  /** Comparison scenarios */
  scenarios: {
    /** No conversion - keep in traditional */
    noConversion: { valueAtRetirement: number; afterTaxAtRetirement: number };
    /** Full conversion this year */
    fullConversion: { valueAtRetirement: number; afterTaxAtRetirement: number };
    /** Partial conversion (input amount) */
    partialConversion: { valueAtRetirement: number; afterTaxAtRetirement: number };
  };
  
  /** Important notes and warnings */
  warnings: string[];
  
  /** Summary recommendation */
  recommendation: string;
}

// =============================================================================
// Constants - 2024 Federal Tax Brackets
// =============================================================================

/** 2024 Federal Tax Brackets by filing status */
export const FEDERAL_TAX_BRACKETS_2024: Record<RothFilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 10 },
    { min: 23200, max: 94300, rate: 12 },
    { min: 94300, max: 201050, rate: 22 },
    { min: 201050, max: 383900, rate: 24 },
    { min: 383900, max: 487450, rate: 32 },
    { min: 487450, max: 731200, rate: 35 },
    { min: 731200, max: Infinity, rate: 37 },
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 365600, rate: 35 },
    { min: 365600, max: Infinity, rate: 37 },
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 10 },
    { min: 16550, max: 63100, rate: 12 },
    { min: 63100, max: 100500, rate: 22 },
    { min: 100500, max: 191950, rate: 24 },
    { min: 191950, max: 243700, rate: 32 },
    { min: 243700, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ],
};

/** 2025 Federal Tax Brackets (projected with inflation adjustment) */
export const FEDERAL_TAX_BRACKETS_2025: Record<RothFilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 10 },
    { min: 11925, max: 48475, rate: 12 },
    { min: 48475, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250525, rate: 32 },
    { min: 250525, max: 626350, rate: 35 },
    { min: 626350, max: Infinity, rate: 37 },
  ],
  married_joint: [
    { min: 0, max: 23850, rate: 10 },
    { min: 23850, max: 96950, rate: 12 },
    { min: 96950, max: 206700, rate: 22 },
    { min: 206700, max: 394600, rate: 24 },
    { min: 394600, max: 501050, rate: 32 },
    { min: 501050, max: 751600, rate: 35 },
    { min: 751600, max: Infinity, rate: 37 },
  ],
  married_separate: [
    { min: 0, max: 11925, rate: 10 },
    { min: 11925, max: 48475, rate: 12 },
    { min: 48475, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250525, rate: 32 },
    { min: 250525, max: 375800, rate: 35 },
    { min: 375800, max: Infinity, rate: 37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 10 },
    { min: 17000, max: 64850, rate: 12 },
    { min: 64850, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250500, rate: 32 },
    { min: 250500, max: 626350, rate: 35 },
    { min: 626350, max: Infinity, rate: 37 },
  ],
};

/** Standard deductions for 2024 */
export const STANDARD_DEDUCTIONS_2024: Record<RothFilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the tax bracket for a given income
 */
export function getTaxBracket(
  income: number,
  filingStatus: RothFilingStatus,
  year: 2024 | 2025 = 2024
): TaxBracket {
  const brackets = year === 2024 
    ? FEDERAL_TAX_BRACKETS_2024[filingStatus]
    : FEDERAL_TAX_BRACKETS_2025[filingStatus];
  
  for (const bracket of brackets) {
    if (income >= bracket.min && income < bracket.max) {
      return bracket;
    }
  }
  // Return top bracket if income exceeds all brackets
  return brackets[brackets.length - 1];
}

/**
 * Calculate federal income tax using progressive brackets
 */
export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: RothFilingStatus,
  year: 2024 | 2025 = 2024
): number {
  if (taxableIncome <= 0) return 0;
  
  const brackets = year === 2024 
    ? FEDERAL_TAX_BRACKETS_2024[filingStatus]
    : FEDERAL_TAX_BRACKETS_2025[filingStatus];
  
  let totalTax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    totalTax += taxableInBracket * (bracket.rate / 100);
    remainingIncome -= taxableInBracket;
  }
  
  return Math.round(totalTax * 100) / 100;
}

/**
 * Calculate the marginal tax rate on additional income
 */
export function getMarginalRate(
  currentIncome: number,
  additionalIncome: number,
  filingStatus: RothFilingStatus,
  year: 2024 | 2025 = 2024
): number {
  const taxBefore = calculateFederalTax(currentIncome, filingStatus, year);
  const taxAfter = calculateFederalTax(currentIncome + additionalIncome, filingStatus, year);
  const additionalTax = taxAfter - taxBefore;
  
  return additionalIncome > 0 
    ? Math.round((additionalTax / additionalIncome) * 10000) / 100 
    : 0;
}

/**
 * Calculate room in current bracket before hitting next bracket
 */
export function getRoomInCurrentBracket(
  currentIncome: number,
  filingStatus: RothFilingStatus,
  year: 2024 | 2025 = 2024
): number {
  const bracket = getTaxBracket(currentIncome, filingStatus, year);
  return Math.max(0, bracket.max - currentIncome);
}

/**
 * Calculate future value with compound growth
 */
function calculateFutureValue(
  presentValue: number,
  annualRate: number,
  years: number
): number {
  return presentValue * Math.pow(1 + annualRate / 100, years);
}

// =============================================================================
// Main Calculation Functions
// =============================================================================

/**
 * Calculate the tax impact of a Roth conversion
 */
export function calculateTaxImpact(
  currentIncome: number,
  conversionAmount: number,
  filingStatus: RothFilingStatus,
  stateTaxRate: number = 0,
  year: 2024 | 2025 = 2024
): TaxImpact {
  // Get bracket info before and after
  const bracketBefore = getTaxBracket(currentIncome, filingStatus, year);
  const incomeAfter = currentIncome + conversionAmount;
  const bracketAfter = getTaxBracket(incomeAfter, filingStatus, year);
  
  // Calculate federal tax difference
  const taxBefore = calculateFederalTax(currentIncome, filingStatus, year);
  const taxAfter = calculateFederalTax(incomeAfter, filingStatus, year);
  const federalTax = taxAfter - taxBefore;
  
  // Calculate state tax
  const stateTax = conversionAmount * (stateTaxRate / 100);
  
  // Total tax
  const totalTax = federalTax + stateTax;
  
  // Effective rate on conversion
  const effectiveRate = conversionAmount > 0 
    ? Math.round((totalTax / conversionAmount) * 10000) / 100 
    : 0;
  
  // Marginal rate
  const marginalRate = getMarginalRate(currentIncome, conversionAmount, filingStatus, year);
  
  // Calculate amounts in each bracket
  const roomInCurrentBracket = getRoomInCurrentBracket(currentIncome, filingStatus, year);
  const amountInCurrentBracket = Math.min(conversionAmount, roomInCurrentBracket);
  const amountInNextBracket = Math.max(0, conversionAmount - roomInCurrentBracket);
  
  return {
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    totalTax: Math.round(totalTax),
    marginalRate,
    effectiveRate,
    bracketBefore: bracketBefore.rate,
    bracketAfter: bracketAfter.rate,
    pushesIntoBiggerBracket: bracketAfter.rate > bracketBefore.rate,
    amountInCurrentBracket: Math.round(amountInCurrentBracket),
    amountInNextBracket: Math.round(amountInNextBracket),
  };
}

/**
 * Generate year-by-year projections comparing conversion vs no conversion
 */
export function generateProjections(
  inputs: RothConversionInputs,
  taxImpact: TaxImpact
): YearlyProjection[] {
  const {
    currentAge,
    traditionalBalance,
    conversionAmount,
    retirementTaxableIncome,
    filingStatus,
    expectedReturnRate,
    currentRothBalance = 0,
  } = inputs;
  
  const projections: YearlyProjection[] = [];
  const yearsToProject = Math.min(40, 90 - currentAge); // Project to age 90 max
  
  // No conversion scenario: all stays in traditional
  // Conversion scenario: conversionAmount goes to Roth, rest stays traditional
  
  const tradRemainingAfterConversion = traditionalBalance - conversionAmount;
  const rothAfterConversion = currentRothBalance + (conversionAmount - taxImpact.totalTax);
  
  for (let year = 0; year <= yearsToProject; year++) {
    const age = currentAge + year;
    
    // No conversion: traditional grows, taxed at retirement rate
    const traditionalNoConversion = calculateFutureValue(traditionalBalance, expectedReturnRate, year);
    
    // Get estimated tax rate in retirement (using retirement income)
    const retirementBracket = getTaxBracket(retirementTaxableIncome, filingStatus);
    const retirementTaxRate = retirementBracket.rate / 100;
    
    // Traditional after-tax value (estimate)
    const traditionalAfterTax = traditionalNoConversion * (1 - retirementTaxRate);
    
    // With conversion: traditional portion grows + Roth portion grows tax-free
    const tradAfterConversionGrowth = calculateFutureValue(tradRemainingAfterConversion, expectedReturnRate, year);
    const rothGrowth = calculateFutureValue(rothAfterConversion, expectedReturnRate, year);
    const rothBalance = rothGrowth; // Roth is tax-free
    
    // Total after-tax with conversion
    const totalAfterTaxWithConversion = 
      (tradAfterConversionGrowth * (1 - retirementTaxRate)) + rothBalance;
    
    // Cumulative benefit (positive = conversion better)
    const cumulativeTaxSavings = totalAfterTaxWithConversion - traditionalAfterTax;
    
    projections.push({
      year,
      age,
      traditionalBalance: Math.round(traditionalNoConversion),
      rothBalance: Math.round(rothBalance),
      traditionalAfterTax: Math.round(traditionalAfterTax),
      cumulativeTaxSavings: Math.round(cumulativeTaxSavings),
      conversionPaidOff: cumulativeTaxSavings >= 0,
    });
  }
  
  return projections;
}

/**
 * Calculate break-even point for the conversion
 */
export function calculateBreakEven(
  projections: YearlyProjection[],
  inputs: RothConversionInputs
): BreakEvenAnalysis {
  // Find first year where conversion pays off
  const breakEvenYear = projections.find(p => p.conversionPaidOff && p.year > 0);
  
  const yearsToBreakEven = breakEvenYear ? breakEvenYear.year : -1;
  const ageAtBreakEven = breakEvenYear ? breakEvenYear.age : -1;
  const breakEvenAchievable = yearsToBreakEven > 0;
  
  // Find retirement year
  const retirementYear = inputs.retirementAge - inputs.currentAge;
  const atRetirement = projections[retirementYear] || projections[projections.length - 1];
  
  // Find age 90 projection (or last available)
  const age90Year = 90 - inputs.currentAge;
  const atAge90 = projections[Math.min(age90Year, projections.length - 1)] || projections[projections.length - 1];
  
  return {
    yearsToBreakEven,
    ageAtBreakEven,
    breakEvenAchievable,
    lifetimeTaxSavings: atAge90.cumulativeTaxSavings,
    netBenefitAtRetirement: atRetirement.cumulativeTaxSavings,
    netBenefitAtAge90: atAge90.cumulativeTaxSavings,
  };
}

/**
 * Calculate optimal conversion amount
 */
export function calculateOptimalConversion(
  inputs: RothConversionInputs
): OptimalConversion {
  const {
    currentTaxableIncome,
    traditionalBalance,
    filingStatus,
    retirementTaxableIncome,
    stateTaxRate = 0,
  } = inputs;
  
  // Get current and retirement brackets
  const currentBracket = getTaxBracket(currentTaxableIncome, filingStatus);
  const retirementBracket = getTaxBracket(retirementTaxableIncome, filingStatus);
  
  // Calculate room in current bracket
  const roomInBracket = getRoomInCurrentBracket(currentTaxableIncome, filingStatus);
  
  // Strategy: Fill up current bracket if retirement tax rate is higher
  const maxInCurrentBracket = Math.min(roomInBracket, traditionalBalance);
  
  let recommendedAmount = 0;
  let reason = '';
  let isRecommended = false;
  
  // Decision logic
  if (currentBracket.rate < retirementBracket.rate) {
    // Current rate lower - convert up to bracket limit
    recommendedAmount = maxInCurrentBracket;
    reason = `Your current ${currentBracket.rate}% bracket is lower than your expected retirement ${retirementBracket.rate}% bracket. Converting to fill your current bracket saves taxes long-term.`;
    isRecommended = true;
  } else if (currentBracket.rate === retirementBracket.rate) {
    // Same bracket - moderate conversion recommended for RMD benefits
    recommendedAmount = Math.min(maxInCurrentBracket * 0.5, traditionalBalance);
    reason = `Same tax bracket now (${currentBracket.rate}%) and in retirement. Partial conversion may help avoid future RMDs and provide tax diversification.`;
    isRecommended = true;
  } else {
    // Higher rate now - conversion less beneficial
    recommendedAmount = 0;
    reason = `Your current ${currentBracket.rate}% bracket is higher than your expected retirement ${retirementBracket.rate}% bracket. Conversion may not be beneficial unless you expect tax rates to increase.`;
    isRecommended = false;
  }
  
  // Calculate tax cost
  const taxImpact = calculateTaxImpact(
    currentTaxableIncome,
    recommendedAmount,
    filingStatus,
    stateTaxRate
  );
  
  // Estimate long-term benefit (30-year horizon)
  const rateDifference = (retirementBracket.rate - currentBracket.rate) / 100;
  const futureGrowthFactor = Math.pow(1 + inputs.expectedReturnRate / 100, 20);
  const longTermBenefit = recommendedAmount * futureGrowthFactor * rateDifference;
  
  return {
    recommendedAmount: Math.round(recommendedAmount),
    maxInCurrentBracket: Math.round(maxInCurrentBracket),
    reason,
    taxCost: taxImpact.totalTax,
    longTermBenefit: Math.round(longTermBenefit),
    isRecommended,
  };
}

/**
 * Main function: Calculate comprehensive Roth conversion analysis
 */
export function calculateRothConversion(inputs: RothConversionInputs): RothConversionResult {
  // Validate inputs
  const warnings: string[] = [];
  
  if (inputs.currentAge >= inputs.retirementAge) {
    warnings.push('Current age is at or past retirement age. Results show immediate impact.');
  }
  
  if (inputs.conversionAmount > inputs.traditionalBalance) {
    warnings.push('Conversion amount exceeds traditional balance. Using full balance.');
    inputs.conversionAmount = inputs.traditionalBalance;
  }
  
  if (inputs.currentAge < 59.5) {
    warnings.push('5-year rule: Converted amounts may be subject to 10% early withdrawal penalty if withdrawn within 5 years or before age 59½.');
  }
  
  // Calculate tax impact
  const taxImpact = calculateTaxImpact(
    inputs.currentTaxableIncome,
    inputs.conversionAmount,
    inputs.filingStatus,
    inputs.stateTaxRate || 0
  );
  
  // Generate projections
  const projections = generateProjections(inputs, taxImpact);
  
  // Calculate break-even
  const breakEven = calculateBreakEven(projections, inputs);
  
  // Calculate optimal conversion
  const optimal = calculateOptimalConversion(inputs);
  
  // Calculate scenarios
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const retirementBracket = getTaxBracket(inputs.retirementTaxableIncome, inputs.filingStatus);
  const retirementTaxRate = retirementBracket.rate / 100;
  
  // No conversion scenario
  const noConversionValue = calculateFutureValue(inputs.traditionalBalance, inputs.expectedReturnRate, yearsToRetirement);
  const noConversionAfterTax = noConversionValue * (1 - retirementTaxRate);
  
  // Full conversion scenario  
  const fullConversionTax = calculateTaxImpact(
    inputs.currentTaxableIncome,
    inputs.traditionalBalance,
    inputs.filingStatus,
    inputs.stateTaxRate || 0
  );
  const fullConversionRothValue = calculateFutureValue(
    inputs.traditionalBalance - fullConversionTax.totalTax + (inputs.currentRothBalance || 0),
    inputs.expectedReturnRate,
    yearsToRetirement
  );
  
  // Partial conversion scenario
  const partialConversionRothValue = calculateFutureValue(
    inputs.conversionAmount - taxImpact.totalTax + (inputs.currentRothBalance || 0),
    inputs.expectedReturnRate,
    yearsToRetirement
  );
  const partialTradValue = calculateFutureValue(
    inputs.traditionalBalance - inputs.conversionAmount,
    inputs.expectedReturnRate,
    yearsToRetirement
  );
  const partialTradAfterTax = partialTradValue * (1 - retirementTaxRate);
  
  // Generate recommendation
  let recommendation = '';
  if (optimal.isRecommended && breakEven.breakEvenAchievable) {
    recommendation = `Consider converting $${optimal.recommendedAmount.toLocaleString()} to fill your ${getTaxBracket(inputs.currentTaxableIncome, inputs.filingStatus).rate}% bracket. Break-even in ${breakEven.yearsToBreakEven} years with potential ${breakEven.lifetimeTaxSavings > 0 ? 'savings' : 'cost'} of $${Math.abs(breakEven.lifetimeTaxSavings).toLocaleString()} over your lifetime.`;
  } else if (!optimal.isRecommended) {
    recommendation = `Conversion may not be optimal this year. Your current tax rate is higher than your expected retirement rate. Consider waiting for a lower-income year or if you expect tax rates to rise.`;
  } else {
    recommendation = `Conversion benefits are limited. Consider smaller conversions spread over multiple years to minimize tax impact.`;
  }
  
  return {
    inputs,
    taxImpact,
    breakEven,
    optimal,
    projections,
    scenarios: {
      noConversion: {
        valueAtRetirement: Math.round(noConversionValue),
        afterTaxAtRetirement: Math.round(noConversionAfterTax),
      },
      fullConversion: {
        valueAtRetirement: Math.round(fullConversionRothValue),
        afterTaxAtRetirement: Math.round(fullConversionRothValue), // Roth is tax-free
      },
      partialConversion: {
        valueAtRetirement: Math.round(partialConversionRothValue + partialTradValue),
        afterTaxAtRetirement: Math.round(partialConversionRothValue + partialTradAfterTax),
      },
    },
    warnings,
    recommendation,
  };
}

/**
 * Quick calculation: Estimate tax on conversion amount only
 */
export function quickConversionTax(
  conversionAmount: number,
  currentIncome: number,
  filingStatus: RothFilingStatus,
  stateTaxRate: number = 0
): { federalTax: number; stateTax: number; totalTax: number; effectiveRate: number } {
  const impact = calculateTaxImpact(currentIncome, conversionAmount, filingStatus, stateTaxRate);
  return {
    federalTax: impact.federalTax,
    stateTax: impact.stateTax,
    totalTax: impact.totalTax,
    effectiveRate: impact.effectiveRate,
  };
}

/**
 * Calculate bracket-filling conversion amount
 * Unique feature: Find exact amount to fill current bracket without spilling over
 */
export function calculateBracketFillingAmount(
  currentIncome: number,
  filingStatus: RothFilingStatus,
  traditionalBalance: number
): { amount: number; currentBracket: number; nextBracket: number; taxCost: number } {
  const currentBracket = getTaxBracket(currentIncome, filingStatus);
  const room = getRoomInCurrentBracket(currentIncome, filingStatus);
  const amount = Math.min(room, traditionalBalance);
  
  // Get next bracket rate
  const nextBracket = getTaxBracket(currentIncome + room + 1, filingStatus);
  
  // Calculate tax on this amount
  const taxCost = amount * (currentBracket.rate / 100);
  
  return {
    amount: Math.round(amount),
    currentBracket: currentBracket.rate,
    nextBracket: nextBracket.rate,
    taxCost: Math.round(taxCost),
  };
}

/**
 * Compare multiple conversion scenarios
 */
export function compareConversionScenarios(
  inputs: Omit<RothConversionInputs, 'conversionAmount'>,
  amounts: number[]
): Array<{ amount: number; result: RothConversionResult }> {
  return amounts.map(amount => ({
    amount,
    result: calculateRothConversion({ ...inputs, conversionAmount: amount }),
  }));
}
