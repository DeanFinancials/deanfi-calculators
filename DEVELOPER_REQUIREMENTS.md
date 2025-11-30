# Developer Requirements - @deanfinancials/calculators

**Package:** @deanfinancials/calculators  
**Version:** 1.0.1  
**Type:** TypeScript ESM Library  
**Purpose:** Transparent financial calculation logic for DeanFinancials.com  
**Registry:** https://www.npmjs.com/package/@deanfinancials/calculators  
**Repository:** https://github.com/GibsonNeo/deanfi-calculators

---

## Table of Contents

- [Overview](#overview)
- [Package Philosophy](#package-philosophy)
- [Technical Stack](#technical-stack)
- [Module System Requirements](#module-system-requirements)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [TypeScript Configuration](#typescript-configuration)
- [Build Process](#build-process)
- [Testing Strategy](#testing-strategy)
- [Publishing Workflow](#publishing-workflow)
- [Version Management](#version-management)
- [Code Standards](#code-standards)
- [Documentation Requirements](#documentation-requirements)
- [Breaking Changes Policy](#breaking-changes-policy)

---

## Overview

The `@deanfinancials/calculators` package is a pure TypeScript library containing all financial calculation logic used on DeanFinancials.com. This package exists for **transparency** - allowing users to verify the exact formulas and algorithms used for financial calculations.

### Key Principles

1. **Zero Runtime Dependencies** - Pure TypeScript/JavaScript only
2. **Pure Functions** - All calculators are side-effect free
3. **Full Type Safety** - Comprehensive TypeScript definitions
4. **Public Transparency** - Open source for verification
5. **Semantic Versioning** - Strict semver compliance
6. **ESM-First** - Modern ES Module format

---

## Package Philosophy

### Why This Package Exists

Financial calculations impact real-world financial decisions. Users deserve to:

- **Verify accuracy** - See the exact formulas used
- **Understand methodology** - Know how numbers are derived
- **Trust results** - Confirm calculations are mathematically sound
- **Reproduce calculations** - Run the same logic independently

### Design Principles

1. **Transparency Over Obfuscation**
   - Clear variable names
   - Commented formulas
   - Documented edge cases
   - No minification of logic

2. **Accuracy Over Performance**
   - Precision decimal handling
   - Rounding documented explicitly
   - Edge cases handled conservatively

3. **Simplicity Over Cleverness**
   - Straightforward implementations
   - Readable over compact
   - Self-documenting code

---

## Technical Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | ^5.x | Type-safe development |
| Node.js | >= 18.0.0 | Runtime (dev only) |
| npm | >= 9.0.0 | Package management |

### No Runtime Dependencies

This package intentionally has **zero runtime dependencies**. All calculations are implemented using:

- Pure JavaScript/TypeScript
- Native Math functions
- No external libraries

This ensures:
- Maximum portability
- Minimal security surface
- Easy auditing
- No supply chain risks

---

## Module System Requirements

### ESM-First Architecture

This package uses **ES Modules (ESM)** exclusively.

**Critical Configuration:**

```json
// package.json
{
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

### Import Path Requirements

**CRITICAL:** All relative imports in TypeScript source files MUST include `.js` extensions:

```typescript
// ✅ CORRECT
export * from './retirement/retirement.js';
export * from './debt/debtPayoff.js';

// ❌ INCORRECT - Will cause "Cannot find module" errors
export * from './retirement/retirement';
export * from './debt/debtPayoff';
```

**Why:** Node.js ESM loader requires explicit file extensions. TypeScript won't add them automatically when using `module: "ES2020"`.

### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",           // Modern JS features
    "module": "ES2020",           // ESM output
    "moduleResolution": "node",   // Standard Node.js resolution
    "lib": ["ES2020"],
    "declaration": true,          // Generate .d.ts files
    "declarationMap": true,       // Source maps for types
    "sourceMap": true,            // Source maps for debugging
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,               // Maximum type safety
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

---

## Development Environment

### Prerequisites

```bash
# Node.js version
node --version  # Should be >= 18.0.0

# npm version
npm --version   # Should be >= 9.0.0
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/GibsonNeo/deanfi-calculators.git
cd deanfi-calculators

# Install dependencies (dev only)
npm install

# Build package
npm run build

# Run tests (when implemented)
npm test
```

### Development Workflow

1. **Make Changes** - Edit TypeScript files in `src/`
2. **Build** - Run `npm run build` to compile
3. **Test Locally** - Use `npm link` for local testing
4. **Verify** - Check `dist/` output has `.js` extensions in imports
5. **Version** - Update version in `package.json`
6. **Publish** - Run `npm publish --access public`

---

## Project Structure

```
deanfi-calculators/
├── src/                          # Source TypeScript files
│   ├── index.ts                  # Main export file (with .js extensions!)
│   ├── debt/
│   │   ├── debtPayoff.ts
│   │   ├── creditCardPayoff.ts
│   │   ├── debtToIncomeRatio.ts
│   │   ├── loanCalculator.ts
│   │   └── mortgageCalculator.ts
│   └── retirement/
│       ├── retirement.ts
│       ├── withdrawalStrategy.ts
│       ├── socialSecurity.ts
│       └── fourZeroOneKVsIRA.ts
├── dist/                         # Compiled JavaScript output (gitignored)
│   ├── index.js
│   ├── index.d.ts
│   ├── debt/
│   └── retirement/
├── tests/                        # Test files (future)
├── docs/                         # Additional documentation (future)
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
├── LICENSE
├── README.md
├── DEVELOPER_REQUIREMENTS.md     # This file
└── CHANGELOG_AND_IMPLEMENTATION_LOG.md
```

---

## TypeScript Configuration

### Compiler Options Explained

```jsonc
{
  "compilerOptions": {
    // Output ES2020 JavaScript
    "target": "ES2020",
    "module": "ES2020",
    
    // Use Node.js module resolution
    // IMPORTANT: "bundler" mode won't work with npm publish
    "moduleResolution": "node",
    
    // Generate TypeScript definitions
    "declaration": true,        // Creates .d.ts files
    "declarationMap": true,     // Creates .d.ts.map for IDE navigation
    "sourceMap": true,          // Creates .js.map for debugging
    
    // Paths
    "outDir": "./dist",         // Compiled output
    "rootDir": "./src",         // Source files
    
    // Strict type checking
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    
    // Module interop
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Critical Setting: moduleResolution

- **Use `"node"`** for npm packages
- **NOT `"bundler"`** - this causes missing file extensions in output

---

## Build Process

### Build Command

```bash
npm run build
```

This runs `tsc` which:

1. Compiles TypeScript to JavaScript (ES2020)
2. Generates `.d.ts` type definition files
3. Creates source maps (`.js.map`, `.d.ts.map`)
4. Outputs to `dist/` directory

### Build Output Verification

After building, verify the output:

```bash
# Check that index.js has .js extensions in imports
cat dist/index.js

# Should see:
export * from './retirement/retirement.js';
export * from './debt/debtPayoff.js';
# etc.
```

### Pre-publish Hook

The `prepublishOnly` script automatically runs the build before publishing:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

This ensures you never publish stale or unbuild code.

---

## Testing Strategy

### Current Status

**Status:** Not yet implemented  
**Priority:** High  
**Planned Framework:** Vitest

### Testing Requirements

When implementing tests, they MUST cover:

1. **Unit Tests**
   - Each calculator function
   - Edge cases (zero values, negative inputs)
   - Boundary conditions
   - Rounding accuracy

2. **Integration Tests**
   - Full calculation flows
   - Multi-step calculations
   - Data transformations

3. **Regression Tests**
   - Known calculation examples
   - Verified against third-party sources
   - Historical bug fixes

### Test Data Sources

Tests should verify against:

- Official financial formulas (published sources)
- Third-party calculator results (cross-validation)
- Known examples from financial planning books
- Edge cases from user reports

---

## Publishing Workflow

### Prerequisites

1. **npm Account**
   - Create account at https://www.npmjs.com/signup
   - Join @deanfinancials organization

2. **Authentication**
   ```bash
   # For WSL/Linux environments
   npm adduser --auth-type=legacy
   
   # Provide:
   # - Username
   # - Password
   # - Email (public)
   # - OTP (from email)
   ```

### Version Update Process

1. **Update Version**
   ```bash
   # For bug fixes (1.0.0 → 1.0.1)
   npm version patch
   
   # For new features (1.0.0 → 1.1.0)
   npm version minor
   
   # For breaking changes (1.0.0 → 2.0.0)
   npm version major
   ```

2. **Build and Verify**
   ```bash
   npm run build
   npm run test  # When implemented
   ```

3. **Dry Run** (optional but recommended)
   ```bash
   npm publish --dry-run
   ```

4. **Publish**
   ```bash
   npm publish --access public
   ```

5. **Verify Publication**
   - Check https://www.npmjs.com/package/@deanfinancials/calculators
   - Version should update within seconds
   - Download count should increment

6. **Update Consumer Projects (CRITICAL)**
   ```bash
   # In deanfi-website repository
   cd /path/to/deanfi-website
   
   # Update package.json to new version
   # Edit package.json: "@deanfinancials/calculators": "^1.0.1"
   
   # Or use npm to update automatically
   npm install @deanfinancials/calculators@latest
   
   # Verify package-lock.json updated
   grep "@deanfinancials/calculators" package-lock.json
   
   # Test the website
   npm run dev
   # Visit calculator pages and verify functionality
   
   # Commit the updates
   git add package.json package-lock.json
   git commit -m "chore: update @deanfinancials/calculators to v1.0.1"
   git push
   ```

**IMPORTANT:** After every publish, you MUST update all consumer projects:
   - deanfi-website (primary consumer)
   - Any other projects using the calculator package
   - Update both `package.json` and `package-lock.json`
   - Test thoroughly before deploying

### Post-Publish Verification

```bash
# In a separate directory
mkdir test-install && cd test-install
npm init -y
npm install @deanfinancials/calculators

# Verify import works
node -e "import('@deanfinancials/calculators').then(c => console.log(Object.keys(c)))"
```

---

## Version Management

### Semantic Versioning

This package follows [Semantic Versioning 2.0.0](https://semver.org/):

**Format:** `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x → 2.x.x) - Breaking changes
  - Changed function signatures
  - Removed exports
  - Changed calculation methodology
  
- **MINOR** (1.0.x → 1.1.x) - New features (backwards compatible)
  - New calculator functions
  - New optional parameters
  - Additional exports
  
- **PATCH** (1.0.0 → 1.0.1) - Bug fixes
  - Calculation accuracy fixes
  - TypeScript definition corrections
  - Documentation updates

### Breaking Changes

**Examples of breaking changes:**

```typescript
// BREAKING: Changed parameter name
// Before (v1.0.0)
calculateDebtPayoff({ debts, extraMonthlyPayment })

// After (v2.0.0)
calculateDebtPayoff({ debts, additionalPayment })

// BREAKING: Changed return type
// Before (v1.0.0)
type PayoffResult = { months: number }

// After (v2.0.0)
type PayoffResult = { totalMonths: number, years: number }
```

### Version History

See [CHANGELOG_AND_IMPLEMENTATION_LOG.md](./CHANGELOG_AND_IMPLEMENTATION_LOG.md) for complete version history.

---

## Code Standards

### TypeScript Style

```typescript
/**
 * Function documentation with JSDoc
 * 
 * @param inputs - Descriptive parameter documentation
 * @returns Descriptive return value documentation
 */
export function calculateExample(inputs: ExampleInputs): ExampleResult {
  // Implementation
}
```

### Naming Conventions

- **Functions:** `camelCase`, verb-first (`calculateDebtPayoff`, `compareStrategies`)
- **Types:** `PascalCase`, descriptive (`PayoffResult`, `DebtSnapshot`)
- **Variables:** `camelCase`, descriptive (`totalDebt`, `monthlyPayment`)
- **Constants:** `UPPER_SNAKE_CASE` (if truly constant)

### Type Safety

```typescript
// ✅ GOOD: Explicit types
export interface DebtInputs {
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export function calculate(inputs: DebtInputs): PayoffResult {
  // Implementation
}

// ❌ BAD: Any types
export function calculate(inputs: any): any {
  // Loses type safety
}
```

### Pure Functions

All calculators MUST be pure functions:

```typescript
// ✅ GOOD: Pure function
export function calculateTotal(debts: Debt[]): number {
  return debts.reduce((sum, debt) => sum + debt.balance, 0);
}

// ❌ BAD: Side effects
let globalTotal = 0;
export function calculateTotal(debts: Debt[]): number {
  globalTotal = debts.reduce((sum, debt) => sum + debt.balance, 0);
  return globalTotal;
}
```

---

## Documentation Requirements

### Code Documentation

Every exported function MUST have:

1. **JSDoc comment** explaining purpose
2. **Parameter descriptions** with types
3. **Return value description**
4. **Formula reference** (if applicable)
5. **Example usage** (in README)

### README Updates

When adding new calculators:

1. Add to "Available Calculators" section
2. Include usage example
3. Document formula/methodology
4. Link to relevant financial standards

### Changelog Updates

Every version MUST update `CHANGELOG_AND_IMPLEMENTATION_LOG.md` with:

- Version number and date
- Type of change (feature, fix, breaking)
- Detailed description
- Migration guide (if breaking)

---

## Breaking Changes Policy

### Communication

When introducing breaking changes:

1. **Advance Notice** - Document in README deprecation section
2. **Migration Guide** - Provide clear upgrade instructions
3. **Major Version Bump** - Always increment major version
4. **Changelog Entry** - Document all breaking changes

### Deprecation Process

```typescript
/**
 * @deprecated Use calculateDebtPayoff instead. Will be removed in v2.0.0
 */
export function oldCalculateDebt(inputs: OldInputs): OldResult {
  console.warn('oldCalculateDebt is deprecated. Use calculateDebtPayoff instead.');
  return calculateDebtPayoff(convertOldToNew(inputs));
}
```

---

## Best Practices

### 1. Always Build Before Publishing

```bash
npm run build && npm publish --access public
```

The `prepublishOnly` hook handles this automatically, but verify the build succeeded.

### 2. Test Locally Before Publishing

```bash
# In calculator package
npm run build
npm link

# In website package
npm link @deanfinancials/calculators
npm run dev
# Test thoroughly

# Unlink before publishing
npm unlink @deanfinancials/calculators
npm install @deanfinancials/calculators@latest
```

### 3. Update All Consumers After Publishing

**CRITICAL:** Every time you publish a new version, immediately update all consumer projects:

```bash
# After publishing @deanfinancials/calculators@1.0.1

# 1. Navigate to consumer project
cd /path/to/deanfi-website

# 2. Update package.json manually
# Change: "@deanfinancials/calculators": "^1.0.0"
# To:     "@deanfinancials/calculators": "^1.0.1"

# Or use npm to update automatically
npm install @deanfinancials/calculators@latest

# 3. Verify package-lock.json is updated
git diff package.json package-lock.json

# 4. Test thoroughly
npm run dev
# Verify all calculator pages work

# 5. Commit and deploy
git add package.json package-lock.json
git commit -m "chore: update @deanfinancials/calculators to v1.0.1"
git push
```

**Why this matters:**
- Production deploys pull from package.json/package-lock.json
- Stale versions can cause bugs if logic changed
- Cloudflare Pages won't pick up changes without package update
- Version drift can cause confusion during debugging

### 4. Verify Import Paths

Before every publish, check `dist/index.js`:

```bash
cat dist/index.js | grep "from './"
```

Should see `.js` extensions on all relative imports.

### 5. Keep Zero Dependencies

Never add runtime dependencies. If you need utility functions:

- Implement them yourself
- Keep them small and focused
- Document the algorithm

### 5. Maintain Calculation Accuracy

- Use `Math.round()` explicitly when needed
- Document rounding behavior
- Handle edge cases (divide by zero, negative values)
- Test against known examples

---

## Common Issues and Solutions

### Issue: "Cannot find module" errors after npm install

**Cause:** Missing `.js` extensions in compiled output  
**Solution:** Verify all imports in `src/index.ts` use `.js` extensions

### Issue: Module resolution errors in TypeScript

**Cause:** `moduleResolution: "bundler"` in tsconfig.json  
**Solution:** Use `moduleResolution: "node"` for npm packages

### Issue: WSL npm login browser authentication fails

**Cause:** Browser auth doesn't redirect properly in WSL  
**Solution:** Use `npm adduser --auth-type=legacy`

### Issue: Changes not reflecting after npm install

**Cause:** npm cache or old version  
**Solution:** 
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install @deanfinancials/calculators@latest
```

### Issue: Consumer project still using old version after publish

**Cause:** package.json and package-lock.json not updated in consumer project  
**Solution:**
```bash
# In consumer project (deanfi-website)
# Update package.json version number manually
# Then run:
npm install

# Or use npm to update automatically:
npm install @deanfinancials/calculators@latest

# Verify the update
npm list @deanfinancials/calculators
# Should show: @deanfinancials/calculators@1.0.1

# Commit the changes
git add package.json package-lock.json
git commit -m "chore: update @deanfinancials/calculators to v1.0.1"
```

---

## Resources

### Official Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

### Financial Calculation References

- Debt Avalanche/Snowball: Standard personal finance methodology
- Compound Interest: Standard financial formula
- Amortization: Standard loan calculation methodology

---

## Adding New Calculators (REQUIRED PROCESS)

**CRITICAL:** Every new calculator on the website MUST have its calculation logic added to this package first.

### New Calculator Workflow

1. **Create Calculator Logic Here First:**
   - Add new TypeScript file in appropriate category folder (`src/debt/`, `src/retirement/`, `src/investment/`)
   - Define interfaces for inputs and outputs
   - Implement pure calculation functions with JSDoc documentation
   - NO side effects, NO UI logic, NO dependencies

2. **Export from Index:**
   - Add exports to `src/index.ts` with `.js` extension
   - Export all types and functions
   - Use explicit exports (not wildcard) for clarity

3. **Build and Publish:**
   ```bash
   npm run build
   npm version patch  # or minor for new features
   npm publish --access public
   ```

4. **Update Website:**
   ```bash
   cd ../deanfi-website
   npm install @deanfinancials/calculators@latest
   ```

5. **Import in Website Component:**
   ```typescript
   import { calculateCompoundInterest } from '@deanfinancials/calculators';
   ```

### Category Structure

| Category | Folder | Purpose |
|----------|--------|---------|
| Debt | `src/debt/` | Debt payoff, credit cards, loans, mortgages |
| Retirement | `src/retirement/` | Retirement planning, 401(k), Social Security |
| Investment | `src/investment/` | Compound interest, investment returns |
| (Future) | `src/tax/` | Tax calculations |
| (Future) | `src/budget/` | Budget planning tools |

### Why This Process Matters

- **Transparency:** Users can verify calculations on npm/GitHub
- **Reusability:** Same logic across website, future apps
- **Testing:** Pure functions are easier to test
- **Versioning:** Track calculation changes properly
- **No Duplication:** Single source of truth for all calculation logic

---

## Future Enhancements

### Planned Features

1. **Comprehensive Test Suite**
   - Unit tests for all calculators
   - Integration tests
   - Regression tests

2. **Additional Calculators**
   - More investment calculators (CAGR, ROI, etc.)
   - Tax calculators
   - Budget planning tools

3. **Performance Optimizations**
   - Memoization for repeated calculations
   - WebAssembly for complex calculations (if needed)

4. **Documentation Site**
   - Auto-generated API docs
   - Interactive examples
   - Formula explanations

---

## Support

**Issues:** https://github.com/GibsonNeo/deanfi-calculators/issues  
**Email:** support@deanfinancials.com  
**Website:** https://deanfinancials.com

---

**Last Updated:** November 21, 2025  
**Document Version:** 1.0.0
