# Changelog and Implementation Log - @deanfinancials/calculators

**Package:** @deanfinancials/calculators  
**Repository:** https://github.com/DeanFinancials/deanfi-calculators  
**npm Registry:** https://www.npmjs.com/package/@deanfinancials/calculators

This document tracks all changes, implementations, and design decisions for the calculator package.

---

## Table of Contents

- [Version 1.3.0 - Net Worth Calculator](#version-130---2025-06-14)
- [Version 1.2.1 - Budget Category & README Update](#version-121---2025-11-30)
- [Version 1.2.0 - Savings Goal Calculator](#version-120---2025-11-30)
- [Version 1.1.0 - Investment Calculator Module](#version-110---2025-01-xx)
- [Version 1.0.1 - ESM Import Path Fix](#version-101---2025-11-21)
- [Version 1.0.0 - Initial Publication](#version-100---2025-11-21)
- [Pre-Publication Development](#pre-publication-development)

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
