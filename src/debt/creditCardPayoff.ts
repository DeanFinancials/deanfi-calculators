/**
 * Credit Card Payoff Calculator
 * 
 * Calculates payoff scenarios for credit card debt including
 * minimum payment only vs fixed payment strategies.
 */

export interface CreditCardInputs {
  balance: number;
  interestRate: number; // Annual percentage
  minimumPaymentPercentage: number; // e.g., 2 for 2%
  minimumPaymentFloor: number; // Minimum dollar amount (e.g., $25)
}

export interface PayoffScenario {
  strategy: 'minimum' | 'fixed' | 'aggressive';
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlyPayment: number;
  payoffDate: Date;
  monthlySnapshots: MonthlySnapshot[];
}

export interface MonthlySnapshot {
  month: number;
  balance: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterestPaid: number;
}

/**
 * Calculate credit card payoff timeline
 * 
 * Formula each month:
 * - Interest charge = balance × (APR / 12)
 * - New balance = balance + interest
 * - Minimum payment = max(balance × min%, floor)
 * - Principal = payment - interest
 * - New balance = balance - principal
 * 
 * @param inputs - Credit card parameters
 * @param fixedPayment - Optional fixed monthly payment (if not using minimums)
 * @returns Detailed payoff scenario
 */
export function calculateCreditCardPayoff(
  inputs: CreditCardInputs,
  fixedPayment?: number
): PayoffScenario {
  const monthlyRate = inputs.interestRate / 100 / 12;
  let balance = inputs.balance;
  let totalInterestPaid = 0;
  const monthlySnapshots: MonthlySnapshot[] = [];
  let month = 0;
  
  const isMinimumOnly = !fixedPayment;
  let strategy: PayoffScenario['strategy'];
  
  if (isMinimumOnly) {
    strategy = 'minimum';
  } else if (fixedPayment && fixedPayment > inputs.balance * 0.05) {
    strategy = 'aggressive';
  } else {
    strategy = 'fixed';
  }
  
  while (balance > 0.01 && month < 600) { // Max 50 years
    month++;
    
    // Calculate interest for this month
    const interestCharge = balance * monthlyRate;
    balance += interestCharge;
    
    // Determine payment amount
    let payment: number;
    if (isMinimumOnly) {
      const percentageMin = balance * (inputs.minimumPaymentPercentage / 100);
      payment = Math.max(percentageMin, inputs.minimumPaymentFloor);
      payment = Math.min(payment, balance); // Can't pay more than balance
    } else {
      payment = Math.min(fixedPayment!, balance);
    }
    
    // Calculate principal portion
    const principal = payment - interestCharge;
    
    // Update balance
    balance -= principal;
    totalInterestPaid += interestCharge;
    
    monthlySnapshots.push({
      month,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      payment: Math.round(payment * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interestCharge * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100
    });
  }
  
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);
  
  const totalPaid = inputs.balance + totalInterestPaid;
  const avgMonthlyPayment = totalPaid / month;
  
  return {
    strategy,
    monthsToPayoff: month,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalPaid: Math.round(totalPaid),
    monthlyPayment: Math.round(avgMonthlyPayment),
    payoffDate,
    monthlySnapshots
  };
}

/**
 * Compare minimum payment vs fixed payment strategies
 * 
 * @param inputs - Credit card parameters
 * @param fixedPaymentAmount - Monthly payment amount to compare
 * @returns Comparison of both strategies
 */
export function compareCreditCardStrategies(
  inputs: CreditCardInputs,
  fixedPaymentAmount: number
): { minimum: PayoffScenario; fixed: PayoffScenario } {
  return {
    minimum: calculateCreditCardPayoff(inputs),
    fixed: calculateCreditCardPayoff(inputs, fixedPaymentAmount)
  };
}
