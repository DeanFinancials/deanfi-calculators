# Changelog and Implementation Log - @deanfinancials/calculators

**Package:** @deanfinancials/calculators  
**Repository:** https://github.com/DeanFinancials/deanfi-calculators  
**npm Registry:** https://www.npmjs.com/package/@deanfinancials/calculators

This document tracks all changes, implementations, and design decisions for the calculator package.

---

## Table of Contents

- [Version 1.9.0 - Paycheck Calculator](#version-190---2025-01-xx)
- [Version 1.8.1 - Home Affordability Bug Fix](#version-181---2025-12-02)
- [Version 1.8.0 - Home Affordability Calculator](#version-180---2025-06-xx)
- [Version 1.7.0 - 50/30/20 Budget Calculator](#version-170---2025-01-xx)
- [Version 1.6.0 - RMD Calculator](#version-160---2025-06-21)
- [Version 1.5.0 - Emergency Fund Calculator](#version-150---2025-12-03)
- [Version 1.4.0 - CD Calculator](#version-140---2025-12-01)
- [Version 1.3.0 - Net Worth Calculator](#version-130---2025-06-14)
- [Version 1.2.1 - Budget Category & README Update](#version-121---2025-11-30)
- [Version 1.2.0 - Savings Goal Calculator](#version-120---2025-11-30)
- [Version 1.1.0 - Investment Calculator Module](#version-110---2025-01-xx)
- [Version 1.0.1 - ESM Import Path Fix](#version-101---2025-11-21)
- [Version 1.0.0 - Initial Publication](#version-100---2025-11-21)
- [Pre-Publication Development](#pre-publication-development)

---

## Version 1.9.0 - 2025-01-XX

**Type:** New Feature (MINOR)  
**Status:** Ready for publish  
**npm:** @deanfinancials/calculators@1.9.0

### Overview

Added comprehensive Paycheck Calculator to the budget module. This calculator helps users estimate their take-home pay after federal taxes, state taxes, FICA (Social Security and Medicare), and various pre-tax and post-tax deductions. Features include 2024/2025 federal tax brackets, all 50 US states with accurate tax information, state-by-state comparison for relocation decisions, scenario comparison (before/after raise), hourly-to-salary conversion utilities, and detailed deduction handling.

### Key Features

1. **Federal Tax Calculation** - 2024 and 2025 tax brackets for all filing statuses (single, married, married-separate, head-of-household)
2. **State Tax Calculation** - All 50 US states with accurate tax rates, including states with no income tax
3. **FICA Calculation** - Social Security (6.2% up to wage base), Medicare (1.45%), Additional Medicare (0.9% over threshold)
4. **Pre-Tax Deductions** - 401(k), health insurance, HSA, FSA, dental/vision, commuter benefits
5. **Post-Tax Deductions** - Roth contributions, life insurance, disability insurance, union dues, garnishments, charitable contributions
6. **Pay Type Support** - Both salary and hourly calculations with various pay frequencies
7. **State Comparison** - Compare take-home pay across multiple states for relocation decisions
8. **Scenario Comparison** - Compare before/after raise to see effective tax on raise

### New Files Created

**src/budget/paycheckCalculator.ts:**

Complete paycheck calculator with the following exports:

**Types:**
- `PayType` - Union type: 'salary' | 'hourly'
- `PayFrequency` - Union type: 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly'
- `FilingStatus` - Union type: 'single' | 'married' | 'married-separate' | 'head-of-household'
- `USState` - Union type for all 50 US states (2-letter codes)
- `PreTaxDeductions` - Interface for pre-tax deduction types
- `PostTaxDeductions` - Interface for post-tax deduction types
- `PaycheckInputs` - Complete input interface for paycheck calculation
- `TaxBreakdown` - Interface for federal, state, FICA breakdown per period
- `DeductionBreakdown` - Interface for pre-tax and post-tax deductions
- `PaycheckComparison` - Interface for comparing two paycheck scenarios
- `PaycheckResult` - Complete result interface with all calculation outputs

**Constants:**
- `FEDERAL_TAX_BRACKETS_2024` - 2024 federal tax brackets for all filing statuses
- `FEDERAL_TAX_BRACKETS_2025` - 2025 federal tax brackets for all filing statuses
- `STANDARD_DEDUCTIONS` - Standard deductions by filing status (2024/2025)
- `SOCIAL_SECURITY_RATE` - 6.2%
- `SOCIAL_SECURITY_WAGE_BASE_2024` - $168,600
- `SOCIAL_SECURITY_WAGE_BASE_2025` - $176,100
- `MEDICARE_RATE` - 1.45%
- `ADDITIONAL_MEDICARE_RATE` - 0.9%
- `ADDITIONAL_MEDICARE_THRESHOLD` - By filing status ($200k single, $250k married)
- `STATE_TAX_INFO` - Complete tax info for all 50 states

**Functions:**
- `calculatePaycheck(inputs)` - Main function for full paycheck calculation
- `quickPaycheckEstimate(annualSalary, filingStatus, state)` - Simplified estimation
- `hourlyToAnnual(hourlyRate, hoursPerWeek)` - Convert hourly to annual salary
- `annualToHourly(annualSalary, hoursPerWeek)` - Convert annual salary to hourly
- `comparePaychecks(scenario1, scenario2)` - Compare two paycheck scenarios
- `compareStates(annualSalary, filingStatus, states)` - Compare take-home across states
- `getTaxBracketInfo(income, filingStatus, taxYear)` - Get current bracket info

### Files Modified

**src/index.ts:**
- Added exports for all Paycheck Calculator types, constants, and functions with `.js` extension

### Implementation Details

#### Federal Tax Calculation
Uses progressive tax brackets. Calculates tax by applying each bracket's rate to the income falling within that bracket's range.

#### State Tax Calculation
Supports three types of state taxes:
1. **No Tax** - AK, FL, NV, NH, SD, TN, TX, WA, WY
2. **Flat Rate** - CO (4.4%), IL (4.95%), IN (3.05%), KY (4.0%), MA (5.0%), MI (4.25%), NC (5.25%), PA (3.07%), UT (4.65%)
3. **Progressive Brackets** - All other states with graduated rates

#### FICA Calculation
- Social Security: 6.2% up to wage base ($168,600 in 2024, $176,100 in 2025)
- Medicare: 1.45% on all wages
- Additional Medicare: 0.9% on wages over $200,000 (single) or $250,000 (married)
- Tracks year-to-date earnings to properly cap Social Security

#### Deduction Handling
- Pre-tax deductions reduce taxable income (401k, health insurance, HSA, FSA)
- Post-tax deductions are taken after tax calculation (Roth, life insurance, garnishments)
- Standard deduction is applied for federal tax calculation

### Documentation Links

- IRS 2024 Tax Tables: https://www.irs.gov/pub/irs-pdf/p15t.pdf
- IRS 2025 Tax Brackets: https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025
- FICA Rates: https://www.ssa.gov/oact/cola/cbb.html
- State Tax Information: https://taxfoundation.org/data/all/state/state-income-tax-rates-2024/

### Testing Notes

Verified against SmartAsset and ADP paycheck calculators for accuracy across multiple scenarios including:
- Single filer with $75,000 salary in California
- Married filer with $125,000 salary in New York
- Hourly worker at $35/hour in Texas (no state tax)
- High earner over Social Security wage base
- Scenarios with various pre-tax and post-tax deductions

---

## Version 1.8.1 - 2025-12-02

**Type:** Bug Fix (PATCH)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.8.1

### Overview

Fixed critical infinite recursion bug in the Home Affordability Calculator that caused the browser to freeze when calculating results.

### Bug Description

The `calculateHomeAffordability()` function was calling `compareLoanTypes()` and `calculateStressTest()`, which in turn called `calculateHomeAffordability()` for each loan type and stress scenario, creating an infinite loop that caused a "Maximum call stack size exceeded" error.

### Fix Implementation

Added an internal `_skipNestedCalculations` flag to the `HomeAffordabilityInputs` interface. When this flag is `true`, the function skips generating:
- `affordabilityZones` (returns empty array)
- `loanComparisons` (returns empty array)
- `stressTestScenarios` (returns empty array)

The `compareLoanTypes()` and `calculateStressTest()` helper functions now pass `_skipNestedCalculations: true` when calling `calculateHomeAffordability()`, preventing the recursive loop.

### Files Modified

**src/budget/homeAffordability.ts:**
- Added `_skipNestedCalculations?: boolean` to `HomeAffordabilityInputs` interface (marked as `@internal`)
- Updated `calculateHomeAffordability()` to conditionally skip nested calculations
- Updated `compareLoanTypes()` to pass `_skipNestedCalculations: true`
- Updated `calculateStressTest()` to pass `_skipNestedCalculations: true`

### Testing

Verified calculation works with test inputs:
- Annual Income: $125,000
- Monthly Debts: $500
- Down Payment: $60,000
- Interest Rate: 6.5%
- Loan Term: 15 years
- Loan Type: Conventional

Result: Max Home Price $336,000, Monthly Payment $2,914.36

---

## Version 1.8.0 - 2025-06-XX

**Type:** New Feature (MINOR)  
**Status:** Ready for publish  
**npm:** @deanfinancials/calculators@1.8.0

### Overview

Added comprehensive Home Affordability Calculator to the budget module. This calculator helps users answer "How much house can I afford?" by analyzing income, debts, down payment, and loan options. Features include DTI analysis (28/36 rule), PMI calculation, multiple loan type comparison (Conventional, FHA, VA), affordability comfort zones, rate stress testing, and detailed monthly payment breakdowns.

### New Files Created

**src/budget/homeAffordability.ts:**

Complete home affordability calculator with the following exports:

**Types:**
- `LoanType` - Union type: 'conventional' | 'fha' | 'va' | 'usda'
- `LoanTermYears` - Union type: 15 | 20 | 30
- `ComfortLevel` - Union type: 'comfortable' | 'moderate' | 'stretch' | 'risky'
- `HomeAffordabilityInputs` - Complete input interface (income, debts, down payment, rate, loan type, etc.)
- `MonthlyPaymentBreakdown` - Interface for P&I, taxes, insurance, PMI, HOA breakdown
- `DTIAnalysis` - Interface for front-end/back-end DTI ratios and status
- `LoanComparison` - Interface for comparing loan types (conventional, FHA, VA)
- `StressTestScenario` - Interface for rate increase stress testing
- `AffordabilityZone` - Interface for comfort level zones with price ranges
- `HomeAffordabilityResult` - Complete result interface with all calculation outputs

**Constants:**
- `DTI_LIMITS` - DTI limits by loan type (28/36 for conventional, 31/43 for FHA, 41/41 for VA)
- `MIN_DOWN_PAYMENT` - Minimum down payment by loan type (3%, 3.5%, 0%)
- `PMI_RATES` - PMI rate matrix based on down payment and credit score
- `FHA_MIP` - FHA Mortgage Insurance Premium rates (upfront and annual)
- `VA_FUNDING_FEE` - VA funding fee rates by down payment and usage
- `ZONE_COLORS` - Color mapping for affordability zones visualization

**Functions:**
- `calculatePMI(loanAmount, homePrice, creditScore)` - Calculate monthly PMI based on LTV and credit
- `calculateFHAMIP(loanAmount, homePrice, loanTermYears)` - Calculate FHA upfront and monthly MIP
- `calculateMonthlyMortgagePayment(loanAmount, rate, years)` - Standard mortgage payment formula
- `calculateMaxLoanFromPayment(targetPayment, rate, years)` - Reverse solve for max loan amount
- `calculateHomeAffordability(inputs)` - Main calculation function returning comprehensive analysis
- `quickAffordabilityEstimate(annualIncome, rate, downPaymentPercent)` - Quick estimate using 28% rule
- `calculateDebtImpact(annualIncome, rate)` - Calculate home price impact per $100 monthly debt

**Features:**
- DTI ratio analysis with front-end (28%) and back-end (36%) ratios
- Custom DTI limits for FHA (31/43), VA (41/41), USDA (29/41)
- PMI calculation based on LTV and credit score tiers
- FHA MIP calculation (1.75% upfront + annual rate)
- VA funding fee support
- Property tax and homeowners insurance estimates
- HOA dues inclusion
- Affordability comfort zones (comfortable to risky)
- Loan type comparison (Conventional vs FHA vs VA)
- Rate stress testing (+0.5%, +1%, +1.5%, +2%)
- Closing costs estimation (3% default)
- Total cash needed calculation (down payment + closing costs)
- Effective mortgage rate (including PMI impact)
- Personalized recommendations and warnings
- Iterative solver for max home price calculation

### Files Modified

**src/index.ts:**
Added exports for home affordability calculator:

```typescript
// Home Affordability Calculator
export {
  type LoanType,
  type LoanTermYears,
  type ComfortLevel,
  type HomeAffordabilityInputs,
  type MonthlyPaymentBreakdown,
  type DTIAnalysis,
  type LoanComparison,
  type StressTestScenario,
  type AffordabilityZone,
  type HomeAffordabilityResult,
  DTI_LIMITS,
  MIN_DOWN_PAYMENT,
  PMI_RATES,
  FHA_MIP,
  VA_FUNDING_FEE,
  ZONE_COLORS,
  calculatePMI,
  calculateFHAMIP,
  calculateMonthlyMortgagePayment,
  calculateMaxLoanFromPayment,
  calculateHomeAffordability,
  quickAffordabilityEstimate,
  calculateDebtImpact
} from './budget/homeAffordability.js';
```

### Calculation Methodology

**28/36 Rule (Conventional Loans):**
- Front-end DTI: Housing payment should not exceed 28% of gross monthly income
- Back-end DTI: Total debt payments should not exceed 36% of gross monthly income

**FHA Rules:**
- Front-end DTI limit: 31%
- Back-end DTI limit: 43%
- Minimum down payment: 3.5%
- MIP: 1.75% upfront + 0.85% annual for 30-year loans with LTV > 95%

**VA Rules:**
- No strict DTI limit (uses residual income), but 41% guideline
- No down payment required
- No monthly mortgage insurance
- Funding fee applies (varies by usage and down payment)

**PMI Calculation:**
PMI rates vary based on:
1. Down payment percentage tier (3-5%, 5-10%, 10-15%, 15-20%)
2. Credit score tier (excellent 760+, good 700+, fair 640+, poor <640)
- PMI cancels automatically at 80% LTV for conventional loans

### Usage Example

```typescript
import { 
  calculateHomeAffordability,
  quickAffordabilityEstimate,
  calculateDebtImpact,
  DTI_LIMITS
} from '@deanfinancials/calculators';

// Full calculation
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
  creditScore: 740
});

console.log(result.maxHomePrice);           // Maximum affordable home price
console.log(result.monthlyBreakdown);       // P&I, taxes, insurance, PMI, HOA
console.log(result.dtiAnalysis);            // Front-end/back-end ratios
console.log(result.affordabilityZones);     // Comfortable to risky zones
console.log(result.loanComparisons);        // Conventional vs FHA vs VA
console.log(result.stressTestScenarios);    // Rate increase impact
console.log(result.recommendations);        // Personalized suggestions

// Quick estimate
const quickEstimate = quickAffordabilityEstimate(100000, 0.065, 0.2);
console.log(quickEstimate);                 // ~$420,000

// Debt impact
const debtImpact = calculateDebtImpact(100000, 0.065);
console.log(debtImpact);                    // Home price increase per $100/mo debt reduction
```

### Competitor Analysis

Before implementation, analyzed leading home affordability calculators:
- **NerdWallet:** Simple income/debt input with basic DTI
- **Zillow:** Comprehensive but focuses on specific properties
- **Bankrate:** Basic affordability with limited loan comparison
- **Redfin:** Good UI but limited stress testing

Our implementation improves on competitors with:
- Affordability "comfort zones" (comfortable, moderate, stretch, risky)
- Multiple loan type comparison side-by-side
- Rate stress testing scenarios
- Credit score-based PMI calculation
- Detailed monthly payment breakdown
- Personalized recommendations based on DTI status
- Chart-ready data structures for visualization
- Closing costs and total cash needed calculation
- FHA MIP and VA funding fee support

### Testing Required

```bash
npm run build
# Verify dist/budget/homeAffordability.js exists
# Verify exports in dist/index.js include home affordability calculator

# Test locally with npm link
npm link
cd ../deanfi-website
npm link @deanfinancials/calculators
npm run dev
# Visit /budget/home-affordability and test calculations
```

---

## Version 1.7.0 - 2025-01-XX

**Type:** New Feature (MINOR)  
**Status:** Ready for publish  
**npm:** @deanfinancials/calculators@1.7.0

### Overview

Added comprehensive 50/30/20 Budget Calculator to the budget module. This calculator helps users allocate their after-tax income using the popular 50/30/20 budgeting rule, with support for alternative budget rules, expense tracking, savings optimization suggestions, and financial health scoring.

### New Files Created

**src/budget/budgetCalculator.ts:**

Complete 50/30/20 budget calculator with the following exports:

**Types:**
- `BudgetCategory` - Union type: 'needs' | 'wants' | 'savings'
- `NeedsSubcategory` - Union type for detailed needs tracking (housing, utilities, groceries, transportation, health-insurance, minimum-debt, childcare, other-essential)
- `WantsSubcategory` - Union type for detailed wants tracking (dining-out, entertainment, shopping, subscriptions, travel, personal-care, gifts, other-wants)
- `SavingsSubcategory` - Union type for detailed savings tracking (emergency-fund, retirement, investments, extra-debt, sinking-funds, other-savings)
- `BudgetRule` - Interface for budget rule configuration (name, description, percentages, bestFor)
- `ExpenseItem` - Interface for tracking individual expenses
- `CategoryBreakdown` - Interface for category analysis (total, target, difference, status)
- `BudgetInputs` - Complete input interface for the calculator
- `RuleComparison` - Interface for comparing different budget rules
- `SavingsOptimization` - Interface for savings improvement suggestions
- `BudgetHealthMetrics` - Interface for financial health scoring
- `AnnualProjection` - Interface for 5-year savings projections
- `BudgetResult` - Complete result interface with all calculation outputs

**Constants:**
- `BUDGET_RULES` - Predefined budget rules (standard, aggressive-saver, high-cost-living, debt-focused, minimalist, paycheck-to-paycheck, pay-yourself-first)
- `BUDGET_CATEGORY_COLORS` - Color mapping for chart visualization
- `SUBCATEGORY_NAMES` - Display names for all subcategories

**Functions:**
- `calculateBudget(inputs)` - Main calculation function returning comprehensive budget analysis
- `quickBudget(monthlyIncome)` - Quick 50/30/20 calculation
- `categoryBudget(monthlyIncome, category, rule?)` - Calculate budget for specific category
- `projectSavings(monthlySavings, years, annualReturn?)` - Project savings growth with compound interest
- `suggestBudgetRule(monthlyIncome, monthlyNeeds, isHighCostArea?, hasDebt?)` - Get personalized rule recommendation

**Features:**
- 7 pre-built budget rules for different situations
- Custom percentage support (auto-normalizes to 100%)
- Expense tracking with actual vs target comparison
- Category status indicators (under, on-target, over budget)
- Detailed subcategory tracking for all three main categories
- Personalized rule recommendation based on user situation
- Savings optimization suggestions with priority ranking
- Financial health scoring (0-100 with letter grades)
- 5-year wealth projection with compound growth
- Chart-ready data for pie chart visualization
- Personalized recommendations and warnings

### Files Modified

**src/index.ts:**
Added exports for budget calculator:

```typescript
// 50/30/20 Budget Calculator
export {
  type BudgetCategory,
  type NeedsSubcategory,
  type WantsSubcategory,
  type SavingsSubcategory,
  type BudgetRule,
  type ExpenseItem,
  type CategoryBreakdown,
  type BudgetInputs,
  type RuleComparison,
  type SavingsOptimization,
  type BudgetHealthMetrics,
  type AnnualProjection,
  type BudgetResult,
  BUDGET_RULES,
  BUDGET_CATEGORY_COLORS,
  SUBCATEGORY_NAMES,
  calculateBudget,
  quickBudget,
  categoryBudget,
  projectSavings,
  suggestBudgetRule
} from './budget/budgetCalculator.js';
```

**README.md:**
Added comprehensive documentation for 50/30/20 Budget Calculator including:
- Calculator overview and 50/30/20 rule explanation
- Full API documentation with all types and functions
- Code examples for basic and advanced usage
- Budget rules table with percentages and best-for descriptions
- Subcategory reference tables
- Features comparison with competitors

### Budget Rules Implemented

| Rule Key | Name | Needs | Wants | Savings | Best For |
|----------|------|-------|-------|---------|----------|
| `standard` | 50/30/20 Rule | 50% | 30% | 20% | Most people with average cost of living |
| `aggressive-saver` | 50/20/30 Rule | 50% | 20% | 30% | FIRE/rapid wealth building |
| `high-cost-living` | 60/20/20 Rule | 60% | 20% | 20% | SF, NYC, Boston residents |
| `debt-focused` | 50/20/30 Debt Focus | 50% | 20% | 30% | Aggressive debt payoff |
| `minimalist` | 70/10/20 Rule | 70% | 10% | 20% | Minimalists or high essential costs |
| `paycheck-to-paycheck` | 80/10/10 Starter | 80% | 10% | 10% | Starting financial journey |
| `pay-yourself-first` | Pay Yourself First | 55% | 25% | 20% | Those who struggle to save |

### Usage Example

```typescript
import { 
  calculateBudget,
  quickBudget,
  suggestBudgetRule,
  BUDGET_RULES
} from '@deanfinancials/calculators';

// Simple budget calculation
const result = calculateBudget({
  monthlyIncome: 5000
});

console.log(result.needs.target);           // $2,500 (50%)
console.log(result.wants.target);           // $1,500 (30%)
console.log(result.savings.target);         // $1,000 (20%)

// With expense tracking
const trackedResult = calculateBudget({
  monthlyIncome: 5000,
  expenses: [
    { description: 'Rent', amount: 1500, category: 'needs', subcategory: 'housing' },
    { description: 'Netflix', amount: 15, category: 'wants', subcategory: 'subscriptions' },
    { description: '401k', amount: 500, category: 'savings', subcategory: 'retirement' }
  ]
});

console.log(trackedResult.needs.status);        // 'under', 'on-target', or 'over'
console.log(trackedResult.healthMetrics.score); // 0-100 health score
console.log(trackedResult.optimizations);       // Savings improvement suggestions
console.log(trackedResult.recommendedRule);     // Best rule for user's situation

// Quick calculation
const quick = quickBudget(5000);
// { needs: 2500, wants: 1500, savings: 1000 }

// Get rule suggestion
const bestRule = suggestBudgetRule(5000, 2800, true, false);
// 'high-cost-living'
```

### Competitor Analysis

Before implementation, analyzed leading 50/30/20 calculators:
- **NerdWallet:** Simple income input with category breakdown
- **Bankrate:** Basic 50/30/20 allocation display
- **Ramsey Solutions:** Focuses on zero-based budgeting instead

Our implementation improves on competitors with:
- 7 alternative budget rules (60/20/20, 70/20/10, etc.)
- Personalized rule recommendation based on user situation
- Detailed expense tracking with subcategories
- Actual vs target comparison with status indicators
- Savings optimization suggestions with priority ranking
- Financial health scoring (0-100)
- 5-year wealth projection with compound growth
- Chart-ready data for visualization

### Testing Required

```bash
npm run build
# Verify dist/budget/budgetCalculator.js exists
# Verify exports in dist/index.js include budget calculator

# Test locally with npm link
npm link
cd ../deanfi-website
npm link @deanfinancials/calculators
npm run dev
# Visit /budget/fifty-thirty-twenty and test calculations
```

---

## Version 1.6.0 - 2025-06-21

**Type:** New Feature (MINOR)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.6.0

### Overview

Added comprehensive RMD (Required Minimum Distribution) Calculator to the retirement module. This calculator uses official IRS life expectancy tables to calculate annual RMDs from tax-deferred retirement accounts. Features include SECURE Act 2.0 compliance (age 73 starting in 2023), spouse beneficiary calculations using the Joint Life Table for spouses 10+ years younger, multi-year projections with account balance estimation, and QCD eligibility tracking.

### New Files Created

**src/retirement/rmdCalculator.ts:**

Complete RMD calculator with official IRS tables and the following exports:

**Types:**
- `RMDInput` - Interface for calculator inputs (birthYear, accountBalance, calculationYear, spouseBirthYear optional)
- `RMDResult` - Interface for calculation results including age, rmdAmount, effectiveTaxRate (percentage of balance), divisor, tableUsed, isFirstRMDYear, qcdEligible, rmdDeadline
- `RMDProjection` - Interface for multi-year projections with year, age, beginningBalance, rmdAmount, endingBalance, cumulativeRMDs

**Functions:**
- `calculateRMD(input)` - Main calculation function using official IRS tables
- `projectRMDs(input, years, expectedReturn)` - Project RMDs over multiple years with account growth
- `getUniformLifetimeTable()` - Returns official IRS Uniform Lifetime Table (ages 72-120)
- `getJointLifeTableDivisor(ownerAge, spouseAge)` - Returns Joint Life Table divisor for spouse beneficiaries 10+ years younger

**Constants:**
- `UNIFORM_LIFETIME_TABLE` - Complete IRS Uniform Lifetime Table object mapping ages 72-120 to divisors
- `JOINT_LIFE_TABLE` - Complete IRS Joint Life Table for owner ages 72-89+ with spouse ages

**Features:**
- Official IRS Uniform Lifetime Table (used for most account owners)
- Official IRS Joint Life Table (used when spouse is sole beneficiary and 10+ years younger)
- SECURE Act 2.0 compliance: RMD starting age 73 for those turning 72 after Dec 31, 2022
- RMD starting age 75 planned for 2033 (future-proofed)
- First RMD year detection with extended deadline (April 1 of following year)
- QCD eligibility tracking (age 70.5+)
- Multi-year projections with expected return modeling
- Account balance depletion tracking
- Cumulative RMD totals

### Files Modified

**src/index.ts:**
Added exports for RMD calculator:

```typescript
// RMD Calculator
export {
  type RMDInput,
  type RMDResult,
  type RMDProjection,
  calculateRMD,
  projectRMDs,
  getUniformLifetimeTable,
  getJointLifeTableDivisor,
  UNIFORM_LIFETIME_TABLE,
  JOINT_LIFE_TABLE,
} from './retirement/rmdCalculator.js';
```

**README.md:**
Added comprehensive documentation for RMD Calculator including:
- Calculator overview and IRS compliance details
- Full API documentation with all types and functions
- Code examples for single-year and multi-year calculations
- Spouse beneficiary calculation examples
- Reference links to official IRS publications

**package.json:**
- Bumped version from 1.5.0 to 1.6.0

### IRS Tables Implemented

**Uniform Lifetime Table (Table III):**
- Ages 72-120 with corresponding divisors
- Example divisors: Age 73 = 26.5, Age 75 = 24.6, Age 80 = 20.2, Age 90 = 12.2

**Joint Life Table (Table II):**
- Owner ages 72-89+ with spouse age combinations
- Used only when spouse is sole beneficiary AND 10+ years younger
- Provides longer divisors to reduce annual RMD amounts

### SECURE Act 2.0 Rules Implemented

1. RMD start age increased to 73 (effective Jan 1, 2023)
2. RMD start age will increase to 75 (effective Jan 1, 2033)
3. First-year RMD deadline: April 1 of year following first RMD year
4. Subsequent RMD deadline: December 31 of each year

### Documentation References

- [IRS Publication 590-B](https://www.irs.gov/publications/p590b) - Distributions from Individual Retirement Arrangements
- [IRS RMD Worksheets](https://www.irs.gov/retirement-plans/plan-participant-employee/required-minimum-distribution-worksheets)
- [SECURE 2.0 Act Summary](https://www.irs.gov/retirement-plans/secure-20-act)

---

## Version 1.5.0 - 2025-12-03

**Type:** New Feature (MINOR)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.5.0

### Overview

Added comprehensive Emergency Fund Calculator to the budget module. This calculator provides personalized emergency fund recommendations based on employment type, expenses, dependents, and other risk factors. Features include detailed expense breakdowns, savings timeline projections with HYSA interest, milestone tracking, and scenario comparison.

### New Files Created

**src/budget/emergencyFund.ts:**

Complete emergency fund calculator with the following exports:

**Types:**
- `EmploymentType` - Union type for employment status ('w2_stable', 'w2_variable', 'self_employed', 'contract', 'retired', 'unemployed')
- `ExpenseCategory` - Interface for detailed expense breakdown by category
- `RiskAssessment` - Interface for personal risk factors affecting recommendation
- `EmergencyFundInputs` - Complete input interface for the calculator
- `FundMilestone` - Interface for savings milestones ($1,000 starter, 1/3/6 months, full goal)
- `FundScenario` - Interface for scenario comparison (3/6/9/12 months)
- `SavingsTimelinePoint` - Interface for monthly savings progression data points
- `EmergencyFundResult` - Complete result interface with all calculation outputs

**Functions:**
- `calculateEmergencyFund(inputs)` - Main calculation function returning comprehensive analysis
- `quickEmergencyFund(monthlyExpenses, months?)` - Quick calculation for simple use cases
- `timeToEmergencyFund(target, monthlyContribution, currentSavings?, interestRate?)` - Calculate months to reach goal
- `getRecommendedMonths(employmentType, dependents, hasMultipleIncomes, hasDisabilityInsurance)` - Get recommended months based on risk

**Features:**
- Risk-based month recommendations (3-12 months based on factors)
- Detailed expense category input (housing, utilities, food, transportation, healthcare, insurance, debt, other)
- Simple expense mode (single total amount)
- Risk score calculation (1-10 scale)
- Savings timeline with HYSA interest projection (default 4.5% APY)
- Progress tracking (current amount toward goal)
- Milestone tracking (starter fund through full goal)
- Scenario comparison (3/6/9/12 month targets)
- Monthly savings plan with realistic timeline
- Handles edge cases (already funded, no monthly contribution, etc.)

### Files Modified

**src/index.ts:**
Added exports for emergency fund calculator:

```typescript
// Emergency Fund Calculator
export {
  type EmploymentType,
  type ExpenseCategory,
  type RiskAssessment,
  type EmergencyFundInputs,
  type FundMilestone,
  type FundScenario,
  type SavingsTimelinePoint,
  type EmergencyFundResult,
  calculateEmergencyFund,
  quickEmergencyFund,
  timeToEmergencyFund,
  getRecommendedMonths
} from './budget/emergencyFund.js';
```

### Usage Example

```typescript
import { 
  calculateEmergencyFund,
  quickEmergencyFund,
  getRecommendedMonths
} from '@deanfinancials/calculators';

// Full calculation with risk assessment
const result = calculateEmergencyFund({
  monthlyExpenses: 4500,
  currentSavings: 5000,
  monthlyContribution: 500,
  riskAssessment: {
    employmentType: 'w2_stable',
    dependents: 2,
    hasMultipleIncomes: true,
    hasDisabilityInsurance: true
  },
  savingsInterestRate: 4.5
});

console.log(result.recommendedMonths);     // 4
console.log(result.targetAmount);          // 18000
console.log(result.monthsToGoal);          // 26
console.log(result.riskScore);             // 4

// Quick calculation
const quickResult = quickEmergencyFund(4500, 6);
console.log(quickResult.targetAmount);     // 27000
```

### Testing

- All functions validated with various input combinations
- Edge cases handled: zero expenses, already funded, no contribution, various employment types
- Integration tested in deanfi-website with React component

### Documentation

README.md updated with:
- Emergency Fund Calculator section in Quick Start Examples
- Full API documentation for all types and functions
- Usage examples for each function
- Explanation of risk assessment factors

---

## Version 1.4.0 - 2025-12-01

**Type:** New Feature (MINOR)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.4.0

### Overview

Added comprehensive CD Calculator to the investment module. Features include standard CD calculation, CD ladder building, early withdrawal penalty estimation, and CD comparison tools.

---

## Version 1.3.0 - 2025-06-14

**Type:** New Feature (MINOR)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.3.0

### Overview

Added comprehensive Net Worth Calculator to the investment module. This calculator computes total assets minus liabilities, provides financial health scoring, age-based comparisons, net worth projections, and detailed breakdowns of asset allocation and liability categories.

### New Files Created

**src/investment/netWorth.ts:**

Complete net worth calculator with the following exports:

**Types:**
- `NetWorthAssets` - Interface for all asset categories (cash, investments, retirement, real estate, vehicles, personal property, business equity, other)
- `NetWorthLiabilities` - Interface for all liability categories (mortgage, home equity loans, auto loans, student loans, credit cards, personal loans, medical debt, other)
- `FinancialHealthIndicators` - Interface for health scoring indicators
- `NetWorthBenchmark` - Interface for age-based wealth percentile benchmarks
- `NetWorthProjectionYear` - Interface for year-by-year net worth projections
- `NetWorthResult` - Complete result interface with all calculation outputs

**Functions:**
- `calculateNetWorth(assets, liabilities, age?, annualIncome?)` - Main calculation function returning comprehensive net worth analysis
- `getNetWorthBenchmarks(age?)` - Returns age-based wealth percentile benchmarks from Federal Reserve SCF data
- `calculateNetWorthProjection(netWorth, savingsRate, returnRate, years)` - Projects future net worth growth over specified years
- `getFinancialHealthScore(netWorth, assets, liabilities, age?, annualIncome?)` - Returns 0-100 health score with grade and recommendations

**Features:**
- Complete asset categorization (8 categories)
- Complete liability categorization (8 categories)
- Asset allocation percentages by category
- Liability breakdown percentages by category
- Debt-to-asset ratio calculations
- Liquidity ratio analysis
- Real estate equity calculations
- Investment diversification scoring
- Age-based wealth percentile comparisons (25th, 50th, 75th, 90th percentiles)
- Net worth projections with configurable savings and return rates
- Financial health scoring (A+ to F grades)
- Personalized recommendations based on financial situation
- Handles edge cases (zero liabilities, missing optional inputs, etc.)

### Files Modified

**src/index.ts:**
Added exports for net worth calculator:

```typescript
// Net Worth Calculator
export {
  type NetWorthAssets,
  type NetWorthLiabilities,
  type FinancialHealthIndicators,
  type NetWorthBenchmark,
  type NetWorthProjectionYear,
  type NetWorthResult,
  calculateNetWorth,
  getNetWorthBenchmarks,
  calculateNetWorthProjection,
  getFinancialHealthScore
} from './investment/netWorth.js';
```

### Usage Example

```typescript
import { 
  calculateNetWorth,
  getNetWorthBenchmarks,
  calculateNetWorthProjection,
  getFinancialHealthScore
} from '@deanfinancials/calculators';

// Define assets
const assets = {
  cash: {
    checking: 5000,
    savings: 15000,
    moneyMarket: 10000,
    certificates: 0,
    other: 0
  },
  investments: {
    stocks: 50000,
    bonds: 20000,
    mutualFunds: 30000,
    etfs: 25000,
    crypto: 5000,
    other: 0
  },
  retirement: {
    traditional401k: 150000,
    roth401k: 0,
    traditionalIRA: 25000,
    rothIRA: 35000,
    pension: 0,
    other: 0
  },
  realEstate: {
    primaryHome: 450000,
    rentalProperties: 0,
    land: 0,
    other: 0
  },
  vehicles: {
    cars: 35000,
    motorcycles: 0,
    boats: 0,
    other: 0
  },
  personalProperty: {
    jewelry: 5000,
    collectibles: 2000,
    furniture: 10000,
    electronics: 3000,
    other: 0
  },
  businessEquity: {
    ownership: 0,
    partnerships: 0,
    other: 0
  },
  otherAssets: 0
};

// Define liabilities
const liabilities = {
  mortgage: {
    primaryHome: 280000,
    rentalProperties: 0,
    other: 0
  },
  homeEquityLoans: {
    heloc: 0,
    homeEquityLoan: 0
  },
  autoLoans: {
    cars: 12000,
    motorcycles: 0,
    other: 0
  },
  studentLoans: {
    federal: 25000,
    private: 0
  },
  creditCards: {
    total: 3500
  },
  personalLoans: {
    secured: 0,
    unsecured: 0
  },
  medicalDebt: 0,
  otherLiabilities: 0
};

// Calculate net worth
const result = calculateNetWorth(assets, liabilities, 35, 85000);

console.log(result.netWorth);              // Total net worth
console.log(result.totalAssets);           // Total assets
console.log(result.totalLiabilities);      // Total liabilities
console.log(result.debtToAssetRatio);      // Debt ratio
console.log(result.assetAllocation);       // Asset breakdown percentages
console.log(result.liabilityBreakdown);    // Liability breakdown percentages
console.log(result.financialHealth);       // Health indicators
console.log(result.ageComparison);         // Age-based percentile comparison

// Get benchmarks for age
const benchmarks = getNetWorthBenchmarks(35);
console.log(benchmarks);                   // Percentile benchmarks

// Project future growth
const projection = calculateNetWorthProjection(result.netWorth, 15000, 0.07, 20);
console.log(projection);                   // Year-by-year projections

// Get health score
const healthScore = getFinancialHealthScore(
  result.netWorth, 
  assets, 
  liabilities, 
  35, 
  85000
);
console.log(healthScore.score);            // 0-100 score
console.log(healthScore.grade);            // A+ to F grade
console.log(healthScore.recommendations);  // Actionable recommendations
```

### Competitor Analysis

Before implementation, analyzed leading net worth calculators:
- **NerdWallet:** Focuses on simple asset/liability totals with education
- **SmartAsset:** Emphasizes retirement-focused breakdowns
- **Investor.gov:** Government tool with basic categories

Our implementation improves on competitors with:
- More granular asset/liability categories
- Age-based percentile comparisons from Federal Reserve data
- Financial health scoring with letter grades
- Net worth projections
- Actionable recommendations
- Visual-ready data structures for charts

### Testing

Tested with deanfi-website NetWorthCalculator component:
- All asset categories calculating correctly
- All liability categories calculating correctly
- Asset allocation percentages sum to 100%
- Liability breakdown percentages sum to 100%
- Age comparison showing correct percentile positioning
- Financial health score returning appropriate grades
- Projections showing realistic growth curves
- Edge cases handled (zero liabilities, missing age, etc.)

### Related Website Implementation

This calculator logic is used by the Net Worth Calculator on deanfi-website:
- Page: `/investment/net-worth`
- Component: `src/components/calculators/NetWorthCalculator.tsx`

---

## Version 1.2.1 - 2025-11-30

**Type:** Documentation + Restructure (PATCH)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.2.1

### Overview

1. Created new `src/budget/` directory for budget-related calculators
2. Moved Savings Goal Calculator from `src/investment/` to `src/budget/`
3. Updated README.md with complete documentation for all calculators
4. Reorganized README to match website category structure: Retirement, Debt, Investment, Budget

### Directory Changes

**Before:**
```
src/
├── debt/
├── investment/
│   ├── compoundInterest.ts
│   └── savingsGoal.ts      ← Was here
├── retirement/
└── index.ts
```

**After:**
```
src/
├── budget/
│   └── savingsGoal.ts      ← Moved here
├── debt/
├── investment/
│   └── compoundInterest.ts
├── retirement/
└── index.ts
```

### Files Changed

**src/budget/savingsGoal.ts:**
- Moved from `src/investment/savingsGoal.ts`
- Updated import path for `compoundInterest.js` to `../investment/compoundInterest.js`

**src/index.ts:**
- Changed Savings Goal export from `./investment/savingsGoal.js` to `./budget/savingsGoal.js`
- Added "Budget Calculators" comment section

**README.md:**
- Added complete documentation for Compound Interest Calculator (#10)
- Added complete documentation for Savings Goal Calculator (#11)
- Reorganized sections: "Investment & Savings" split into "Investment" and "Budget"
- Fixed example code to use correct interface property names
- Updated repository URL references

### Standard Established

This update establishes the category structure for the npm package:
- **Retirement**: `src/retirement/` - Retirement planning calculators
- **Debt**: `src/debt/` - Debt management calculators  
- **Investment**: `src/investment/` - Investment growth calculators
- **Budget**: `src/budget/` - Budget and savings goal calculators

This matches the website navigation structure at deanfi.com.

---

## Version 1.2.0 - 2025-11-30

**Type:** New Feature (MINOR)  
**Status:** Published  
**npm:** @deanfinancials/calculators@1.2.0

### Overview

Added Savings Goal Calculator to the investment module. This calculator determines how much to save monthly to reach any financial goal, with support for emergency funds, home down payments, and custom goals. Includes milestone tracking, scenario comparison, and quick calculators for common goal types.

### New Files Created

**src/investment/savingsGoal.ts:**

Complete savings goal calculator with the following exports:

**Types:**
- `SavingsGoalType` - Union type: 'emergency-fund' | 'home-down-payment' | 'car' | 'vacation' | 'education' | 'wedding' | 'retirement' | 'custom'
- `ContributionFrequency` - Union type: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually'
- `SavingsGoalInputs` - Interface for calculator inputs
- `YearlyProgress` - Interface for year-by-year progress with status tracking
- `GoalMilestone` - Interface for milestone tracking (25%, 50%, 75%, 100%)
- `SavingsScenario` - Interface for scenario comparison
- `SavingsGoalResult` - Interface for complete calculation results

**Functions:**
- `getContributionPeriodsPerYear(frequency)` - Returns contribution periods per year
- `calculateSavingsGoal(inputs)` - Main calculation function
- `calculateTimeToGoal(goalAmount, currentSavings, monthlyContribution, returnRate)` - Calculate time to reach goal
- `calculateEmergencyFundGoal(monthlyExpenses, months)` - Quick calculator for emergency fund
- `calculateDownPaymentGoal(homePrice, downPaymentPercent, includeClosingCosts)` - Quick calculator with closing costs
- `compareSavingsScenarios(scenarios)` - Compare multiple goal scenarios

**Features:**
- Calculates required monthly/annual savings
- Supports multiple contribution frequencies
- Year-by-year progress tracking with on-track/ahead/behind status
- Milestone tracking at 25%, 50%, 75%, 100%
- Scenario comparison (50% less, 25% less, Recommended, 25% more, 50% more)
- Contribution vs returns percentage breakdown
- Goal already achieved detection
- Warning for high required savings rates

### Files Modified

**src/index.ts:**
Added exports for savings goal calculator:
```typescript
export {
  type SavingsGoalType,
  type ContributionFrequency,
  type SavingsGoalInputs,
  type YearlyProgress,
  type GoalMilestone,
  type SavingsScenario,
  type SavingsGoalResult,
  getContributionPeriodsPerYear,
  calculateSavingsGoal,
  calculateTimeToGoal,
  calculateEmergencyFundGoal,
  calculateDownPaymentGoal,
  compareSavingsScenarios
} from './investment/savingsGoal.js';
```

### Usage Example

```typescript
import { 
  calculateSavingsGoal, 
  calculateEmergencyFundGoal,
  calculateDownPaymentGoal 
} from '@deanfinancials/calculators';

// Calculate savings for emergency fund
const emergencyGoal = calculateEmergencyFundGoal(4000, 6); // $24,000

// Calculate down payment with closing costs
const downPaymentGoal = calculateDownPaymentGoal(400000, 20, true); // $92,000

// Calculate savings plan
const result = calculateSavingsGoal({
  goalAmount: 50000,
  currentSavings: 5000,
  yearsToGoal: 5,
  expectedReturnRate: 5,
  goalType: 'home-down-payment'
});

console.log(result.monthlyContribution); // ~$641/month
console.log(result.totalReturns); // Interest earned
console.log(result.milestones); // Progress milestones
console.log(result.scenarios); // Comparison scenarios
```

### Testing

Tested with deanfi-website SavingsGoalCalculator component:
- All goal types working
- Quick calculators producing correct results
- Progress chart rendering correctly
- Milestones tracking properly
- Scenario comparison table accurate

---

## Version 1.1.0 - 2025-01-XX

**Type:** New Feature (MINOR)  
**Status:** Ready for publish  
**npm:** (pending publication)

### Overview

Added new Investment calculator module with Compound Interest calculator as the first investment tool. This calculator supports continuous and discrete compounding, regular contributions, and provides detailed yearly breakdowns.

### New Files Created

**src/investment/compoundInterest.ts:**

Complete compound interest calculator with the following exports:

**Types:**
- `CompoundingFrequency` - Union type: 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily' | 'continuously'
- `ContributionTiming` - Union type: 'beginning' | 'end'
- `CompoundInterestInputs` - Interface for calculator inputs
- `YearlyBreakdown` - Interface for year-by-year results
- `CompoundInterestResult` - Interface for final calculation results

**Functions:**
- `getPeriodsPerYear(frequency)` - Returns periods per year for given frequency
- `calculateEffectiveAnnualRate(nominalRate, frequency)` - Calculates APY from APR
- `calculateYearsToDouble(annualRate)` - Rule of 72 calculation
- `calculateCompoundInterest(inputs)` - Main calculation function
- `compareCompoundInterestScenarios(scenarios)` - Compare multiple scenarios

**Features:**
- Supports continuous compounding (e^rt formula)
- Supports discrete compounding (standard compound interest formula)
- Regular contribution handling with beginning/end of period timing
- Year-by-year breakdown with principal/interest tracking
- Effective annual rate (APY) calculation
- Rule of 72 for doubling time estimation
- Scenario comparison functionality

### Files Modified

**src/index.ts:**
Added exports for the new investment module:

```typescript
// Investment Calculators
export {
  type CompoundingFrequency,
  type ContributionTiming,
  type CompoundInterestInputs,
  type YearlyBreakdown,
  type CompoundInterestResult,
  getPeriodsPerYear,
  calculateEffectiveAnnualRate,
  calculateYearsToDouble,
  calculateCompoundInterest,
  compareCompoundInterestScenarios
} from './investment/compoundInterest.js';
```

### Documentation Updates

**DEVELOPER_REQUIREMENTS.md:**
- Added "Adding New Calculators (REQUIRED PROCESS)" section
- Documented the requirement that all calculation logic must be added to this package first
- Added category structure table (Debt, Retirement, Investment, future Tax/Budget)
- Added new calculator development workflow

### Usage Example

```typescript
import { 
  calculateCompoundInterest,
  calculateEffectiveAnnualRate,
  calculateYearsToDouble 
} from '@deanfinancials/calculators';

// Calculate compound interest
const result = calculateCompoundInterest({
  principal: 10000,
  annualRate: 0.08,
  years: 30,
  compoundingFrequency: 'monthly',
  monthlyContribution: 500,
  contributionTiming: 'end'
});

console.log(result.finalBalance);       // Final amount
console.log(result.totalContributions); // Total contributed
console.log(result.totalInterest);      // Interest earned
console.log(result.yearlyBreakdown);    // Year-by-year details

// Calculate APY
const apy = calculateEffectiveAnnualRate(0.08, 'monthly');
// Returns: 0.0830 (8.30% effective annual rate)

// Rule of 72
const yearsToDouble = calculateYearsToDouble(0.08);
// Returns: 9.01 years to double at 8% interest
```

### Related Website Implementation

This calculator logic is used by the Compound Interest Calculator on deanfi-website:
- Page: `/investment/compound-interest`
- Component: `src/components/calculators/CompoundInterestCalculator.tsx`

### Testing Required (Before Publish)

```bash
npm run build
# Verify dist/investment/compoundInterest.js exists
# Verify exports in dist/index.js include investment module

# Test locally with npm link
npm link
cd ../deanfi-website
npm link @deanfinancials/calculators
npm run dev
# Visit /investment/compound-interest and test calculations
```

---

## Version 1.0.1 - 2025-11-21

**Type:** Bug Fix (PATCH)  
**Published:** November 21, 2025  
**npm:** https://www.npmjs.com/package/@deanfinancials/calculators/v/1.0.1

### Problem Statement

After publishing v1.0.0, consumers of the package encountered a critical error:

```
Cannot find module '/path/to/node_modules/@deanfinancials/calculators/dist/retirement/retirement' 
imported from /path/to/node_modules/@deanfinancials/calculators/dist/index.js
```

**Root Cause:** TypeScript compilation was not adding `.js` extensions to relative import paths in the compiled output. Node.js ESM loader requires explicit file extensions for relative imports.

### Technical Analysis

**Problem Details:**

1. TypeScript source file (`src/index.ts`) had imports without extensions:
   ```typescript
   export * from './retirement/retirement';  // Missing .js
   ```

2. TypeScript compiler configuration had `moduleResolution: "bundler"`:
   ```jsonc
   {
     "compilerOptions": {
       "moduleResolution": "bundler"  // Wrong for npm packages
     }
   }
   ```

3. Compiled output (`dist/index.js`) retained the extension-less imports:
   ```javascript
   export * from './retirement/retirement';  // Missing .js
   ```

4. Node.js ESM loader failed to resolve the module because:
   - ESM requires explicit file extensions for relative imports
   - Without `.js`, Node.js doesn't know if it should look for `.js`, `.json`, `.node`, etc.

**Why This Happened:**

- `moduleResolution: "bundler"` is designed for bundlers (Webpack, Vite, etc.) that handle extension resolution automatically
- npm packages need `moduleResolution: "node"` which follows Node.js resolution rules
- Even with correct `moduleResolution`, TypeScript won't automatically add `.js` to source file imports

### Solution Implemented

**1. Updated All Import Statements** (`src/index.ts`)

```typescript
// Before (v1.0.0)
export * from './retirement/retirement';
export * from './retirement/withdrawalStrategy';
export * from './debt/debtPayoff';
// etc.

// After (v1.0.1)
export * from './retirement/retirement.js';
export * from './retirement/withdrawalStrategy.js';
export * from './debt/debtPayoff.js';
// etc.
```

**Why `.js` not `.ts`:** TypeScript requires the extension to match the **compiled output**, not the source file. Since TypeScript compiles `.ts` to `.js`, we use `.js` in the import statement.

**2. Updated TypeScript Configuration** (`tsconfig.json`)

```jsonc
{
  "compilerOptions": {
    "moduleResolution": "node"  // Changed from "bundler"
  }
}
```

This ensures proper Node.js-style module resolution.

**3. Verified Build Output**

After rebuilding, `dist/index.js` now contains:

```javascript
export * from './retirement/retirement.js';
export * from './retirement/withdrawalStrategy.js';
export * from './debt/debtPayoff.js';
// etc.
```

### Files Modified

- `src/index.ts` - Added `.js` extensions to all 9 export statements
- `tsconfig.json` - Changed `moduleResolution` from `"bundler"` to `"node"`
- `package.json` - Bumped version from `1.0.0` to `1.0.1`

### Testing Performed

1. **Build Verification:**
   ```bash
   npm run build
   cat dist/index.js  # Verified .js extensions present
   ```

2. **Local Link Test:**
   ```bash
   # In calculator package
   npm link
   
   # In website package
   npm link @deanfinancials/calculators
   npm run dev
   # Verified calculator page loads without errors
   ```

3. **npm Publication:**
   ```bash
   npm publish --access public
   # Published successfully as v1.0.1
   ```

4. **Consumer Installation Test:**
   ```bash
   # In website package
   npm unlink @deanfinancials/calculators
   npm install @deanfinancials/calculators@latest
   npm run dev
   # Verified calculator works with published version
   ```

5. **Consumer Package Update (CRITICAL STEP):**
   ```bash
   # In deanfi-website repository
   # Updated package.json: "@deanfinancials/calculators": "^1.0.1"
   npm install  # Updated package-lock.json
   
   # Verified changes
   git diff package.json package-lock.json
   
   # Committed updates
   git add package.json package-lock.json
   git commit -m "chore: update @deanfinancials/calculators to v1.0.1"
   ```

**Important Note:** This step is CRITICAL and must be performed after EVERY package publish. Without updating the consumer's package.json and package-lock.json, production deployments will continue using the old version, even though the new version exists on npm.

### Migration Guide

For consumers upgrading from v1.0.0 to v1.0.1:

**No code changes required.** This is a transparent bug fix.

Simply update the package:

```bash
npm update @deanfinancials/calculators
```

Or install the latest version:

```bash
npm install @deanfinancials/calculators@latest
```

### Lessons Learned

1. **Always verify ESM output** - Check `dist/` files have correct `.js` extensions
2. **Test published packages** - Don't rely solely on `npm link` for testing
3. **Use `moduleResolution: "node"` for npm packages** - Not `"bundler"`
4. **TypeScript requires runtime extensions** - Use `.js` in source for ESM output
5. **Dry-run doesn't catch module resolution issues** - Need actual installation test

### Documentation Updates

- Updated `DEVELOPER_REQUIREMENTS.md` with ESM import path requirements
- Added troubleshooting section for "Cannot find module" errors
- Documented correct TypeScript configuration for npm packages

---

## Version 1.0.0 - 2025-11-21

**Type:** Initial Public Release (MAJOR)  
**Published:** November 21, 2025  
**npm:** https://www.npmjs.com/package/@deanfinancials/calculators/v/1.0.0  
**Status:** Deprecated (use v1.0.1 - contains ESM bug fix)

### Overview

First public release of the `@deanfinancials/calculators` package to npm registry. This package contains all financial calculation logic used on DeanFinancials.com, published for transparency and public verification.

### Package Details

**Package Information:**
- **Name:** @deanfinancials/calculators
- **Scope:** @deanfinancials (organization)
- **Version:** 1.0.0
- **License:** MIT
- **Type:** ESM (module)
- **Size:** 24.8 kB (tarball), 104.4 kB (unpacked)
- **Files:** 43 files

**npm Configuration:**

```json
{
  "name": "@deanfinancials/calculators",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### Included Calculators

**Debt Calculators:**
1. `calculateDebtPayoff()` - Avalanche and snowball debt payoff strategies
2. `calculateCreditCardPayoff()` - Credit card payoff calculator
3. `calculateDTI()` - Debt-to-income ratio calculator
4. `calculateLoanAmortization()` - Loan amortization schedules
5. `calculateMortgage()` - Mortgage payment and amortization

**Retirement Calculators:**
1. `calculateRetirementBalance()` - Retirement savings projections
2. `calculateWithdrawalStrategy()` - Fixed vs dynamic withdrawal strategies
3. `calculateClaimingStrategy()` - Social Security claiming age analysis
4. `calculateFourZeroOneKVsIRA()` - 401(k) vs IRA comparison

### TypeScript Configuration

**Initial Configuration (v1.0.0):**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",  // NOTE: Changed to "node" in v1.0.1
    "resolveJsonModule": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### npm Organization Setup

**Organization Creation:**
- **Organization Name:** deanfinancials
- **URL:** https://www.npmjs.com/org/deanfinancials
- **Created:** November 21, 2025
- **Purpose:** Host all DeanFinancials public packages

**Initial Member:**
- Username: gibsonneo
- Role: Owner

### Publication Process

**Authentication Method:**

Due to WSL environment limitations with browser-based npm login, used legacy authentication:

```bash
npm adduser --auth-type=legacy
```

Provided:
- Username: gibsonneo
- Password: (secure)
- Email: (public)
- OTP: 065081 (from email)

**Publication Command:**

```bash
npm publish --access public
```

**Result:** Successfully published to https://registry.npmjs.org/

### Build Output

**Generated Files (43 total):**

```
dist/
├── index.js (912 bytes)
├── index.d.ts (1.2 kB)
├── index.d.ts.map
├── index.js.map
├── debt/
│   ├── creditCardPayoff.js (3.3 kB)
│   ├── creditCardPayoff.d.ts (1.7 kB)
│   ├── debtPayoff.js (3.7 kB)
│   ├── debtPayoff.d.ts (1.8 kB)
│   ├── debtToIncomeRatio.js (2.3 kB)
│   ├── debtToIncomeRatio.d.ts (1.2 kB)
│   ├── loanCalculator.js (3.6 kB)
│   ├── loanCalculator.d.ts (2.0 kB)
│   ├── mortgageCalculator.js (7.2 kB)
│   ├── mortgageCalculator.d.ts (2.4 kB)
│   └── (source maps for each)
└── retirement/
    ├── fourZeroOneKVsIRA.js (3.5 kB)
    ├── fourZeroOneKVsIRA.d.ts (1.3 kB)
    ├── retirement.js (3.5 kB)
    ├── retirement.d.ts (2.1 kB)
    ├── socialSecurity.js (6.2 kB)
    ├── socialSecurity.d.ts (2.9 kB)
    ├── withdrawalStrategy.js (3.9 kB)
    ├── withdrawalStrategy.d.ts (1.6 kB)
    └── (source maps for each)
```

### Known Issue (Fixed in v1.0.1)

**Issue:** Module resolution errors when importing package

**Symptom:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**Resolution:** Upgrade to v1.0.1

### Initial Consumers

**Primary Consumer:** deanfi-website (DeanFinancials.com)

**Installation in deanfi-website:**

```bash
npm install @deanfinancials/calculators
```

**Usage Example:**

```typescript
// src/components/calculators/DebtPayoffCalculator.tsx
import { calculateDebtPayoff } from '@deanfinancials/calculators';

const results = calculateDebtPayoff({
  debts: [
    { balance: 5000, interestRate: 18, minimumPayment: 150 },
    { balance: 3000, interestRate: 12, minimumPayment: 90 }
  ],
  extraMonthlyPayment: 200,
  strategy: 'avalanche'
});
```

---

## Pre-Publication Development

### Project Initialization

**Date:** November 2025  
**Repository Created:** https://github.com/GibsonNeo/deanfi-calculators

### Initial Structure Setup

**Created Files:**
- `package.json` - Package metadata and scripts
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Main export file
- `.gitignore` - Git ignore rules
- `.npmignore` - npm publish ignore rules
- `LICENSE` - MIT license
- `README.md` - Package documentation

**Initial package.json:**

```json
{
  "name": "@deanfinancials/calculators",
  "version": "1.0.0",
  "description": "Transparent financial calculator library used by DeanFinancials.com",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "echo \"No tests yet\" && exit 0",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "finance",
    "calculator",
    "debt",
    "retirement",
    "mortgage",
    "transparent"
  ],
  "author": "Dean Financials",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/GibsonNeo/deanfi-calculators.git"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

### Calculator Implementations

**Debt Calculators Implemented:**

1. **debtPayoff.ts** - Debt avalanche and snowball strategies
   - Types: `Debt`, `PayoffResult`, `DebtSnapshot`, `MonthlySnapshot`
   - Functions: `calculateDebtPayoff()`, `comparePayoffStrategies()`
   - Algorithm: Prioritizes by interest rate (avalanche) or balance (snowball)
   - Month-by-month amortization tracking

2. **creditCardPayoff.ts** - Credit card payoff scenarios
   - Types: `CreditCardInputs`, `PayoffScenario`, `MonthlySnapshot`
   - Function: `calculateCreditCardPayoff()`
   - Handles minimum payment-only vs accelerated payoff

3. **debtToIncomeRatio.ts** - DTI calculation
   - Types: `DebtItem`, `DTIResult`
   - Function: `calculateDTI()`
   - Calculates front-end and back-end DTI ratios

4. **loanCalculator.ts** - General loan amortization
   - Types: `LoanInputs`, `AmortizationSchedule`, `LoanSummary`
   - Functions: `calculateMonthlyPayment()`, `calculateLoanAmortization()`, `calculateRemainingBalance()`

5. **mortgageCalculator.ts** - Mortgage-specific calculations
   - Types: `MortgageInputs`, `MortgageAmortizationEntry`, `MortgageSummary`
   - Functions: `calculateMortgage()`, `calculateAffordableHome()`
   - Includes PMI, property taxes, insurance

**Retirement Calculators Implemented:**

1. **retirement.ts** - Basic retirement projections
   - Compound interest with monthly contributions
   - Inflation adjustment
   - Year-by-year projections

2. **withdrawalStrategy.ts** - Retirement withdrawal strategies
   - Fixed dollar withdrawals (4% rule)
   - Dynamic percentage withdrawals
   - Success probability analysis

3. **socialSecurity.ts** - Social Security benefit calculations
   - Claiming age optimization (62-70)
   - Full Retirement Age (FRA) adjustments
   - Delayed retirement credits
   - Break-even analysis

4. **fourZeroOneKVsIRA.ts** - 401(k) vs IRA comparison
   - Tax-deferred vs Roth comparisons
   - Employer match considerations
   - Contribution limit analysis

### CommonJS to ESM Migration

**Initial Implementation:** CommonJS modules

**Problem:** deanfi-website uses Astro/Vite which requires ESM

**Migration Steps:**

1. **Added to package.json:**
   ```json
   {
     "type": "module"
   }
   ```

2. **Updated tsconfig.json:**
   ```jsonc
   {
     "compilerOptions": {
       "module": "ES2020",  // Changed from "commonjs"
       "target": "ES2020"
     }
   }
   ```

3. **Fixed Duplicate Exports:**
   - Issue: Both `debtPayoff.ts` and `creditCardPayoff.ts` exported `MonthlySnapshot`
   - Solution: Renamed to `DebtPayoffMonthlySnapshot` and `CreditCardMonthlySnapshot`

**Result:** Successfully converted to ESM, compatible with modern bundlers

### Local Development Setup

**npm link workflow for local testing:**

```bash
# In deanfi-calculators
npm link

# In deanfi-website
npm link @deanfinancials/calculators
```

This created a symlink for development:
```
deanfi-website/node_modules/@deanfinancials/calculators
  → /home/wes/deanfinancialsrepos/deanfi-calculators
```

**Benefits:**
- Real-time changes reflected in website
- No need to republish for testing
- Easy debugging with source maps

**Limitations:**
- Only works locally
- Must unlink before publishing to npm
- Can cause confusion if left linked

---

## Development Philosophy

### Transparency First

Every calculator in this package is:

1. **Open Source** - Full source code available on GitHub
2. **Well-Documented** - Comments explain formulas and edge cases
3. **Type-Safe** - Complete TypeScript definitions
4. **Independently Verifiable** - Users can verify calculations

### No Black Boxes

Financial calculations should never be:
- Obfuscated or minified (source is readable)
- Hidden in closed-source libraries
- Proprietary or secret

Users have a right to know how their financial projections are calculated.

### Accuracy Over Everything

- Use precise decimal math
- Handle edge cases explicitly
- Document rounding behavior
- Test against known examples
- Never sacrifice accuracy for performance

### Calculation Methodology

All calculators follow established financial principles:

- **Debt Payoff:** Standard avalanche/snowball methodologies
- **Compound Interest:** Standard financial formulas (FV, PV, PMT)
- **Amortization:** Standard loan amortization formula
- **Social Security:** Based on SSA published rules
- **Retirement Projections:** Monte Carlo simulations and deterministic models

---

## Future Roadmap

### Planned Features

**v1.1.0 - Testing Infrastructure**
- [ ] Vitest setup
- [ ] Unit tests for all calculators
- [ ] Integration tests
- [ ] Regression test suite
- [ ] CI/CD with GitHub Actions

**v1.2.0 - Additional Calculators**
- [ ] Investment return calculators
- [ ] Tax estimation calculators
- [ ] Budget planning tools
- [ ] College savings (529) calculators
- [ ] Life insurance needs calculator

**v1.3.0 - Enhanced Features**
- [ ] Inflation adjustment options
- [ ] Multiple interest rate scenarios
- [ ] Monte Carlo simulations
- [ ] Historical data backtesting

**v2.0.0 - Breaking Changes (TBD)**
- [ ] Potential API redesign based on usage feedback
- [ ] Performance optimizations
- [ ] WebAssembly for complex calculations

### Documentation Improvements

- [ ] Auto-generated API documentation (TypeDoc)
- [ ] Interactive examples website
- [ ] Formula explanation pages
- [ ] Video tutorials
- [ ] Comparison with other calculators

---

## Collaboration Guidelines

### Contributing Calculators

When adding new calculators:

1. **Research** - Verify formula against authoritative sources
2. **Document** - Include formula reference and methodology
3. **Test** - Create test cases with known examples
4. **Type Safety** - Full TypeScript definitions
5. **Pure Functions** - No side effects
6. **Edge Cases** - Handle all edge cases explicitly

### Code Review Checklist

- [ ] All functions have JSDoc comments
- [ ] TypeScript types are complete
- [ ] No runtime dependencies added
- [ ] Formulas match documented methodology
- [ ] Edge cases are handled
- [ ] Examples are provided
- [ ] Tests are included
- [ ] README is updated
- [ ] CHANGELOG is updated

---

## Support and Contact

**Issues:** https://github.com/GibsonNeo/deanfi-calculators/issues  
**Discussions:** https://github.com/GibsonNeo/deanfi-calculators/discussions  
**Email:** support@deanfinancials.com  
**Website:** https://deanfinancials.com

---

## License

MIT License - See [LICENSE](./LICENSE) file

---

**Document Maintained By:** DeanFinancials Development Team  
**Last Updated:** November 21, 2025  
**Document Version:** 1.0.0
