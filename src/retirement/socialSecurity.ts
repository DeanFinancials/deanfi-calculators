/**
 * Social Security Benefits Calculator
 * 
 * Calculates Social Security benefits based on claiming age using
 * official SSA rules for early/delayed claiming adjustments.
 */

export interface SocialSecurityInputs {
  fullRetirementAge: number; // FRA (66-67 depending on birth year)
  fullBenefitAmount: number; // Monthly benefit at FRA
  claimingAge: number; // Age when benefits will be claimed
  lifeExpectancy: number; // Expected age of death
  investmentReturn?: number; // Optional: if investing delayed benefits
  investmentPercentage?: number; // Optional: percent of benefit to invest
}

export interface ClaimingStrategy {
  claimingAge: number;
  monthlyBenefit: number;
  annualBenefit: number;
  lifetimeBenefits: number;
  adjustmentPercentage: number;
  breakEvenAge: number | null;
  investedEndingBalance?: number;
}

/**
 * Calculate Full Retirement Age based on birth year
 * 
 * FRA Schedule:
 * - Born 1943-1954: 66
 * - Born 1955: 66 and 2 months
 * - Born 1956: 66 and 4 months
 * - Born 1957: 66 and 6 months
 * - Born 1958: 66 and 8 months
 * - Born 1959: 66 and 10 months
 * - Born 1960+: 67
 * 
 * @param birthYear - Year of birth
 * @returns Full Retirement Age
 */
export function calculateFullRetirementAge(birthYear: number): number {
  if (birthYear <= 1954) return 66;
  if (birthYear === 1955) return 66 + 2/12;
  if (birthYear === 1956) return 66 + 4/12;
  if (birthYear === 1957) return 66 + 6/12;
  if (birthYear === 1958) return 66 + 8/12;
  if (birthYear === 1959) return 66 + 10/12;
  return 67;
}

/**
 * Calculate benefit adjustment multiplier for early or delayed claiming
 * 
 * Early Claiming (before FRA):
 * - First 36 months early: 5/9 of 1% per month (6.67% per year)
 * - Beyond 36 months early: 5/12 of 1% per month (5% per year)
 * 
 * Delayed Claiming (after FRA, up to age 70):
 * - 2/3 of 1% per month (8% per year)
 * 
 * @param claimingAge - Age when claiming benefits
 * @param fullRetirementAge - Full Retirement Age
 * @returns Multiplier (e.g., 0.7 = 70% of full benefit, 1.24 = 124% of full benefit)
 */
export function calculateBenefitMultiplier(claimingAge: number, fullRetirementAge: number): number {
  if (claimingAge === fullRetirementAge) {
    return 1.0;
  }
  
  if (claimingAge < fullRetirementAge) {
    // Early claiming reduction
    const monthsEarly = Math.round((fullRetirementAge - claimingAge) * 12);
    
    if (monthsEarly <= 36) {
      // First 36 months: 5/9 of 1% per month
      const reduction = monthsEarly * (5/9) * 0.01;
      return 1 - reduction;
    } else {
      // First 36 months reduction
      const first36Reduction = 36 * (5/9) * 0.01;
      // Additional months: 5/12 of 1% per month
      const additionalMonths = monthsEarly - 36;
      const additionalReduction = additionalMonths * (5/12) * 0.01;
      return 1 - (first36Reduction + additionalReduction);
    }
  } else {
    // Delayed claiming increase (maxes out at age 70)
    const effectiveClaimAge = Math.min(claimingAge, 70);
    const monthsDelayed = Math.round((effectiveClaimAge - fullRetirementAge) * 12);
    // 2/3 of 1% per month = 8% per year
    const increase = monthsDelayed * (2/3) * 0.01;
    return 1 + increase;
  }
}

/**
 * Calculate Social Security claiming strategy outcomes
 * 
 * @param inputs - Claiming strategy parameters
 * @returns Detailed benefits calculation
 */
export function calculateClaimingStrategy(inputs: SocialSecurityInputs): ClaimingStrategy {
  const multiplier = calculateBenefitMultiplier(inputs.claimingAge, inputs.fullRetirementAge);
  const monthlyBenefit = inputs.fullBenefitAmount * multiplier;
  const annualBenefit = monthlyBenefit * 12;
  
  // Calculate lifetime benefits
  const yearsReceiving = inputs.lifeExpectancy - inputs.claimingAge;
  const monthsReceiving = yearsReceiving * 12;
  const lifetimeBenefits = monthlyBenefit * monthsReceiving;
  
  // Calculate adjustment percentage for display
  const adjustmentPercentage = (multiplier - 1) * 100;
  
  let investedEndingBalance: number | undefined;
  
  // Optional: Calculate invested balance if investing portion of benefits
  if (inputs.investmentReturn && inputs.investmentPercentage) {
    const monthlyInvestment = monthlyBenefit * (inputs.investmentPercentage / 100);
    const monthlyReturn = inputs.investmentReturn / 100 / 12;
    
    // Future value of annuity formula
    investedEndingBalance = monthlyInvestment * 
      (((1 + monthlyReturn) ** monthsReceiving - 1) / monthlyReturn);
  }
  
  return {
    claimingAge: inputs.claimingAge,
    monthlyBenefit: Math.round(monthlyBenefit),
    annualBenefit: Math.round(annualBenefit),
    lifetimeBenefits: Math.round(lifetimeBenefits),
    adjustmentPercentage: Math.round(adjustmentPercentage * 10) / 10,
    breakEvenAge: null, // Calculated separately in comparison
    investedEndingBalance: investedEndingBalance ? Math.round(investedEndingBalance) : undefined
  };
}

/**
 * Calculate break-even age between two claiming strategies
 * 
 * Break-even is when cumulative benefits from delayed claiming
 * surpass cumulative benefits from early claiming.
 * 
 * @param earlyStrategy - Results from claiming early
 * @param delayedStrategy - Results from claiming later
 * @returns Break-even age, or null if delayed never breaks even
 */
export function calculateBreakEven(
  earlyStrategy: ClaimingStrategy,
  delayedStrategy: ClaimingStrategy,
  maxAge: number = 100
): number | null {
  for (let age = delayedStrategy.claimingAge; age <= maxAge; age++) {
    const monthsSinceEarlyClaim = (age - earlyStrategy.claimingAge) * 12;
    const monthsSinceDelayedClaim = (age - delayedStrategy.claimingAge) * 12;
    
    const earlyTotal = earlyStrategy.monthlyBenefit * monthsSinceEarlyClaim;
    const delayedTotal = delayedStrategy.monthlyBenefit * monthsSinceDelayedClaim;
    
    if (delayedTotal >= earlyTotal) {
      return age;
    }
  }
  
  return null; // Delayed strategy never breaks even
}

/**
 * Compare multiple Social Security claiming ages
 * 
 * @param inputs - Base inputs (FRA, full benefit amount, life expectancy)
 * @param claimingAges - Array of ages to compare (e.g., [62, 67, 70])
 * @returns Array of results with break-even ages calculated
 */
export function compareClaimingAges(
  inputs: Omit<SocialSecurityInputs, 'claimingAge'>,
  claimingAges: number[]
): ClaimingStrategy[] {
  const strategies = claimingAges.map(age => 
    calculateClaimingStrategy({ ...inputs, claimingAge: age })
  );
  
  // Calculate break-even ages against earliest claiming age
  const earliestStrategy = strategies[0];
  
  strategies.forEach((strategy, index) => {
    if (index > 0) {
      strategy.breakEvenAge = calculateBreakEven(earliestStrategy, strategy);
    }
  });
  
  return strategies;
}
