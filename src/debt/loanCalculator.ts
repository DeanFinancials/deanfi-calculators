/**
 * Loan Calculator
 * 
 * Calculates loan amortization schedules for any type of loan
 * (auto, personal, student, etc.) using standard loan formulas.
 */

export interface LoanInputs {
  principal: number;
  interestRate: number; // Annual percentage
  termMonths: number;
}

export interface AmortizationSchedule {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
  totalPrincipal: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  schedule: AmortizationSchedule[];
}

/**
 * Calculate monthly loan payment using amortization formula
 * 
 * Formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
 * Where:
 * - M = Monthly payment
 * - P = Principal
 * - r = Monthly interest rate
 * - n = Number of payments
 * 
 * Special case: If interest rate is 0, payment = principal / months
 * 
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param months - Term in months
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (annualRate === 0) {
    return principal / months;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return payment;
}

/**
 * Generate complete loan amortization schedule
 * 
 * Each month:
 * - Interest = remaining balance × monthly rate
 * - Principal = payment - interest
 * - New balance = balance - principal
 * 
 * @param inputs - Loan parameters
 * @returns Complete amortization schedule and summary
 */
export function calculateLoanAmortization(inputs: LoanInputs): LoanSummary {
  const monthlyPayment = calculateMonthlyPayment(
    inputs.principal,
    inputs.interestRate,
    inputs.termMonths
  );
  
  const schedule: AmortizationSchedule[] = [];
  let balance = inputs.principal;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const monthlyRate = inputs.interestRate / 100 / 12;
  
  for (let month = 1; month <= inputs.termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    
    // Last payment adjustment for rounding
    if (month === inputs.termMonths) {
      principalPayment = balance;
    }
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    
    schedule.push({
      month,
      year: Math.floor((month - 1) / 12) + 1,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPrincipal: Math.round(totalPrincipal * 100) / 100
    });
  }
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayments: Math.round(monthlyPayment * inputs.termMonths),
    totalInterest: Math.round(totalInterest),
    totalPrincipal: Math.round(totalPrincipal),
    schedule
  };
}

/**
 * Calculate remaining balance after N payments
 * 
 * @param inputs - Loan parameters
 * @param paymentsMade - Number of payments already made
 * @returns Remaining balance
 */
export function calculateRemainingBalance(
  inputs: LoanInputs,
  paymentsMade: number
): number {
  if (paymentsMade >= inputs.termMonths) return 0;
  
  const monthlyPayment = calculateMonthlyPayment(
    inputs.principal,
    inputs.interestRate,
    inputs.termMonths
  );
  
  let balance = inputs.principal;
  const monthlyRate = inputs.interestRate / 100 / 12;
  
  for (let i = 0; i < paymentsMade; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;
  }
  
  return Math.max(0, Math.round(balance * 100) / 100);
}
