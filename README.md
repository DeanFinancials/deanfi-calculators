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

#### 5. RMD Calculator (Required Minimum Distribution)
Calculate required minimum distributions from retirement accounts using IRS life expectancy tables, with multi-year projections, spouse beneficiary rules, and tax impact analysis.

```typescript
import { 
  calculateRMD,
  calculateMultipleAccountRMDs,
  estimateRMDTaxImpact,
  analyzeQCDOpportunity,
  getRMDStartAge,
  type RMDInputs,
  type RMDResult,
  type YearlyRMDProjection,
  UNIFORM_LIFETIME_TABLE,
  JOINT_LIFE_TABLE
} from '@deanfinancials/calculators';

// Calculate RMD for a single account
const result = calculateRMD({
  birthYear: 1955,
  accountBalance: 500000,
  spouseBirthYear: 1970,              // Optional: spouse's birth year
  spouseIsSoleBeneficiary: true,       // Optional: spouse is sole beneficiary
  expectedReturnRate: 0.06,            // 6% expected return
  projectionYears: 20,                 // Project 20 years forward
  accountType: 'traditional_ira'       // Account type
});

console.log(result.currentRMD);              // Current year's required distribution
console.log(result.distributionPeriod);       // Life expectancy factor used
console.log(result.currentAge);               // Account holder's current age
console.log(result.rmdStartAge);              // Age when RMDs begin (73 or 75)
console.log(result.rmdStartYear);             // Year when RMDs begin
console.log(result.rmdRequired);              // Whether RMDs are currently required
console.log(result.yearsUntilRMD);            // Years until first RMD (0 if required)
console.log(result.usingJointLifeTable);      // True if spouse >10 years younger
console.log(result.firstRMDDeadline);         // "April 1, 2029" or similar
console.log(result.rmdPercentage);            // RMD as % of balance
console.log(result.penaltyRate);              // 25% penalty for missed RMDs
console.log(result.warnings);                 // Important notices

// Year-by-year projections
console.log(result.projections);              // Array of YearlyRMDProjection
// Each projection: { year, age, startBalance, rmd, distributionPeriod, 
//                    rmdPercentage, endBalance, growth, isFirstRMDYear, deadline }
console.log(result.totalProjectedRMDs);       // Sum of all projected RMDs
console.log(result.totalProjectedGrowth);     // Sum of all projected growth
console.log(result.finalProjectedBalance);    // Ending balance after projections

// Calculate RMDs across multiple accounts
const multiAccount = calculateMultipleAccountRMDs([
  { birthYear: 1955, accountBalance: 300000, accountType: 'traditional_ira', accountLabel: 'Traditional IRA' },
  { birthYear: 1955, accountBalance: 200000, accountType: '401k', accountLabel: 'Old 401(k)' }
]);

console.log(multiAccount.totalRMD);           // Combined RMD across all accounts
console.log(multiAccount.totalBalance);       // Total balance across accounts
console.log(multiAccount.accounts);           // Individual account results
console.log(multiAccount.combinedProjections); // Aggregated year-by-year projections
console.log(multiAccount.warnings);           // Including IRA aggregation note

// Estimate tax impact of RMD
const taxImpact = estimateRMDTaxImpact(
  20000,          // RMD amount
  50000,          // Other taxable income
  'married_joint' // Filing status
);

console.log(taxImpact.federalTax);     // Estimated federal tax on RMD
console.log(taxImpact.marginalRate);   // Your marginal tax bracket
console.log(taxImpact.effectiveRate);  // Effective rate on RMD
console.log(taxImpact.stateNote);      // Note about state taxes

// Analyze QCD (Qualified Charitable Distribution) opportunity
const qcdAnalysis = analyzeQCDOpportunity(
  1952,           // Birth year (must be 70.5+)
  25000,          // RMD amount
  0.24            // Marginal tax rate
);

console.log(qcdAnalysis.qcdAvailable);        // Whether eligible for QCD
console.log(qcdAnalysis.maxQCDAmount);        // $105,000 (2024 limit)
console.log(qcdAnalysis.rmdSatisfiedByQCD);   // Amount of RMD covered by QCD
console.log(qcdAnalysis.potentialTaxSavings); // Tax savings if RMD done as QCD
console.log(qcdAnalysis.notes);               // QCD rules and requirements

// Get RMD starting age based on birth year
const startAge = getRMDStartAge(1955);        // 73 (born 1951-1959)
const laterStartAge = getRMDStartAge(1965);   // 75 (born 1960+)
```

**Account Types Requiring RMDs**:
- Traditional IRA, SEP IRA, SIMPLE IRA
- 401(k), 403(b), 457(b)
- Inherited IRA (10-year rule for most beneficiaries)
- Inherited Roth IRA (10-year rule)

