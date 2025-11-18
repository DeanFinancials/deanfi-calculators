/**
 * Debt-to-Income Ratio Calculator
 * 
 * Calculates front-end and back-end DTI ratios used by lenders
 * for mortgage qualification and financial health assessment.
 */

export interface DebtItem {
  name: string;
  monthlyPayment: number;
  category: 'mortgage' | 'credit' | 'auto' | 'student' | 'other';
}

export interface DTIResult {
  frontEndRatio: number; // Housing costs / gross income
  backEndRatio: number; // All debts / gross income
  totalMonthlyDebt: number;
  housingCosts: number;
  availableIncome: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'concerning';
  mortgageEligibility: string;
}

/**
 * Calculate debt-to-income ratios
 * 
 * Front-end ratio: Housing costs ÷ Gross monthly income
 * Back-end ratio: All monthly debts ÷ Gross monthly income
 * 
 * Ratings:
 * - Excellent: ≤20%
 * - Good: ≤36%
 * - Fair: ≤43%
 * - Poor: ≤50%
 * - Concerning: >50%
 * 
 * @param grossMonthlyIncome - Monthly income before taxes
 * @param debts - Array of monthly debt obligations
 * @returns DTI ratios and financial health assessment
 */
export function calculateDTI(grossMonthlyIncome: number, debts: DebtItem[]): DTIResult {
  const housingCosts = debts
    .filter(d => d.category === 'mortgage')
    .reduce((sum, d) => sum + d.monthlyPayment, 0);
  
  const totalMonthlyDebt = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);
  
  const frontEndRatio = (housingCosts / grossMonthlyIncome) * 100;
  const backEndRatio = (totalMonthlyDebt / grossMonthlyIncome) * 100;
  const availableIncome = grossMonthlyIncome - totalMonthlyDebt;
  
  // Determine rating based on back-end ratio
  let rating: DTIResult['rating'];
  if (backEndRatio <= 20) rating = 'excellent';
  else if (backEndRatio <= 36) rating = 'good';
  else if (backEndRatio <= 43) rating = 'fair';
  else if (backEndRatio <= 50) rating = 'poor';
  else rating = 'concerning';
  
  // Mortgage eligibility guidance
  let mortgageEligibility: string;
  if (backEndRatio <= 28) {
    mortgageEligibility = 'Excellent - Qualify for best rates';
  } else if (backEndRatio <= 36) {
    mortgageEligibility = 'Good - Should qualify for most loans';
  } else if (backEndRatio <= 43) {
    mortgageEligibility = 'Fair - May qualify with some restrictions';
  } else {
    mortgageEligibility = 'Difficult - May not qualify for conventional loans';
  }
  
  return {
    frontEndRatio: Math.round(frontEndRatio * 10) / 10,
    backEndRatio: Math.round(backEndRatio * 10) / 10,
    totalMonthlyDebt: Math.round(totalMonthlyDebt),
    housingCosts: Math.round(housingCosts),
    availableIncome: Math.round(availableIncome),
    rating,
    mortgageEligibility
  };
}
