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

### Investment

#### 10. Compound Interest Calculator
Calculate compound interest growth with various compounding frequencies and contribution timing.

```typescript
import { 
  calculateCompoundInterest, 
  compareCompoundInterestScenarios,
  calculateEffectiveAnnualRate,
  calculateYearsToDouble 
} from '@deanfinancials/calculators';

// Calculate compound growth
const result = calculateCompoundInterest({
  principal: 10000,
  annualRate: 7,
  years: 30,
  monthlyContribution: 500,
  compoundingFrequency: 'monthly',
  contributionTiming: 'beginning'
});

console.log(result.finalBalance);         // Total ending balance
console.log(result.totalContributions);   // Sum of all contributions
console.log(result.totalInterest);        // Interest earned
console.log(result.effectiveAnnualRate);  // APY
console.log(result.yearlyBreakdown);      // Year-by-year detail

// Compare different scenarios
const scenarios = compareCompoundInterestScenarios(
  { principal: 10000, annualRate: 7, years: 30 },
  [500, 750, 1000]  // Different contribution amounts
);

// Calculate effective annual rate (APY)
const ear = calculateEffectiveAnnualRate(7, 'monthly'); // 7.23%

// Calculate time to double (Rule of 72)
const yearsToDouble = calculateYearsToDouble(7); // ~10.29 years
```

**Compounding Frequencies**: `annually`, `semi-annually`, `quarterly`, `monthly`, `daily`

**Contribution Timing**:
- **Beginning**: Contributions made at start of each period (more growth)
- **End**: Contributions made at end of each period (typical paycheck timing)

**Formulas**:
```
Compound Interest: A = P(1 + r/n)^(nt)
Effective Annual Rate: EAR = (1 + r/n)^n - 1
Rule of 72: Years to Double ≈ 72 / rate
```

#### 11. Net Worth Calculator
Calculate total net worth with comprehensive asset and liability tracking, financial health scoring, and age-based wealth percentile comparisons.

```typescript
import { 
  calculateNetWorth,
  type Asset,
  type Liability,
  type NetWorthInput
} from '@deanfinancials/calculators';

// Define assets
const assets: Asset[] = [
  { category: 'cash', balance: 25000 },
  { category: 'investments', balance: 150000 },
  { category: 'retirement', balance: 350000 },
  { category: 'realEstate', balance: 450000 },
  { category: 'vehicles', balance: 35000 },
  { category: 'personalProperty', balance: 20000 },
  { category: 'businessEquity', balance: 0 },
  { category: 'other', balance: 10000 }
];

// Define liabilities
const liabilities: Liability[] = [
  { category: 'mortgage', balance: 280000 },
  { category: 'autoLoans', balance: 18000 },
  { category: 'studentLoans', balance: 45000 },
  { category: 'creditCards', balance: 5000 },
  { category: 'personalLoans', balance: 0 },
  { category: 'homeEquityLoans', balance: 0 },
  { category: 'medicalDebt', balance: 2000 },
  { category: 'other', balance: 0 }
];

// Calculate net worth with optional age and income for percentile comparison
const result = calculateNetWorth({
  assets,
  liabilities,
  age: 45,
  annualIncome: 120000,
  monthlySavingsRate: 2500,
  expectedReturnRate: 7
});

console.log(result.netWorth);              // Total net worth
console.log(result.totalAssets);           // Sum of all assets
console.log(result.totalLiabilities);      // Sum of all liabilities
console.log(result.liquidAssets);          // Cash + Investments
console.log(result.illiquidAssets);        // Real estate, vehicles, etc.
console.log(result.debtToAssetRatio);      // Liabilities / Assets
console.log(result.assetAllocation);       // Breakdown by category with percentages
console.log(result.liabilityAllocation);   // Breakdown by category with percentages

// Financial health score (0-100 with letter grade)
console.log(result.financialHealth.score);        // 0-100
console.log(result.financialHealth.grade);        // A+, A, A-, B+, B, B-, C+, C, C-, D, F
console.log(result.financialHealth.rating);       // excellent, good, fair, poor, critical
console.log(result.financialHealth.recommendations); // Array of improvement suggestions

// Age-based wealth comparison (if age provided)
console.log(result.wealthPercentile?.percentile);   // e.g., 72 (72nd percentile)
console.log(result.wealthPercentile?.comparison);   // "above average", "below average", etc.
console.log(result.wealthPercentile?.medianWealth); // Median for age group
console.log(result.wealthPercentile?.avgWealth);    // Average for age group

// 10-year projections (if savings rate and return rate provided)
console.log(result.projections);           // Array of year-by-year projections
// Each projection: { year, projectedAssets, projectedLiabilities, projectedNetWorth }
```

