/**
 * Retirement Withdrawal Strategy Calculator
 * 
 * Simulates different withdrawal strategies during retirement including
 * fixed percentage and dynamic rules-based approaches.
 */

export interface WithdrawalInputs {
  startingBalance: number;
  withdrawalRate: number; // Annual withdrawal as percentage (e.g., 4 for 4%)
  currentAge: number;
  expectedLifespan: number; // Age of death assumption
  inflationRate: number; // Annual inflation percentage
  expectedReturn: number; // Annual return percentage
  strategyType: 'fixed' | 'dynamic';
}

export interface WithdrawalResult {
  depletionAge: number | null; // Age when funds run out, null if never
  totalWithdrawn: number;
  finalBalance: number;
  successProbability: number; // Based on historical success rates
  yearlySnapshots: WithdrawalSnapshot[];
}

export interface WithdrawalSnapshot {
  year: number;
  age: number;
  beginningBalance: number;
  withdrawal: number;
  endingBalance: number;
  cumulativeWithdrawn: number;
}

/**
 * Calculate retirement withdrawal strategy outcomes
 * 
 * Fixed strategy: Withdraw percentage of starting balance, adjusted for inflation
 * Dynamic strategy: Recalculate withdrawal as percentage of current balance each year
 * 
 * @param inputs - Withdrawal strategy parameters
 * @returns Detailed simulation results
 */
export function calculateWithdrawalStrategy(inputs: WithdrawalInputs): WithdrawalResult {
  const yearsInRetirement = inputs.expectedLifespan - inputs.currentAge;
  const annualReturn = inputs.expectedReturn / 100;
  const inflationRate = inputs.inflationRate / 100;
  const realReturn = (1 + annualReturn) / (1 + inflationRate) - 1; // Inflation-adjusted return
  
  const snapshots: WithdrawalSnapshot[] = [];
  let balance = inputs.startingBalance;
  let totalWithdrawn = 0;
  let depletionAge: number | null = null;
  
  // Initial withdrawal amount (first year)
  const initialWithdrawal = inputs.startingBalance * (inputs.withdrawalRate / 100);
  let currentWithdrawal = initialWithdrawal;
  
  for (let year = 0; year < yearsInRetirement; year++) {
    const age = inputs.currentAge + year;
    const beginningBalance = balance;
    
    // Determine withdrawal amount based on strategy
    if (inputs.strategyType === 'dynamic') {
      // Recalculate based on current balance
      currentWithdrawal = balance * (inputs.withdrawalRate / 100);
    } else {
      // Fixed: Adjust previous withdrawal by inflation
      if (year > 0) {
        currentWithdrawal = currentWithdrawal * (1 + inflationRate);
      }
    }
    
    // Check if we can afford the withdrawal
    const actualWithdrawal = Math.min(currentWithdrawal, balance);
    balance -= actualWithdrawal;
    totalWithdrawn += actualWithdrawal;
    
    // Apply investment returns on remaining balance
    balance = balance * (1 + annualReturn);
    
    snapshots.push({
      year,
      age,
      beginningBalance: Math.round(beginningBalance),
      withdrawal: Math.round(actualWithdrawal),
      endingBalance: Math.round(balance),
      cumulativeWithdrawn: Math.round(totalWithdrawn)
    });
    
    // Check for depletion
    if (balance <= 0 && depletionAge === null) {
      depletionAge = age;
      balance = 0; // Floor at zero
    }
  }
  
  // Calculate success probability based on withdrawal rate
  // Historical data (Trinity Study): 4% = 95%, 5% = 75%, 6% = 50%, 7%+ = 25%
  let successProbability: number;
  if (inputs.withdrawalRate <= 4) {
    successProbability = 95;
  } else if (inputs.withdrawalRate <= 5) {
    successProbability = 75;
  } else if (inputs.withdrawalRate <= 6) {
    successProbability = 50;
  } else {
    successProbability = 25;
  }
  
  // Adjust for depletion
  if (depletionAge !== null) {
    const yearsBeforeDepletion = depletionAge - inputs.currentAge;
    const percentageOfLifespan = yearsBeforeDepletion / yearsInRetirement;
    successProbability = Math.min(successProbability, percentageOfLifespan * 100);
  }
  
  return {
    depletionAge,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    successProbability: Math.round(successProbability),
    yearlySnapshots: snapshots
  };
}

/**
 * Compare multiple withdrawal strategies side by side
 * 
 * @param scenarios - Array of withdrawal strategy inputs
 * @returns Array of results for comparison
 */
export function compareWithdrawalStrategies(scenarios: WithdrawalInputs[]): WithdrawalResult[] {
  return scenarios.map(scenario => calculateWithdrawalStrategy(scenario));
}
