/**
 * 401(k) vs IRA Calculator
 * 
 * Compares tax-advantaged retirement accounts including employer match benefits.
 */

export interface AccountInputs {
  monthlyContribution: number;
  employerMatchPercentage: number; // e.g., 50 for 50% match
  employerMatchCap: number; // Cap as percentage of salary, e.g., 6 for 6% of salary
  annualSalary: number;
  years: number;
  expectedReturn: number; // Annual return percentage
  currentTaxRate: number; // Current tax bracket percentage
  retirementTaxRate: number; // Expected tax rate in retirement
}

export interface AccountComparison {
  accountType: 'Traditional 401k' | 'Roth 401k' | 'Traditional IRA' | 'Roth IRA';
  currentTaxSavings: number;
  retirementValue: number;
  afterTaxValue: number;
  employerMatch: number;
  totalContributions: number;
}

/**
 * Calculate future value with compound interest and monthly contributions
 * 
 * @param monthlyContribution - Monthly contribution amount
 * @param monthlyReturn - Monthly return rate (annual / 12)
 * @param months - Number of months
 * @returns Future value
 */
function calculateFutureValue(
  monthlyContribution: number,
  monthlyReturn: number,
  months: number
): number {
  if (monthlyReturn === 0) {
    return monthlyContribution * months;
  }
  
  // Future value of annuity formula: PMT × [((1 + r)^n - 1) / r]
  return monthlyContribution * (((1 + monthlyReturn) ** months - 1) / monthlyReturn);
}

/**
 * Calculate employer match amount
 * 
 * @param inputs - Account inputs
 * @returns Total employer match over the period
 */
function calculateEmployerMatch(inputs: AccountInputs): number {
  const monthlyMatch = (inputs.annualSalary / 12) * 
    (Math.min(inputs.employerMatchCap, inputs.monthlyContribution / (inputs.annualSalary / 12) * 100) / 100) * 
    (inputs.employerMatchPercentage / 100);
  
  const monthlyReturn = inputs.expectedReturn / 100 / 12;
  const months = inputs.years * 12;
  
  return calculateFutureValue(monthlyMatch, monthlyReturn, months);
}

/**
 * Calculate 401(k) or IRA account projection
 * 
 * @param inputs - Account parameters
 * @param accountType - Type of account
 * @returns Account comparison results
 */
export function calculateAccount(
  inputs: AccountInputs,
  accountType: 'Traditional 401k' | 'Roth 401k' | 'Traditional IRA' | 'Roth IRA'
): AccountComparison {
  const monthlyReturn = inputs.expectedReturn / 100 / 12;
  const months = inputs.years * 12;
  
  // Calculate employee contributions future value
  const employeeContributionValue = calculateFutureValue(
    inputs.monthlyContribution,
    monthlyReturn,
    months
  );
  
  // Calculate employer match (only for 401k)
  const is401k = accountType.includes('401k');
  const employerMatchValue = is401k ? calculateEmployerMatch(inputs) : 0;
  
  const retirementValue = employeeContributionValue + employerMatchValue;
  const totalContributions = inputs.monthlyContribution * months;
  
  // Calculate tax implications
  const isTraditional = accountType.includes('Traditional');
  const isRoth = accountType.includes('Roth');
  
  let currentTaxSavings = 0;
  let afterTaxValue = retirementValue;
  
  if (isTraditional) {
    // Traditional: Tax deduction now, taxes in retirement
    currentTaxSavings = totalContributions * (inputs.currentTaxRate / 100);
    afterTaxValue = retirementValue * (1 - inputs.retirementTaxRate / 100);
  } else if (isRoth) {
    // Roth: No deduction now, tax-free in retirement
    currentTaxSavings = 0;
    afterTaxValue = retirementValue; // Tax-free withdrawals
  }
  
  return {
    accountType,
    currentTaxSavings: Math.round(currentTaxSavings),
    retirementValue: Math.round(retirementValue),
    afterTaxValue: Math.round(afterTaxValue),
    employerMatch: Math.round(employerMatchValue),
    totalContributions: Math.round(totalContributions)
  };
}

/**
 * Compare all account types side by side
 * 
 * @param inputs - Account parameters
 * @returns Comparison of all four account types
 */
export function compareAllAccounts(inputs: AccountInputs): AccountComparison[] {
  return [
    calculateAccount(inputs, 'Traditional 401k'),
    calculateAccount(inputs, 'Roth 401k'),
    calculateAccount(inputs, 'Traditional IRA'),
    calculateAccount(inputs, 'Roth IRA')
  ];
}
