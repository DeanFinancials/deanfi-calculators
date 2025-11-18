/**
 * Mortgage Calculator
 * 
 * Comprehensive mortgage calculator including principal & interest,
 * property taxes, homeowners insurance, PMI, and HOA fees.
 */

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number; // Annual percentage
  loanTermYears: number;
  propertyTaxRate: number; // Annual percentage of home value
  homeInsurance: number; // Annual cost
  hoaFees: number; // Monthly cost
  extraPayment?: number; // Optional extra monthly payment
}

export interface MortgageAmortizationEntry {
  month: number;
  year: number;
  payment: number; // P&I only
  principal: number;
  interest: number;
  taxes: number;
  insurance: number;
  pmi: number;
  hoa: number;
  totalPayment: number; // Including all costs
  balance: number;
  totalInterest: number;
  totalPrincipal: number;
  equity: number;
  equityPercentage: number;
}

export interface MortgageSummary {
  loanAmount: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  monthlyPrincipalInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  requiresPMI: boolean;
  schedule: MortgageAmortizationEntry[];
}

/**
 * Calculate monthly PMI amount
 * 
 * PMI is required when down payment < 20%
 * Typical PMI is 0.5% - 1% of loan amount annually
 * Average: 0.75% annually = 0.0625% monthly
 * 
 * @param loanAmount - Mortgage principal
 * @param homeValue - Home price
 * @returns Monthly PMI amount (0 if down payment >= 20%)
 */
function calculateMonthlyPMI(loanAmount: number, homeValue: number): number {
  const downPaymentPercentage = ((homeValue - loanAmount) / homeValue) * 100;
  
  if (downPaymentPercentage >= 20) {
    return 0;
  }
  
  // PMI rate: 0.75% annually
  const annualPMI = loanAmount * 0.0075;
  return annualPMI / 12;
}

/**
 * Calculate comprehensive mortgage amortization with all costs
 * 
 * Includes:
 * - Principal & Interest (standard amortization)
 * - Property Taxes (based on home value)
 * - Homeowners Insurance
 * - PMI (if down payment < 20%, removed when equity reaches 20%)
 * - HOA Fees
 * - Extra Payments (reduces principal faster)
 * 
 * @param inputs - Mortgage parameters
 * @returns Complete mortgage summary and amortization schedule
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageSummary {
  const loanAmount = inputs.homePrice - inputs.downPayment;
  const downPaymentPercentage = (inputs.downPayment / inputs.homePrice) * 100;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const termMonths = inputs.loanTermYears * 12;
  
  // Calculate base P&I payment
  let monthlyPI: number;
  if (inputs.interestRate === 0) {
    monthlyPI = loanAmount / termMonths;
  } else {
    monthlyPI = loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }
  
  // Calculate monthly costs
  const monthlyTaxes = (inputs.homePrice * inputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = inputs.homeInsurance / 12;
  const monthlyHOA = inputs.hoaFees;
  let monthlyPMI = calculateMonthlyPMI(loanAmount, inputs.homePrice);
  const requiresPMI = monthlyPMI > 0;
  
  const schedule: MortgageAmortizationEntry[] = [];
  let balance = loanAmount;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let month = 0;
  
  while (balance > 0.01 && month < termMonths) {
    month++;
    
    // Calculate interest for this month
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPI - interestPayment;
    
    // Add extra payment to principal
    if (inputs.extraPayment) {
      principalPayment += inputs.extraPayment;
    }
    
    // Don't pay more than remaining balance
    principalPayment = Math.min(principalPayment, balance);
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    
    // Calculate equity
    const equity = inputs.homePrice - balance;
    const equityPercentage = (equity / inputs.homePrice) * 100;
    
    // Remove PMI once equity reaches 20%
    if (equityPercentage >= 20) {
      monthlyPMI = 0;
    }
    
    const totalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA;
    
    schedule.push({
      month,
      year: Math.floor((month - 1) / 12) + 1,
      payment: Math.round(monthlyPI * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      taxes: Math.round(monthlyTaxes * 100) / 100,
      insurance: Math.round(monthlyInsurance * 100) / 100,
      pmi: Math.round(monthlyPMI * 100) / 100,
      hoa: Math.round(monthlyHOA * 100) / 100,
      totalPayment: Math.round(totalMonthly * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      equity: Math.round(equity * 100) / 100,
      equityPercentage: Math.round(equityPercentage * 10) / 10
    });
  }
  
  // Calculate initial monthly PMI for summary
  const initialMonthlyPMI = calculateMonthlyPMI(loanAmount, inputs.homePrice);
  const initialTotalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance + initialMonthlyPMI + monthlyHOA;
  
  // Calculate total cost over life of loan
  const totalPIPayments = monthlyPI * schedule.length;
  const totalTaxPayments = monthlyTaxes * schedule.length;
  const totalInsurancePayments = monthlyInsurance * schedule.length;
  const totalPMIPayments = schedule.reduce((sum, entry) => sum + entry.pmi, 0);
  const totalHOAPayments = monthlyHOA * schedule.length;
  const totalCost = totalPIPayments + totalTaxPayments + totalInsurancePayments + totalPMIPayments + totalHOAPayments;
  
  return {
    loanAmount: Math.round(loanAmount),
    downPaymentAmount: Math.round(inputs.downPayment),
    downPaymentPercentage: Math.round(downPaymentPercentage * 10) / 10,
    monthlyPrincipalInterest: Math.round(monthlyPI),
    monthlyTaxes: Math.round(monthlyTaxes),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyPMI: Math.round(initialMonthlyPMI),
    monthlyHOA: Math.round(monthlyHOA),
    totalMonthlyPayment: Math.round(initialTotalMonthly),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
    requiresPMI,
    schedule
  };
}

/**
 * Calculate how much house you can afford
 * 
 * Uses 28/36 rule:
 * - Front-end ratio: Housing costs ≤ 28% of gross income
 * - Back-end ratio: All debts ≤ 36% of gross income
 * 
 * @param monthlyIncome - Gross monthly income
 * @param monthlyDebts - Other monthly debt obligations
 * @param downPayment - Available down payment
 * @param interestRate - Expected mortgage rate
 * @param loanTermYears - Loan term in years
 * @returns Maximum affordable home price
 */
export function calculateAffordableHome(
  monthlyIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: number = 30
): number {
  // Maximum housing payment (28% of income)
  const maxHousingPayment = monthlyIncome * 0.28;
  
  // Maximum total debt (36% of income)
  const maxTotalDebt = monthlyIncome * 0.36;
  const maxMortgagePayment = maxTotalDebt - monthlyDebts;
  
  // Use the more conservative limit
  const affordablePayment = Math.min(maxHousingPayment, maxMortgagePayment);
  
  // Assume taxes + insurance = 25% of P&I
  const affordablePIPayment = affordablePayment * 0.75;
  
  // Calculate affordable loan amount
  const monthlyRate = interestRate / 100 / 12;
  const termMonths = loanTermYears * 12;
  
  let affordableLoan: number;
  if (interestRate === 0) {
    affordableLoan = affordablePIPayment * termMonths;
  } else {
    affordableLoan = affordablePIPayment *
      (Math.pow(1 + monthlyRate, termMonths) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths));
  }
  
  const affordableHomePrice = affordableLoan + downPayment;
  
  return Math.round(affordableHomePrice);
}