**Asset Categories**: `cash`, `investments`, `retirement`, `realEstate`, `vehicles`, `personalProperty`, `businessEquity`, `other`

**Liability Categories**: `mortgage`, `homeEquityLoans`, `autoLoans`, `studentLoans`, `creditCards`, `personalLoans`, `medicalDebt`, `other`

**Financial Health Grades**:
- **A+ to A-**: Excellent (score 90-100, 80-89, 75-79)
- **B+ to B-**: Good (score 70-74, 65-69, 60-64)
- **C+ to C-**: Fair (score 55-59, 50-54, 45-49)
- **D**: Poor (score 40-44)
- **F**: Critical (score below 40)

**Wealth Percentile Data**: Based on Federal Reserve Survey of Consumer Finances (SCF) age-bracketed data

### Budget

#### 11. Savings Goal Calculator
Calculate how much to save monthly to reach any financial goal with milestone tracking.

```typescript
import { 
  calculateSavingsGoal,
  calculateTimeToGoal,
  calculateEmergencyFundGoal,
  calculateDownPaymentGoal,
  compareSavingsScenarios
} from '@deanfinancials/calculators';

// Calculate savings plan for a goal
const result = calculateSavingsGoal({
  goalAmount: 50000,
  currentSavings: 5000,
  yearsToGoal: 3,
  expectedReturnRate: 5,
  contributionFrequency: 'monthly',
  goalType: 'home-down-payment'
});

console.log(result.requiredContribution);  // Amount per contribution period
console.log(result.monthlyContribution);   // Monthly amount needed
console.log(result.totalContributions);    // Sum of all contributions
console.log(result.totalReturns);          // Interest/returns earned
console.log(result.projectedBalance);      // Final balance
console.log(result.milestones);            // 25%, 50%, 75%, 100% markers
console.log(result.yearlyProgress);        // Year-by-year breakdown

// Calculate time needed to reach a goal
const timeToGoal = calculateTimeToGoal(
  50000,  // Goal amount
  5000,   // Current savings
  1000,   // Monthly contribution
  5       // Expected return rate
);
console.log(timeToGoal.years);             // Years to goal
console.log(timeToGoal.months);            // Additional months
console.log(timeToGoal.totalMonths);       // Total months

// Emergency fund calculator (3-6 months expenses)
const emergencyFund = calculateEmergencyFundGoal(
  5000,   // Monthly expenses
  6       // Months of coverage
);
console.log(emergencyFund);                // Target amount: $30,000

// Down payment calculator (with closing costs)
const downPayment = calculateDownPaymentGoal(
  400000, // Home price
  20,     // Down payment percentage (20%)
  true    // Include 3% closing costs
);
console.log(downPayment);                  // Target amount: $92,000

// Compare different savings scenarios
const scenarios = compareSavingsScenarios([
  { goalAmount: 50000, currentSavings: 5000, yearsToGoal: 3, expectedReturnRate: 3 },
  { goalAmount: 50000, currentSavings: 5000, yearsToGoal: 3, expectedReturnRate: 5 },
  { goalAmount: 50000, currentSavings: 5000, yearsToGoal: 3, expectedReturnRate: 7 }
]);
```

**Goal Types**: `emergency-fund`, `home-down-payment`, `vacation`, `car`, `education`, `wedding`, `retirement`, `custom`

**Contribution Frequencies**: `weekly`, `bi-weekly`, `monthly`, `quarterly`, `annually`