**Accounts Exempt from RMDs**:
- Roth IRA (during owner's lifetime)
- Roth 401(k) (exempt starting 2024 per SECURE Act 2.0)

**SECURE Act 2.0 RMD Age Rules**:
| Birth Year | RMD Starting Age |
|------------|------------------|
| 1950 or earlier | 72 |
| 1951-1959 | 73 |
| 1960 or later | 75 |

**Key Deadlines**:
- **First RMD**: Due by April 1 of year after reaching RMD age
- **Subsequent RMDs**: Due by December 31 of each year
- **Penalty**: 25% excise tax (reduced to 10% if corrected within 2 years)

**IRS Life Expectancy Tables**:
- **Uniform Lifetime Table (Table III)**: Default for most account owners
- **Joint Life Table (Table II)**: Used when spouse is sole beneficiary AND more than 10 years younger

**QCD (Qualified Charitable Distribution) Benefits**:
- Available at age 70½ (before RMD age)
- Up to $105,000 per year (2024 limit)
- Counts toward RMD but excluded from taxable income
- Only applies to IRAs (not 401k/403b)

**Features**:
- Full IRS life expectancy tables (Uniform and Joint Life)
- Spouse more than 10 years younger calculation
- Multi-year projections with expected returns
- Multi-account aggregation with IRA combination note
- Tax impact estimation by filing status
- QCD opportunity analysis
- SECURE Act 2.0 compliant age rules
- Penalty rate information

#### 6. Roth IRA Conversion Calculator
Analyze the tax implications of converting Traditional IRA or 401(k) funds to a Roth IRA, with break-even analysis, optimal conversion strategies, bracket-filling recommendations, and multi-year projections.

```typescript
import { 
  calculateRothConversion,
  calculateTaxImpact,
  calculateBreakEvenRoth,
  calculateOptimalConversion,
  calculateBracketFillingAmount,
  generateProjections,
  compareConversionScenarios,
  type RothConversionInputs,
  type RothConversionResult,
  type RothFilingStatus,
  type ConvertibleAccountType,
  type TaxImpact,
  type BreakEvenAnalysis,
  type OptimalConversion,
  type RothYearlyProjection,
  FEDERAL_TAX_BRACKETS_2024,
  FEDERAL_TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS_2024
} from '@deanfinancials/calculators';

// Full Roth conversion analysis
const result = calculateRothConversion({
  // Account information
  traditionalBalance: 500000,              // Current Traditional IRA/401k balance
  conversionAmount: 50000,                 // Amount to convert this year
  accountType: 'traditional_ira',          // Account type being converted
  
  // Personal information
  currentAge: 55,
  retirementAge: 65,
  filingStatus: 'married_joint',
  
  // Income information
  currentTaxableIncome: 120000,            // Other taxable income this year
  retirementTaxableIncome: 60000,          // Expected retirement income
  
  // Tax assumptions
  currentStateTaxRate: 0.05,               // 5% state tax
  retirementStateTaxRate: 0.05,            // May differ if relocating
  taxYear: 2024,
  
  // Growth assumptions
  expectedReturnRate: 0.07,                // 7% annual return
  
  // Optional: source for tax payment
  payTaxFromConversion: false,             // Pay taxes from outside funds (recommended)
  taxPaymentSource: 'external'             // 'external' or 'conversion'
});

// Conversion summary
console.log(result.conversionAmount);           // $50,000
console.log(result.traditionalBalance);         // $500,000 original balance
console.log(result.remainingTraditionalBalance); // $450,000 after conversion

// Tax impact of the conversion
console.log(result.taxImpact.federalTax);       // Federal tax on conversion
console.log(result.taxImpact.stateTax);         // State tax on conversion
console.log(result.taxImpact.totalTax);         // Combined tax due
console.log(result.taxImpact.effectiveRate);    // Effective tax rate on conversion
console.log(result.taxImpact.marginalBracket);  // Tax bracket the conversion pushes you into
console.log(result.taxImpact.bracketStart);     // Where current bracket begins
console.log(result.taxImpact.bracketEnd);       // Where current bracket ends
console.log(result.taxImpact.amountInHigherBracket); // Amount taxed at higher rate

// Break-even analysis
console.log(result.breakEvenAnalysis.breakEvenYears);     // Years until Roth is better
console.log(result.breakEvenAnalysis.totalTaxNow);        // Tax cost of converting now
console.log(result.breakEvenAnalysis.projectedTaxSavings); // Tax savings in retirement
console.log(result.breakEvenAnalysis.netBenefit);         // Net benefit of conversion
console.log(result.breakEvenAnalysis.worthConverting);    // Boolean recommendation

// Optimal conversion recommendation
console.log(result.optimalConversion.recommendedAmount);   // Suggested conversion amount
console.log(result.optimalConversion.reasoning);           // Explanation
console.log(result.optimalConversion.stayInCurrentBracket); // Amount to stay in bracket
console.log(result.optimalConversion.fillNextBracket);     // Amount to fill next bracket
console.log(result.optimalConversion.maxBeforeAGIPenalties); // IRMAA/NIIT thresholds

// Bracket-filling strategy (unique feature!)
console.log(result.bracketFillingStrategy.currentBracket);    // Current tax bracket
console.log(result.bracketFillingStrategy.roomInBracket);     // Space left in current bracket
console.log(result.bracketFillingStrategy.fillToTopOfBracket); // Conversion to fill bracket
console.log(result.bracketFillingStrategy.nextBracketRate);   // Rate if you exceed
console.log(result.bracketFillingStrategy.taxOnFillAmount);   // Tax if you fill bracket

// Multi-year projections
console.log(result.projections);                 // Year-by-year comparison
// Each projection: { year, age, traditionalBalance, rothBalance, 
//                    traditionalWithdrawal, rothWithdrawal,
//                    traditionalTax, rothTax, cumulativeTaxSavings }

// Scenario comparison (no conversion vs partial vs full)
console.log(result.scenarioComparison);
// { noConversion: {...}, partialConversion: {...}, fullConversion: {...}, 
//   recommendation: 'partial', reasoning: '...' }

// Warnings and recommendations
console.log(result.warnings);                    // Important considerations
console.log(result.recommendations);             // Personalized advice

// Calculate tax impact for a specific conversion amount
const taxImpact = calculateTaxImpact(
  50000,              // Conversion amount
  120000,             // Current taxable income
  'married_joint',    // Filing status
  0.05,               // State tax rate
  2024                // Tax year
);

console.log(taxImpact.federalTax);              // $11,000
console.log(taxImpact.totalTax);                // $13,500 (with state)
console.log(taxImpact.effectiveRate);           // 27%

// Calculate break-even point
const breakEven = calculateBreakEvenRoth(
  50000,              // Conversion amount
  13500,              // Tax paid now
  0.07,               // Expected return
  0.22,               // Current marginal rate
  0.15                // Expected retirement rate
);

console.log(breakEven.breakEvenYears);          // ~12 years
console.log(breakEven.worthConverting);         // true

// Calculate optimal conversion (bracket-filling)
const optimal = calculateOptimalConversion(
  120000,             // Current taxable income
  'married_joint',    // Filing status
  2024                // Tax year
);

console.log(optimal.recommendedAmount);         // $81,050 (fills 22% bracket)
console.log(optimal.stayInCurrentBracket);      // Amount to stay in 22%

// Calculate exact bracket-filling amount
const bracketFill = calculateBracketFillingAmount(
  120000,             // Current taxable income
  'married_joint',    // Filing status
  2024                // Tax year
);

console.log(bracketFill.roomInBracket);         // $81,050 until 24% bracket
console.log(bracketFill.fillToTopOfBracket);    // $81,050 recommended conversion
console.log(bracketFill.taxOnFillAmount);       // $17,831 (at 22%)

// Generate multi-year projections
const projections = generateProjections({
  traditionalBalance: 500000,
  rothBalance: 0,
  conversionAmount: 50000,
  currentAge: 55,
  retirementAge: 65,
  expectedReturnRate: 0.07,
  currentTaxRate: 0.22,
  retirementTaxRate: 0.15,
  projectionYears: 20
});

console.log(projections);                       // 20-year projection array

// Compare multiple conversion scenarios
const scenarios = compareConversionScenarios({
  traditionalBalance: 500000,
  currentAge: 55,
  retirementAge: 65,
  currentTaxableIncome: 120000,
  filingStatus: 'married_joint',
  expectedReturnRate: 0.07,
  currentStateTaxRate: 0.05,
  retirementTaxRate: 0.15
}, [0, 25000, 50000, 81050, 100000]);            // Compare different amounts

console.log(scenarios.bestScenario);            // Index of optimal scenario
console.log(scenarios.scenarios);               // Full results for each amount
```

**Filing Statuses**: `single`, `married_joint`, `married_separate`, `head_of_household`

**Account Types**: `traditional_ira`, `401k`, `403b`, `sep_ira`, `simple_ira`

**2024 Federal Tax Brackets (Married Filing Jointly)**:
| Bracket | Income Range | Conversion Strategy |
|---------|--------------|---------------------|
| 10% | $0 - $23,200 | Convert up to bracket top |
| 12% | $23,200 - $94,300 | Good conversion opportunity |
| 22% | $94,300 - $201,050 | Common target bracket |
| 24% | $201,050 - $383,900 | Consider if retirement rate is 22%+ |
| 32%+ | $383,900+ | Usually avoid unless special circumstances |

**Standard Deductions (2024)**:
- Single: $14,600
- Married Filing Jointly: $29,200
- Married Filing Separately: $14,600
- Head of Household: $21,900

**When to Consider Roth Conversion**:
- Lower income year (job loss, early retirement, sabbatical)
- Expect higher tax rates in retirement
- Want tax-free growth for heirs
- Reducing future RMD burden
- Years before RMDs begin (can spread conversions)

**Key Thresholds to Watch**:
- **IRMAA (Medicare Surcharges)**: Income > $103,000 (single) / $206,000 (married)
- **NIIT (3.8% Net Investment Tax)**: Income > $200,000 (single) / $250,000 (married)
- **Capital Gains 0% Rate**: Stay below 12% bracket for 0% LTCG

**Features That Competitors Don't Have**:
- **Bracket-filling strategy**: Exact amount to convert to fill current bracket
- Multi-year projections comparing traditional vs Roth paths
- Scenario comparison (no/partial/full conversion)
- IRMAA and NIIT threshold warnings
- State tax integration
- Break-even analysis with years until benefit
- Account type support (IRA, 401k, 403b, SEP, SIMPLE)
- Tax payment source comparison (internal vs external)

### Debt Management

#### 6. Debt Payoff Strategy
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

#### 7. Debt-to-Income Ratio
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

#### 8. Credit Card Payoff
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

#### 9. Loan Calculator
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

#### 10. Mortgage Calculator
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

#### 11. Compound Interest Calculator
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

#### 13. CD Calculator (Certificate of Deposit)
Calculate CD returns, build CD ladders, estimate early withdrawal penalties, and compare multiple CD options.

```typescript
import { 
  calculateCD,
  buildCDLadder,
  calculateEarlyWithdrawal,
  compareCDScenarios,
  type CDInputs,
  type CDResult,
  type CDLadderResult,
  type EarlyWithdrawalResult,
  type CDComparisonResult,
  type CDCompoundingFrequency,
  TYPICAL_CD_RATES,
  TYPICAL_PENALTIES
} from '@deanfinancials/calculators';

// Calculate a single CD
const cdResult = calculateCD({
  principal: 10000,
  apy: 0.05,              // 5% as decimal
  termMonths: 12,
  compoundingFrequency: 'daily',
  federalTaxRate: 0.22,   // Optional: for after-tax calculations
  stateTaxRate: 0.05,     // Optional: for after-tax calculations
  inflationRate: 0.03     // Optional: for real return calculations
});

console.log(cdResult.maturityValue);      // Final balance at maturity
console.log(cdResult.totalInterest);      // Total interest earned
console.log(cdResult.effectiveAnnualRate); // Actual annual rate with compounding
console.log(cdResult.monthlyBreakdown);   // Month-by-month growth
console.log(cdResult.afterTaxInterest);   // Interest after taxes (if tax rates provided)
console.log(cdResult.realReturn);         // Inflation-adjusted return (if inflation provided)

// Build a CD ladder
const ladder = buildCDLadder(
  50000,    // Total investment
  5,        // Number of rungs (CDs)
  60,       // Maximum term in months (5 years)
  TYPICAL_CD_RATES  // Rate schedule by term
);

console.log(ladder.rungs);                // Individual CDs with terms and rates
console.log(ladder.totalMaturityValue);   // Combined maturity value
console.log(ladder.totalInterest);        // Total interest across all CDs
console.log(ladder.weightedAverageAPY);   // Average rate weighted by amount
console.log(ladder.liquiditySchedule);    // When funds become available

// Calculate early withdrawal penalty
const earlyWithdrawal = calculateEarlyWithdrawal(
  { principal: 10000, apy: 0.05, termMonths: 24, compoundingFrequency: 'daily' },
  6,   // Months held before withdrawal
  { type: 'months-interest', value: 6 }  // 6 months interest penalty
);

console.log(earlyWithdrawal.valueAtWithdrawal);  // Value before penalty
console.log(earlyWithdrawal.penaltyAmount);      // Dollar amount of penalty
console.log(earlyWithdrawal.netAmount);          // What you receive
console.log(earlyWithdrawal.principalLoss);      // Boolean: did you lose principal?
console.log(earlyWithdrawal.effectiveYield);     // Actual yield achieved

// Compare multiple CD options
const comparison = compareCDScenarios([
  { label: 'Online Bank', inputs: { principal: 10000, apy: 0.052, termMonths: 12, compoundingFrequency: 'daily' } },
  { label: 'Credit Union', inputs: { principal: 10000, apy: 0.048, termMonths: 12, compoundingFrequency: 'monthly' } },
  { label: 'Local Bank', inputs: { principal: 10000, apy: 0.045, termMonths: 12, compoundingFrequency: 'quarterly' } }
]);

console.log(comparison.scenarios);        // Full results for each option
console.log(comparison.bestByInterest);   // Index of best CD by interest earned
console.log(comparison.bestByYield);      // Index of best CD by effective yield
console.log(comparison.interestDifference); // Difference between best and worst
```

**Compounding Frequencies**: `daily`, `monthly`, `quarterly`, `semi-annually`, `annually`

**Early Withdrawal Penalty Types**:
- `days-simple`: X days of simple interest (typical for short-term CDs)
- `months-interest`: X months of interest (most common)
- `percent-interest`: X% of earned interest
- `custom`: Custom dollar amount

**Typical Penalties by Term** (included as `TYPICAL_PENALTIES` constant):
| Term | Typical Penalty |
|------|-----------------|
| 3-6 months | 90 days interest |
| 12-18 months | 3 months interest |
| 24-36 months | 6 months interest |
| 48-60 months | 12 months interest |

**Typical CD Rates** (included as `TYPICAL_CD_RATES` constant):
Provides low, average, and high rates for each standard term (1, 3, 6, 9, 12, 18, 24, 36, 48, 60 months).

#### 14. Net Worth Calculator
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

#### 15. Dividend Income Calculator
Calculate dividend income, yield, DRIP (dividend reinvestment) growth, and passive income projections with tax optimization and dividend stability assessment.

```typescript
import { 
  calculateDividendIncome,
  calculateDividendYield,
  quickDividendYield,
  calculateRequiredInvestment,
  assessDividendStability,
  calculateDividendTaxBreakdown,
  compareDividendScenarios,
  estimateYearsToGoal,
  type DividendIncomeInputs,
  type DividendIncomeResult,
  type YearlyDividendProjection,
  type DividendStabilityAssessment,
  type DividendTaxBreakdown,
  type DividendFrequency,
  type DividendTaxFilingStatus,
  type DividendStabilityRating,
  DIVIDEND_TAX_BRACKETS_2024,
  STANDARD_DEDUCTIONS_2024
} from '@deanfinancials/calculators';

// Full dividend income calculation with DRIP
const result = calculateDividendIncome({
  principal: 100000,
  annualDividendYield: 4,                  // 4% yield
  dividendFrequency: 'quarterly',          // How often dividends are paid
  yearsToProject: 20,
  reinvestDividends: true,                 // Enable DRIP
  dividendGrowthRate: 5,                   // 5% annual dividend growth
  additionalInvestmentPerYear: 6000,       // $500/month
  qualifiedDividendPercentage: 80,         // 80% qualified (lower tax)
  taxFilingStatus: 'married-filing-jointly',
  taxableIncome: 150000,
  inflationRate: 3
});

console.log(result.yearlyProjections);            // Year-by-year breakdown
console.log(result.totalDividendsReceived);       // Cumulative dividends over period
console.log(result.finalPortfolioValue);          // Ending portfolio value
console.log(result.effectiveYieldOnCost);         // Yield on original investment
console.log(result.compoundedAnnualGrowthRate);   // CAGR of portfolio
console.log(result.yearlyIncomeAtEnd);            // Annual dividend income at year 20
console.log(result.monthlyIncomeAtEnd);           // Monthly passive income at end

// Tax breakdown
console.log(result.taxBreakdown.qualifiedDividends);   // Amount taxed at lower rate
console.log(result.taxBreakdown.ordinaryDividends);    // Amount taxed at ordinary rate
console.log(result.taxBreakdown.qualifiedTaxRate);     // Applied qualified rate (0%, 15%, 20%)
console.log(result.taxBreakdown.estimatedTax);         // Annual tax liability
console.log(result.taxBreakdown.afterTaxIncome);       // Net income after taxes

// Each yearly projection includes:
// { year, startingValue, dividendIncome, taxOnDividends, netDividendIncome,
//   reinvestedAmount, additionalInvestment, endingValue, yieldOnCost, 
//   cumulativeDividends, inflationAdjustedIncome }

// Calculate dividend yield
const yieldResult = calculateDividendYield({
  stockPrice: 150,
  annualDividend: 6               // $6 per share annually
});
console.log(yieldResult.dividendYield);       // 4%
console.log(yieldResult.quarterlyDividend);   // $1.50
console.log(yieldResult.monthlyEquivalent);   // $0.50

// Quick yield calculation
const quickYield = quickDividendYield(150, 6);  // 4%

// Calculate required investment for income goal
const requiredInvestment = calculateRequiredInvestment(
  50000,   // Desired annual income
  4        // Current dividend yield
);
console.log(requiredInvestment);              // $1,250,000

// Assess dividend stability (unique feature!)
const stability = assessDividendStability({
  yearsOfConsecutiveGrowth: 25,
  averageGrowthRate: 7,
  payoutRatio: 45,
  sectorStability: 'high',
  marketCap: 'large-cap',
  hasReducedDividend: false
});
console.log(stability.stabilityScore);        // 0-100 score
console.log(stability.stabilityRating);       // 'excellent', 'good', 'moderate', 'poor', 'risky'
console.log(stability.isDividendAristocrat);  // 25+ years of growth
console.log(stability.isDividendKing);        // 50+ years of growth
console.log(stability.recommendations);       // Array of insights
console.log(stability.riskFactors);           // Potential concerns
console.log(stability.positiveFactors);       // Strengths

// Calculate tax breakdown for a specific dividend amount
const taxBreakdown = calculateDividendTaxBreakdown({
  totalDividends: 20000,
  qualifiedPercentage: 80,
  taxableIncome: 150000,
  filingStatus: 'married-filing-jointly'
});

// Compare multiple dividend scenarios
const scenarios = compareDividendScenarios([
  { label: 'High Yield ETF', principal: 100000, annualDividendYield: 6, dividendGrowthRate: 2 },
  { label: 'Dividend Aristocrats', principal: 100000, annualDividendYield: 3, dividendGrowthRate: 8 },
  { label: 'Balanced Portfolio', principal: 100000, annualDividendYield: 4, dividendGrowthRate: 5 }
], 20);  // Compare over 20 years

console.log(scenarios.scenarios);             // Full results for each
console.log(scenarios.bestByTotalDividends);  // Scenario label with most total dividends
console.log(scenarios.bestByFinalValue);      // Scenario label with highest ending value
console.log(scenarios.bestByIncomeAtEnd);     // Scenario with highest income at end
console.log(scenarios.summary);               // Quick comparison stats

// Estimate years to reach income goal
const yearsNeeded = estimateYearsToGoal(
  100000,  // Current portfolio
  50000,   // Target annual income
  4,       // Current yield
  5,       // Dividend growth rate
  6000,    // Additional investment per year
  true     // Reinvest dividends
);
console.log(yearsNeeded);                     // ~18 years
```

**Dividend Frequencies**: `monthly`, `quarterly`, `semi-annually`, `annually`

**Tax Filing Statuses**: `single`, `married-filing-jointly`, `married-filing-separately`, `head-of-household`

**Dividend Stability Ratings**:
- **Excellent** (score 85-100): Dividend Kings, Aristocrats - very reliable
- **Good** (score 70-84): Strong dividend history, low risk
- **Moderate** (score 50-69): Reasonable stability, some risk factors
- **Poor** (score 30-49): Higher risk, inconsistent history
- **Risky** (score 0-29): High probability of dividend cut

**Qualified Dividend Tax Rates (2024)**:
| Filing Status | 0% Rate | 15% Rate | 20% Rate |
|---------------|---------|----------|----------|
| Single | Up to $47,025 | $47,026 - $518,900 | Over $518,900 |
| Married Filing Jointly | Up to $94,050 | $94,051 - $583,750 | Over $583,750 |
| Head of Household | Up to $63,000 | $63,001 - $551,350 | Over $551,350 |

**Features That Competitors Don't Have**:
- Dividend Stability Score (0-100) with risk assessment
- Dividend Aristocrat/King detection
- DRIP vs non-DRIP comparison
- Qualified vs ordinary dividend tax optimization
- Inflation-adjusted income projections
- Yield on cost tracking (effective yield on original investment)
- Multi-scenario comparison for portfolio strategies
- Years-to-goal calculator for passive income targets

### Budget

#### 16. Savings Goal Calculator
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

#### 17. Emergency Fund Calculator
Calculate personalized emergency fund recommendations based on your risk profile, with savings plans and milestone tracking.

```typescript
import { 
  calculateEmergencyFund,
  quickEmergencyFund,
  timeToEmergencyFund,
  getRecommendedMonths,
  type EmergencyFundInputs,
  type EmergencyFundResult,
  type ExpenseEntry,
  type EmploymentType,
  EXPENSE_CATEGORY_NAMES
} from '@deanfinancials/calculators';

// Full calculation with risk assessment
const result = calculateEmergencyFund({
  expenses: 4500,                        // Monthly essential expenses
  currentSavings: 5000,                  // Current emergency fund balance
  monthlyIncome: 7000,                   // After-tax income
  employmentType: 'stable-employed',     // Employment stability
  incomeSources: 1,                      // Number of income sources
  dependents: 2,                         // Number of dependents
  hasDisabilityInsurance: true,          // Has disability coverage
  hasSeveranceProtection: false,         // Severance or union protections
  expectedJobSearchMonths: 4,            // Months to find new job if laid off
  monthlySavingsCapacity: 800            // How much can be saved monthly
});

console.log(result.monthlyExpenses);         // $4,500
console.log(result.recommendedTarget);       // $27,000 (6 months based on risk)
console.log(result.minimumTarget);           // $13,500 (3 months minimum)
console.log(result.conservativeTarget);      // $40,500 (9 months conservative)
console.log(result.currentCoverage);         // 1.11 months covered
console.log(result.fundingGap);              // $22,000 still needed
console.log(result.percentComplete);         // 18.5%

// Risk assessment results
console.log(result.riskAssessment.riskScore);        // 1-10 scale
console.log(result.riskAssessment.riskLevel);        // 'low', 'moderate', 'high', 'very-high'
console.log(result.riskAssessment.recommendedMonths); // 6 months
console.log(result.riskAssessment.riskFactors);      // ['2 dependents to support', 'Single income']
console.log(result.riskAssessment.protectiveFactors); // ['Disability insurance']

// Milestones
console.log(result.milestones);              // Progress milestones (1, 2, 3, 6, 9, 12 months)
// Each milestone: { label, months, amount, weeksToReach, achieved, description }

// Scenario comparisons
console.log(result.scenarios);               // Compare 3, 6, 9, 12 month targets
// Each scenario: { name, months, targetAmount, monthsToReach, weeklySavingsRequired, riskLevel }

// Savings plan (month-by-month projection with HYSA interest)
console.log(result.savingsPlan);             // Monthly progress to goal
console.log(result.monthsToGoal);            // ~28 months at $800/month
console.log(result.weeklySavingsFor12Months); // $423/week to reach goal in 1 year
console.log(result.monthlySavingsFor12Months); // $1,833/month to reach goal in 1 year

// Recommendations and warnings
console.log(result.recommendations);         // Personalized advice array
console.log(result.warnings);                // Warning messages if applicable

// With itemized expenses for detailed breakdown
const detailedResult = calculateEmergencyFund({
  expenses: [
    { category: 'housing', amount: 2000, description: 'Rent' },
    { category: 'utilities', amount: 250, description: 'Electric, gas, internet' },
    { category: 'food', amount: 600, description: 'Groceries' },
    { category: 'transportation', amount: 400, description: 'Car payment + insurance' },
    { category: 'insurance', amount: 300, description: 'Health insurance' },
    { category: 'debt-payments', amount: 500, description: 'Student loans' },
    { category: 'healthcare', amount: 100, description: 'Prescriptions' },
    { category: 'childcare', amount: 350, description: 'Daycare' }
  ],
  currentSavings: 5000,
  employmentType: 'variable-income',
  dependents: 1
});

console.log(detailedResult.expenseBreakdown); // Breakdown by category

// Quick calculation helpers
const quickFund = quickEmergencyFund(4500, 6);  // $27,000
const timeToReach = timeToEmergencyFund(27000, 5000, 800, 4.5);  // ~27 months
const recommendedMonths = getRecommendedMonths(true, true, true); // 9 months
```

**Employment Types**: `stable-employed`, `variable-income`, `self-employed`, `government`, `high-risk-industry`, `retired`

**Expense Categories**: `housing`, `utilities`, `food`, `transportation`, `insurance`, `debt-payments`, `healthcare`, `childcare`, `other-essential`

**Risk Level Recommendations**:
- **Low Risk** (score 1-3): 3 months minimum
- **Moderate Risk** (score 4-5): 6 months recommended
- **High Risk** (score 6-7): 9 months recommended
- **Very High Risk** (score 8-10): 12 months recommended

**Risk Factors Considered**:
- Employment type and stability
- Number of income sources in household
- Number of dependents
- Disability insurance coverage
- Severance/job protections
- Expected job search duration

**Features That Competitors Don't Have**:
- Risk-adjusted recommendations based on personal factors
- Detailed expense category breakdown
- Month-by-month savings plan with HYSA interest
- Multiple scenario comparison (3/6/9/12 months)
- Weekly and monthly savings requirements
- Personalized recommendations based on your situation

#### 18. 50/30/20 Budget Calculator
Calculate budget allocation based on the classic 50/30/20 rule and compare alternative budgeting strategies.

```typescript
import { 
  calculateBudget,
  quickBudget,
  categoryBudget,
  projectSavings,
  suggestBudgetRule,
  type BudgetInputs,
  type BudgetResult,
  type ExpenseItem,
  type BudgetCategory,
  BUDGET_RULES,
  BUDGET_CATEGORY_COLORS,
  SUBCATEGORY_NAMES
} from '@deanfinancials/calculators';

// Simple budget calculation
const result = calculateBudget({
  monthlyIncome: 5000
});

console.log(result.needs.target);          // $2,500 (50%)
console.log(result.wants.target);          // $1,500 (30%)
console.log(result.savings.target);        // $1,000 (20%)
console.log(result.appliedRule.name);      // "50/30/20 Rule"

// With expense tracking
const trackedResult = calculateBudget({
  monthlyIncome: 5000,
  expenses: [
    { description: 'Rent', amount: 1500, category: 'needs', subcategory: 'housing' },
    { description: 'Utilities', amount: 200, category: 'needs', subcategory: 'utilities' },
    { description: 'Groceries', amount: 400, category: 'needs', subcategory: 'groceries' },
    { description: 'Netflix', amount: 15, category: 'wants', subcategory: 'subscriptions' },
    { description: 'Dining', amount: 300, category: 'wants', subcategory: 'dining-out' },
    { description: '401k', amount: 500, category: 'savings', subcategory: 'retirement' }
  ]
});

console.log(trackedResult.needs.status);       // 'under', 'on-target', or 'over'
console.log(trackedResult.wants.difference);   // Amount under/over budget
console.log(trackedResult.savings.percentOfIncome); // Actual savings %
console.log(trackedResult.healthMetrics.score); // Financial health score (0-100)

// Compare different budget rules
console.log(trackedResult.ruleComparisons);    // All rules compared for your situation
console.log(trackedResult.recommendedRule);     // Best rule for your circumstances

// Get optimization suggestions
console.log(trackedResult.optimizations);       // Ways to improve your budget
console.log(trackedResult.recommendations);     // Personalized tips
console.log(trackedResult.warnings);            // Budget issues to address

// Project savings growth over time
console.log(trackedResult.annualProjections);   // 5-year wealth projection

// Chart data for visualization
console.log(trackedResult.chartData);           // Ready for pie chart rendering

// Use alternative budget rules
const aggressiveSaver = calculateBudget({
  monthlyIncome: 5000,
  budgetRule: 'aggressive-saver'              // 50/20/30 (prioritizes savings)
});

const highCostLiving = calculateBudget({
  monthlyIncome: 5000,
  budgetRule: 'high-cost-living',             // 60/20/20 (more for essentials)
  isHighCostArea: true
});

// Custom percentages
const custom = calculateBudget({
  monthlyIncome: 5000,
  customNeedsPercent: 55,
  customWantsPercent: 25,
  customSavingsPercent: 20
});

// Quick helpers
const quick = quickBudget(5000);
console.log(quick.needs);    // $2,500
console.log(quick.wants);    // $1,500
console.log(quick.savings);  // $1,000

const housingBudget = categoryBudget(5000, 'needs');  // $2,500 for all needs
const projectedWealth = projectSavings(1000, 10, 7);  // $173,085 after 10 years

const bestRule = suggestBudgetRule(5000, 2800, true, false);  // 'high-cost-living'
```

**Budget Rules Available** (`BUDGET_RULES`):
| Rule | Needs | Wants | Savings | Best For |
|------|-------|-------|---------|----------|
| `standard` | 50% | 30% | 20% | Most people with average cost of living |
| `aggressive-saver` | 50% | 20% | 30% | FIRE/rapid wealth building |
| `high-cost-living` | 60% | 20% | 20% | SF, NYC, Boston residents |
| `debt-focused` | 50% | 20% | 30% | Aggressive debt payoff |
| `minimalist` | 70% | 10% | 20% | Minimalists or high essential costs |
| `paycheck-to-paycheck` | 80% | 10% | 10% | Starting financial journey |
| `pay-yourself-first` | 55% | 25% | 20% | Those who struggle to save |

**Needs Subcategories**: `housing`, `utilities`, `groceries`, `transportation`, `health-insurance`, `minimum-debt`, `childcare`, `other-essential`

**Wants Subcategories**: `dining-out`, `entertainment`, `shopping`, `subscriptions`, `travel`, `personal-care`, `gifts`, `other-wants`

**Savings Subcategories**: `emergency-fund`, `retirement`, `investments`, `extra-debt`, `sinking-funds`, `other-savings`

**Features That Competitors Don't Have**:
- Alternative rule comparison (60/20/20, 70/20/10, 80/10/10)
- Personalized rule recommendation based on situation
- Expense tracking with actual vs target analysis
- Savings optimization suggestions
- 5-year wealth projection with compound growth
- Financial health scoring (0-100)
- Category breakdown with subcategories

#### 19. Home Affordability Calculator
Calculate "how much house can I afford" based on income, debts, down payment, and loan options. Features DTI analysis, PMI calculation, loan type comparison, and affordability comfort zones.

```typescript
import { 
  calculateHomeAffordability,
  quickAffordabilityEstimate,
  calculateDebtImpact,
  calculatePMI,
  calculateFHAMIP,
  calculateMonthlyMortgagePayment,
  type HomeAffordabilityInputs,
  type HomeAffordabilityResult,
  type LoanType,
  type ComfortLevel,
  DTI_LIMITS,
  MIN_DOWN_PAYMENT,
  ZONE_COLORS
} from '@deanfinancials/calculators';

// Full calculation with all parameters
const result = calculateHomeAffordability({
  annualIncome: 100000,
  monthlyDebts: 500,
  downPayment: 60000,
  interestRate: 0.065,
  loanTermYears: 30,
  loanType: 'conventional',
  propertyTaxRate: 0.0125,
  homeInsuranceRate: 0.0035,
  monthlyHOA: 200,
  creditScore: 740,
  includePMI: true
});

console.log(result.maxHomePrice);           // Maximum affordable home price
console.log(result.loanAmount);             // Loan amount (price - down payment)
console.log(result.downPaymentPercent);     // Down payment as percentage

// Monthly payment breakdown
console.log(result.monthlyBreakdown.principalAndInterest);  // P&I payment
console.log(result.monthlyBreakdown.propertyTax);           // Monthly property tax
console.log(result.monthlyBreakdown.homeInsurance);         // Monthly insurance
console.log(result.monthlyBreakdown.pmi);                   // PMI (if applicable)
console.log(result.monthlyBreakdown.hoa);                   // HOA dues
console.log(result.monthlyBreakdown.totalHousing);          // Total PITI + HOA
console.log(result.monthlyBreakdown.totalMonthly);          // Housing + other debts

// DTI analysis
console.log(result.dtiAnalysis.frontEndRatio);   // Housing payment / income (%)
console.log(result.dtiAnalysis.backEndRatio);    // Total debts / income (%)
console.log(result.dtiAnalysis.frontEndLimit);   // 28% for conventional
console.log(result.dtiAnalysis.backEndLimit);    // 36% for conventional
console.log(result.dtiAnalysis.status);          // 'excellent', 'good', 'acceptable', 'high', 'too-high'
console.log(result.dtiAnalysis.message);         // Personalized DTI assessment

// Affordability comfort zones
console.log(result.affordabilityZones);          // Array of comfort zones
// Each zone: { level: 'comfortable', minPrice: 0, maxPrice: 350000, 
//              monthlyPayment: 2100, backEndDTI: 28, description: '...', color: '#10b981' }

// Loan type comparison (Conventional vs FHA vs VA)
console.log(result.loanComparisons);             // Array of loan comparisons
// Each: { loanType, maxHomePrice, downPaymentRequired, monthlyPayment, 
//         qualifies, benefits: string[], drawbacks: string[] }

// Rate stress testing
console.log(result.stressTestScenarios);         // Impact of rate increases
// Each: { rate, rateIncrease, maxHomePrice, monthlyPayment, stillAffordable }

// Cash needed
console.log(result.estimatedClosingCosts);       // ~3% of home price
console.log(result.totalCashNeeded);             // Down payment + closing costs
console.log(result.effectiveRate);               // Interest rate + PMI impact

// Recommendations and warnings
console.log(result.recommendations);             // Personalized suggestions
console.log(result.warnings);                    // Issues to address

// Quick estimate (28% rule)
const quickEstimate = quickAffordabilityEstimate(100000, 0.065, 0.2);
console.log(quickEstimate);                      // ~$420,000

// Debt impact analysis
const debtImpact = calculateDebtImpact(100000, 0.065);
console.log(debtImpact);                         // Home price increase per $100/mo debt reduction

// PMI calculation
const monthlyPMI = calculatePMI(320000, 400000, 740);  // For 80% LTV
console.log(monthlyPMI);                         // Monthly PMI amount

// FHA MIP calculation
const fhaMIP = calculateFHAMIP(385000, 400000, 30);
console.log(fhaMIP.upfront);                     // 1.75% upfront fee
console.log(fhaMIP.monthly);                     // Monthly MIP

// Calculate mortgage payment
const payment = calculateMonthlyMortgagePayment(320000, 0.065, 30);
console.log(payment);                            // Monthly P&I payment
```

**Loan Types**: `conventional`, `fha`, `va`, `usda`

**Loan Term Years**: `15`, `20`, `30`

**Comfort Levels**: `comfortable`, `moderate`, `stretch`, `risky`

**DTI Limits by Loan Type**:
| Loan Type | Front-End DTI | Back-End DTI | Min Down Payment |
|-----------|---------------|--------------|------------------|
| Conventional | 28% | 36% | 3% |
| FHA | 31% | 43% | 3.5% |
| VA | 41%* | 41%* | 0% |
| USDA | 29% | 41% | 0% |

*VA uses residual income, 41% is a guideline

**PMI Calculation**: Based on LTV and credit score tiers
- Excellent (760+): 0.19% - 0.55% annually
- Good (700-759): 0.27% - 0.78% annually
- Fair (640-699): 0.45% - 1.05% annually
- Poor (<640): 0.65% - 1.35% annually

**FHA MIP Rates**:
- Upfront: 1.75% of loan amount
- Annual: 0.45% - 0.85% depending on term and LTV

**Features That Competitors Don't Have**:
- Affordability "comfort zones" (comfortable to risky)
- Loan type comparison side-by-side (Conventional vs FHA vs VA)
- Rate stress testing scenarios (+0.5% to +2%)
- Credit score-based PMI calculation
- Detailed monthly payment breakdown (P&I, tax, insurance, PMI, HOA)
- Total cash needed including closing costs
- Personalized recommendations based on DTI status
- Chart-ready data structures for visualization

#### 20. Paycheck Calculator
Calculate take-home pay after federal taxes, state taxes, FICA, and deductions. Features 2024/2025 tax brackets, all 50 US states, pre-tax and post-tax deductions, and state-by-state comparison.

```typescript
import { 
  calculatePaycheck,
  quickPaycheckEstimate,
  hourlyToAnnual,
  annualToHourly,
  comparePaychecks,
  compareStates,
  getTaxBracketInfo,
  type PaycheckInputs,
  type PaycheckResult,
  type PayType,
  type PayFrequency,
  type FilingStatus,
  type USState,
  type PreTaxDeductions,
  type PostTaxDeductions,
  FEDERAL_TAX_BRACKETS_2024,
  FEDERAL_TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS,
  STATE_TAX_INFO
} from '@deanfinancials/calculators';

// Full paycheck calculation
const result = calculatePaycheck({
  payType: 'salary',
  grossPay: 75000,                        // Annual salary
  payFrequency: 'biweekly',               // Pay period
  filingStatus: 'single',                 // Tax filing status
  state: 'CA',                            // State for state tax
  taxYear: 2024,                          // 2024 or 2025
  federalAllowances: 1,                   // W-4 allowances (optional)
  preTaxDeductions: {                     // Pre-tax deductions (optional)
    retirement401k: 500,                  // Per paycheck
    healthInsurance: 200,
    hsaContribution: 100,
    fsaContribution: 50,
    dentalVision: 25,
    commuter: 50,
    other: 0
  },
  postTaxDeductions: {                    // Post-tax deductions (optional)
    rothContribution: 100,
    lifeInsurance: 25,
    disabilityInsurance: 15,
    unionDues: 0,
    garnishments: 0,
    charitableContributions: 50,
    other: 0
  },
  ytdGrossIncome: 25000                   // Year-to-date (for SS cap, optional)
});

// Gross and net pay
console.log(result.grossPayPerPeriod);         // $2,884.62 (biweekly)
console.log(result.netPayPerPeriod);           // $1,862.34 (take-home)
console.log(result.annualGrossPay);            // $75,000
console.log(result.annualNetPay);              // $48,420.84
console.log(result.effectiveTaxRate);          // 22.1%
console.log(result.marginalFederalRate);       // 22%

// Tax breakdown
console.log(result.taxes.federal);             // Federal income tax
console.log(result.taxes.state);               // State income tax
console.log(result.taxes.socialSecurity);      // Social Security (6.2%)
console.log(result.taxes.medicare);            // Medicare (1.45%)
console.log(result.taxes.additionalMedicare);  // Additional Medicare (0.9% over threshold)
console.log(result.taxes.totalFICA);           // Total FICA
console.log(result.taxes.totalTaxes);          // All taxes combined

// Deduction breakdown
console.log(result.deductions.preTax);         // Pre-tax deductions total
console.log(result.deductions.postTax);        // Post-tax deductions total
console.log(result.deductions.total);          // All deductions

// Annual projections
console.log(result.annualTaxes.federal);       // Federal taxes per year
console.log(result.annualTaxes.state);         // State taxes per year
console.log(result.annualTaxes.fica);          // FICA taxes per year
console.log(result.annualDeductions);          // Annual deductions
console.log(result.taxableIncome);             // Taxable income after deductions

// Tax bracket info
console.log(result.federalBracket);            // Current federal bracket
console.log(result.stateBracketInfo);          // State tax info

// State-specific info
console.log(result.stateInfo.name);            // "California"
console.log(result.stateInfo.hasIncomeTax);    // true
console.log(result.stateInfo.maxRate);         // 13.3%
console.log(result.stateInfo.brackets);        // State tax brackets

// Year-to-date tracking
console.log(result.ytdGross);                  // YTD gross income
console.log(result.ytdNet);                    // YTD net income
console.log(result.ytdTaxes);                  // YTD taxes paid
console.log(result.socialSecurityCapped);      // Whether SS is capped

// Hourly calculation
const hourlyResult = calculatePaycheck({
  payType: 'hourly',
  hourlyRate: 35,
  hoursPerWeek: 40,
  payFrequency: 'weekly',
  filingStatus: 'married',
  state: 'TX'
});

// Quick estimate (simplified)
const quickEstimate = quickPaycheckEstimate(75000, 'single', 'CA');
console.log(quickEstimate.estimatedNetAnnual);   // ~$55,000
console.log(quickEstimate.estimatedNetMonthly);  // ~$4,580

// Convert between hourly and salary
const annual = hourlyToAnnual(35, 40);          // $72,800 (35/hr * 40hrs * 52weeks)
const hourly = annualToHourly(75000, 40);       // $36.06/hr

// Compare scenarios (e.g., before/after raise)
const comparison = comparePaychecks(
  { payType: 'salary', grossPay: 75000, payFrequency: 'biweekly', filingStatus: 'single', state: 'CA' },
  { payType: 'salary', grossPay: 85000, payFrequency: 'biweekly', filingStatus: 'single', state: 'CA' }
);
console.log(comparison.grossDifference);        // $10,000 annual
console.log(comparison.netDifference);          // ~$6,800 (after taxes)
console.log(comparison.perPaycheckDifference);  // ~$262 per paycheck
console.log(comparison.effectiveTaxOnRaise);    // ~32% (marginal tax on raise)

// Compare states (for relocation decisions)
const stateComparison = compareStates(
  75000,
  'single',
  ['CA', 'TX', 'FL', 'NY', 'WA']
);
console.log(stateComparison);  // Array of results for each state
// Each: { state, stateName, annualStateTax, annualNetPay, monthlyNetPay, ranking }

// Get tax bracket information
const bracketInfo = getTaxBracketInfo(75000, 'single', 2024);
console.log(bracketInfo.currentBracket);        // 22%
console.log(bracketInfo.incomeInBracket);       // Amount in current bracket
console.log(bracketInfo.incomeToNextBracket);   // How much until next bracket
console.log(bracketInfo.nextBracketRate);       // 24%
```

**Pay Types**: `salary`, `hourly`

**Pay Frequencies**: `weekly`, `biweekly`, `semi-monthly`, `monthly`

**Filing Statuses**: `single`, `married`, `married-separate`, `head-of-household`

**Pre-Tax Deductions**:
- `retirement401k` - 401(k) contributions
- `healthInsurance` - Health insurance premiums
- `hsaContribution` - Health Savings Account
- `fsaContribution` - Flexible Spending Account
- `dentalVision` - Dental/Vision insurance
- `commuter` - Commuter benefits
- `other` - Other pre-tax deductions

**Post-Tax Deductions**:
- `rothContribution` - Roth 401(k)/403(b)
- `lifeInsurance` - Life insurance premiums
- `disabilityInsurance` - Disability insurance
- `unionDues` - Union membership dues
- `garnishments` - Wage garnishments
- `charitableContributions` - Payroll giving
- `other` - Other post-tax deductions

**2024 Federal Tax Brackets**:
| Bracket | Single | Married Filing Jointly |
|---------|--------|------------------------|
| 10% | $0 - $11,600 | $0 - $23,200 |
| 12% | $11,600 - $47,150 | $23,200 - $94,300 |
| 22% | $47,150 - $100,525 | $94,300 - $201,050 |
| 24% | $100,525 - $191,950 | $201,050 - $383,900 |
| 32% | $191,950 - $243,725 | $383,900 - $487,450 |
| 35% | $243,725 - $609,350 | $487,450 - $731,200 |
| 37% | $609,350+ | $731,200+ |

**FICA Rates (2024)**:
- Social Security: 6.2% (capped at $168,600)
- Medicare: 1.45% (no cap)
- Additional Medicare: 0.9% (over $200,000 single / $250,000 married)

**States with No Income Tax**: Alaska, Florida, Nevada, New Hampshire*, South Dakota, Tennessee*, Texas, Washington, Wyoming
(*Limited taxes on investment income only)

**Features That Competitors Don't Have**:
- Complete 2024 and 2025 federal tax brackets
- All 50 US states with accurate tax info
- State comparison tool for relocation decisions
- Scenario comparison (before/after raise)
- Hourly-to-salary conversion utilities
- Year-to-date tracking with Social Security cap
- Detailed pre-tax and post-tax deduction handling
- Marginal vs effective tax rate breakdown
- Tax bracket information with income-to-next-bracket

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
