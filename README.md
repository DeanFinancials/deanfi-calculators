# DeanFinancials Calculator Library

**Transparent financial calculators used on DeanFinancials.com**

This library contains the exact calculation logic used on the DeanFinancials.com website, allowing for public verification of accuracy. All calculators are implemented as pure TypeScript functions with no external dependencies.

## Purpose

This repository exists for **transparency**. Anyone can review the exact formulas and logic used for financial calculations on DeanFinancials.com. This allows:

- **Verification** - Confirm calculations are mathematically sound
- **Trust** - See exactly how numbers are derived
- **Education** - Learn the formulas behind common financial calculations
- **Reproducibility** - Run the same calculations independently

## Installation

```bash
npm install @deanfinancials/calculators
```

## Available Calculators

### Retirement Planning

#### 1. Retirement Savings Calculator
Calculate projected retirement balance with compound interest.

```typescript
import { calculateRetirementBalance, calculateDetailedProjection } from '@deanfinancials/calculators';

// Simple balance projection
const balance = calculateRetirementBalance({
  currentAge: 30,
  retirementAge: 65,
  currentBalance: 50000,
  monthlyContribution: 500,
  annualReturn: 7,
  inflationRate: 2.5
});

// Detailed year-by-year projection
const projection = calculateDetailedProjection({
  currentAge: 30,
  retirementAge: 65,
  currentBalance: 50000,
  monthlyContribution: 500,
  annualReturn: 7,
  inflationRate: 2.5
});
```

**Formula**: Compound interest with monthly contributions
```
FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
```

#### 2. Withdrawal Strategy Calculator
Compare fixed vs dynamic withdrawal strategies in retirement.

```typescript
import { calculateWithdrawalStrategy } from '@deanfinancials/calculators';

const simulation = calculateWithdrawalStrategy({
  startingBalance: 1000000,
  annualReturn: 7,
  inflationRate: 2.5,
  yearsInRetirement: 30,
  withdrawalType: 'fixed', // or 'dynamic'
  fixedWithdrawalAmount: 40000,
  dynamicWithdrawalRate: 4
});

console.log(simulation.successProbability); // Based on Trinity Study
console.log(simulation.yearlyData); // Year-by-year projections
```

**Methods**:
- **Fixed**: Same dollar amount adjusted for inflation
- **Dynamic**: Percentage of remaining balance (recalculates annually)

#### 3. Social Security Calculator
Calculate benefits based on claiming age using official SSA rules.

```typescript
import { calculateClaimingStrategy, calculateBreakEven } from '@deanfinancials/calculators';

const strategy = calculateClaimingStrategy({
  monthlyBenefitAtFRA: 2000,
  birthYear: 1960,
  claimAge: 70
});

const breakEven = calculateBreakEven({
  monthlyBenefitAtFRA: 2000,
  birthYear: 1960,
  earlyClaimAge: 62,
  lateClaimAge: 70
});
```

**SSA Rules**:
- **Full Retirement Age (FRA)**: 67 for those born 1960+
- **Early claiming**: 5/9% reduction per month (first 36 months), then 5/12% per month
- **Delayed credits**: 8% increase per year after FRA (until age 70)

#### 4. 401(k) vs IRA Comparison
Compare Traditional and Roth accounts with employer match.

```typescript
import { compareAllAccounts } from '@deanfinancials/calculators';

const comparison = compareAllAccounts({
  currentAge: 30,
  retirementAge: 65,
  annualContribution: 6000,
  employerMatch: 0.5, // 50% match
  employerMatchLimit: 0.06, // Up to 6% of salary
  annualSalary: 100000,
  annualReturn: 7,
  currentTaxRate: 22,
  retirementTaxRate: 15
});

console.log(comparison.traditional401k);
console.log(comparison.roth401k);
console.log(comparison.traditionalIRA);
console.log(comparison.rothIRA);
```

**Key Differences**:
- **Traditional**: Tax deduction now, taxed in retirement
- **Roth**: After-tax contributions, tax-free withdrawals
- **401(k)**: Employer match available
- **IRA**: No employer match

### Debt Management

#### 5. Debt Payoff Strategy
Compare avalanche (highest interest first) vs snowball (smallest balance first) methods.

```typescript
import { calculateDebtPayoff, comparePayoffStrategies } from '@deanfinancials/calculators';

const debts = [
  { name: 'Credit Card 1', balance: 5000, interestRate: 18, minimumPayment: 150 },
  { name: 'Credit Card 2', balance: 3000, interestRate: 24, minimumPayment: 90 },
  { name: 'Car Loan', balance: 15000, interestRate: 5, minimumPayment: 300 }
];

const comparison = comparePayoffStrategies({
  debts,
  extraPayment: 500
});

console.log(comparison.avalanche); // Saves more on interest
console.log(comparison.snowball); // Faster psychological wins
```

**Strategies**:
- **Avalanche**: Target highest interest rate (saves most money)
- **Snowball**: Target smallest balance (motivational wins)

