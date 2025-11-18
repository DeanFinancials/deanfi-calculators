/**
 * Debt Payoff Calculator
 * 
 * Calculates debt payoff timelines using avalanche (highest interest first)
 * or snowball (smallest balance first) strategies.
 */

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number; // Annual percentage
  minimumPayment: number;
}

export interface PayoffResult {
  strategy: 'avalanche' | 'snowball';
  monthsToPayoff: number;
  totalInterestPaid: number;
  payoffDate: Date;
  monthlySnapshots: MonthlySnapshot[];
}

export interface MonthlySnapshot {
  month: number;
  debts: DebtSnapshot[];
  totalBalance: number;
  interestPaid: number;
}

export interface DebtSnapshot {
  id: string;
  name: string;
  balance: number;
}

/**
 * Calculate debt payoff using avalanche or snowball method
 * 
 * Avalanche: Pay off highest interest rate first (minimizes interest)
 * Snowball: Pay off smallest balance first (psychological wins)
 * 
 * Process each month:
 * 1. Add interest to all balances
 * 2. Pay minimums on all debts
 * 3. Apply extra payment to target debt
 * 
 * @param debts - Array of debts to pay off
 * @param extraPayment - Additional payment beyond minimums
 * @param strategy - 'avalanche' or 'snowball'
 * @returns Detailed payoff results
 */
export function calculateDebtPayoff(
  debts: Debt[],
  extraPayment: number,
  strategy: 'avalanche' | 'snowball'
): PayoffResult {
  // Create working copy and sort by strategy
  let workingDebts = debts.map(d => ({ ...d }));
  
  if (strategy === 'avalanche') {
    // Highest interest rate first
    workingDebts.sort((a, b) => b.interestRate - a.interestRate);
  } else {
    // Smallest balance first
    workingDebts.sort((a, b) => a.balance - b.balance);
  }
  
  const monthlySnapshots: MonthlySnapshot[] = [];
  let month = 0;
  let totalInterestPaid = 0;
  const totalMinimums = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const monthlyPayment = totalMinimums + extraPayment;
  
  // Simulate month by month
  while (workingDebts.some(d => d.balance > 0)) {
    month++;
    
    // Step 1: Add interest to all balances
    workingDebts.forEach(debt => {
      if (debt.balance > 0) {
        const monthlyInterest = (debt.balance * debt.interestRate / 100) / 12;
        debt.balance += monthlyInterest;
        totalInterestPaid += monthlyInterest;
      }
    });
    
    // Step 2: Apply minimum payments
    let remainingPayment = monthlyPayment;
    workingDebts.forEach(debt => {
      if (debt.balance > 0) {
        const payment = Math.min(debt.minimumPayment, debt.balance, remainingPayment);
        debt.balance -= payment;
        remainingPayment -= payment;
      }
    });
    
    // Step 3: Apply extra payment to target debt (first with balance > 0)
    const targetDebt = workingDebts.find(d => d.balance > 0);
    if (targetDebt && remainingPayment > 0) {
      const extraPaymentAmount = Math.min(remainingPayment, targetDebt.balance);
      targetDebt.balance -= extraPaymentAmount;
    }
    
    // Record snapshot
    monthlySnapshots.push({
      month,
      debts: workingDebts.map(d => ({
        id: d.id,
        name: d.name,
        balance: Math.max(0, Math.round(d.balance))
      })),
      totalBalance: Math.round(workingDebts.reduce((sum, d) => sum + Math.max(0, d.balance), 0)),
      interestPaid: Math.round(totalInterestPaid)
    });
    
    // Safety check (max 50 years)
    if (month > 600) break;
  }
  
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);
  
  return {
    strategy,
    monthsToPayoff: month,
    totalInterestPaid: Math.round(totalInterestPaid),
    payoffDate,
    monthlySnapshots
  };
}

/**
 * Compare avalanche vs snowball strategies
 * 
 * @param debts - Array of debts
 * @param extraPayment - Additional payment beyond minimums
 * @returns Results for both strategies
 */
export function comparePayoffStrategies(
  debts: Debt[],
  extraPayment: number
): { avalanche: PayoffResult; snowball: PayoffResult } {
  return {
    avalanche: calculateDebtPayoff(debts, extraPayment, 'avalanche'),
    snowball: calculateDebtPayoff(debts, extraPayment, 'snowball')
  };
}