**Features**:
- Milestone tracking (25%, 50%, 75%, 100%)
- Year-by-year progress breakdown with status (on-track, ahead, behind)
- Scenario comparison with different contribution levels
- Specialized calculators for emergency funds and down payments
- Achievability warnings for difficult goals

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

### Setup

```bash
# Clone repository
git clone https://github.com/GibsonNeo/deanfi-calculators.git
cd deanfi-calculators

# Install dependencies
npm install

# Build package
npm run build
```

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` directory with:
- ES2020 modules
- Type definitions (.d.ts)
- Source maps

### Testing

```bash
npm test
```

*(Tests are planned but not yet implemented)*

### Local Development with Website

To test changes locally before publishing to npm:

```bash
# In deanfi-calculators directory
npm run build
npm link

# In deanfi-website directory
npm link @deanfinancials/calculators

# Make changes, rebuild, test in website
npm run build  # In calculators repo
# Changes reflected immediately in website

# When done testing, unlink
npm unlink @deanfinancials/calculators  # In website
npm install @deanfinancials/calculators  # Install published version
```

### Publishing Updates

**Prerequisites:**
- npm account with access to @deanfinancials organization
- Authenticated with `npm adduser --auth-type=legacy` (recommended for WSL)

**Steps:**

```bash
# 1. Make changes to source files
# 2. Build and verify
npm run build

# 3. Update version (choose one)
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)

# 4. Dry run (optional but recommended)
npm publish --dry-run

# 5. Publish to npm
npm publish --access public

# 6. Verify publication
# Visit https://www.npmjs.com/package/@deanfinancials/calculators

# 7. Update consumer projects (CRITICAL - DO NOT SKIP)
cd /path/to/deanfi-website

# Update package.json to new version
# Edit: "@deanfinancials/calculators": "^1.0.1"
# Or use npm:
npm install @deanfinancials/calculators@latest

# Verify update
npm list @deanfinancials/calculators

# Test the website
npm run dev
# Visit calculator pages and test

# Commit the updates
git add package.json package-lock.json
git commit -m "chore: update @deanfinancials/calculators to v1.0.1"
git push
```

**Important Notes:**
- The `prepublishOnly` script automatically runs `npm run build`
- Always verify `dist/index.js` has `.js` extensions in imports before publishing
- **CRITICAL:** After EVERY publish, update ALL consumer projects (deanfi-website, etc.)
- Update both `package.json` AND `package-lock.json` in consumers
- Test thoroughly before deploying consumer projects
- Skipping consumer updates will cause production to use stale versions

### Version Management

This package follows [Semantic Versioning](https://semver.org/):

- **PATCH** (1.0.x): Bug fixes, documentation updates
- **MINOR** (1.x.0): New calculators, new features (backwards compatible)
- **MAJOR** (x.0.0): Breaking changes to existing calculator APIs

See [CHANGELOG_AND_IMPLEMENTATION_LOG.md](./CHANGELOG_AND_IMPLEMENTATION_LOG.md) for version history.

### Type Checking

TypeScript strict mode is enabled. Verify types compile:

```bash
npm run build
```

## Contributing

Found a calculation error? Have a suggestion? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Important**: Changes to calculator logic must match updates made to the DeanFinancials.com website. These should stay synchronized.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Related Repositories

- **[deanfi-website](https://github.com/DeanFinancials/deanfi-website)** - DeanFinancials.com Astro website (primary consumer)
- **[deanfi-collectors](https://github.com/WestMichiganRubyTraining/deanfi-collectors)** - Market data collection scripts
- **[deanfi-data](https://github.com/WestMichiganRubyTraining/deanfi-data)** - Historical market data cache

## Documentation

- **[DEVELOPER_REQUIREMENTS.md](./DEVELOPER_REQUIREMENTS.md)** - Development setup, publishing workflow, best practices
- **[CHANGELOG_AND_IMPLEMENTATION_LOG.md](./CHANGELOG_AND_IMPLEMENTATION_LOG.md)** - Complete version history and technical details
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## Disclaimer

These calculators are for educational and informational purposes only. They are not financial advice. Please consult with a qualified financial advisor for personalized guidance.

---

**Made with transparency by [DeanFinancials.com](https://deanfinancials.com)**