#### 6. Debt-to-Income Ratio
Calculate DTI for mortgage qualification.

```typescript
import { calculateDTI } from '@deanfinancials/calculators';

const dti = calculateDTI({
  monthlyIncome: 8000,
  monthlyHousingCosts: 2000,
  monthlyDebtPayments: 800
});

console.log(dti.frontEndRatio); // Housing / Income
console.log(dti.backEndRatio); // All debts / Income
console.log(dti.rating); // excellent, good, fair, poor, concerning
```

**Benchmarks**:
- **Excellent**: ≤20%
- **Good**: ≤36% (conventional loan standard)
- **Fair**: ≤43% (FHA loan limit)
- **Poor**: ≤50%

#### 7. Credit Card Payoff
Compare minimum payment vs fixed payment strategies.

```typescript
import { compareCreditCardStrategies } from '@deanfinancials/calculators';

const comparison = compareCreditCardStrategies({
  balance: 5000,
  interestRate: 18,
  minimumPaymentPercentage: 2,
  minimumPaymentFloor: 25,
  fixedPayment: 200
});

console.log(comparison.minimumPayment.monthsToPayoff);
console.log(comparison.fixedPayment.monthsToPayoff);
console.log(comparison.interestSavings);
```

**Minimum Payment Formula**:
```
max(balance × percentage, floor amount)
```

#### 8. Loan Calculator
Calculate monthly payments and amortization schedule.

```typescript
import { calculateMonthlyPayment, calculateLoanAmortization } from '@deanfinancials/calculators';

const payment = calculateMonthlyPayment({
  principal: 20000,
  interestRate: 5,
  termMonths: 60
});

const amortization = calculateLoanAmortization({
  principal: 20000,
  interestRate: 5,
  termMonths: 60,
  extraPayment: 100
});
```

**Monthly Payment Formula**:
```
M = P × [r(1 + r)^n] / [(1 + r)^n - 1]

Where:
M = Monthly payment
P = Principal
r = Monthly interest rate
n = Number of months
```

#### 9. Mortgage Calculator
Comprehensive mortgage calculator with P&I, taxes, insurance, PMI, and HOA.

```typescript
import { calculateMortgage, calculateAffordableHome } from '@deanfinancials/calculators';

const mortgage = calculateMortgage({
  homePrice: 400000,
  downPayment: 80000, // 20%
  interestRate: 6.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2,
  homeInsurance: 1200,
  hoaFees: 0,
  extraPayment: 200
});

console.log(mortgage.monthlyPrincipalInterest);
console.log(mortgage.totalMonthlyPayment); // Includes PITI
console.log(mortgage.requiresPMI); // false (20% down)

// Calculate affordable home price
const affordable = calculateAffordableHome(
  8000, // Monthly income
  500,  // Other debts
  80000, // Down payment
  6.5,  // Interest rate
  30    // Term years
);
```

**PMI Rules**:
- Required when down payment < 20%
- Typically 0.5% - 1% of loan amount annually
- Automatically removed when equity reaches 20%

**28/36 Rule** (affordability):
- Housing costs ≤ 28% of gross income
- All debts ≤ 36% of gross income

## Formulas & Methodology

All calculations use industry-standard formulas:

### Compound Interest
```
FV = PV × (1 + r)^n
```
- **FV**: Future Value
- **PV**: Present Value  
- **r**: Interest rate per period
- **n**: Number of periods

### Amortization
```
M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
```
- **M**: Monthly payment
- **P**: Principal
- **r**: Monthly interest rate
- **n**: Total months

### Social Security Adjustments
- **Early claiming**: 5/9% reduction per month (first 36), 5/12% after
- **Delayed credits**: 2/3% per month after FRA (8% annually)

## Transparency Commitment

**These are the exact formulas used on DeanFinancials.com.** No simplifications, no approximations. You can:

1. **Compare outputs** - Run these calculators and verify they match the website
2. **Review the code** - All logic is in `src/` with comprehensive comments
3. **Audit the math** - Every formula is documented with sources
4. **Report discrepancies** - Open an issue if you find any calculation errors

## Development

### Building

```bash
npm install
npm run build
```

Compiles TypeScript to JavaScript in `dist/` directory.

### Testing

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

## Contributing

Found a calculation error? Have a suggestion? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Important**: Changes to calculator logic must match updates made to the DeanFinancials.com website. These should stay synchronized.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Related Repositories

- **[deanfi-collectors](https://github.com/WestMichiganRubyTraining/deanfi-collectors)** - Market data collection scripts
- **[deanfi-data](https://github.com/WestMichiganRubyTraining/deanfi-data)** - Historical market data cache

## Disclaimer

These calculators are for educational and informational purposes only. They are not financial advice. Please consult with a qualified financial advisor for personalized guidance.

---

**Made with transparency by [DeanFinancials.com](https://deanfinancials.com)**
