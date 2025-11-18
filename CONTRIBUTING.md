# Contributing to DeanFinancials Calculators

Thank you for your interest in improving the DeanFinancials calculator library! This repository exists for **transparency** - to show the exact calculation logic used on DeanFinancials.com.

## Types of Contributions

### Bug Reports
If you find a calculation error or mathematical mistake:

1. **Check the math** - Verify the error with specific test cases
2. **Open an issue** with:
   - Description of the incorrect calculation
   - Expected result vs actual result
   - Input values used
   - Which calculator is affected

### Formula Improvements
If you have suggestions for improved accuracy or methodology:

1. **Provide references** - Link to authoritative sources (SSA, IRS, financial standards)
2. **Show the math** - Include formulas and worked examples
3. **Explain the benefit** - Why is this approach better?

### Code Quality
Improvements to code structure, documentation, or TypeScript types:

1. **Maintain readability** - Code should be clear and well-commented
2. **Preserve accuracy** - Don't change calculation logic without verification
3. **Keep it pure** - Functions should have no side effects

## What We Don't Accept

❌ **New calculator types** - This library mirrors DeanFinancials.com calculators only  
❌ **UI/React components** - This is a pure calculation library  
❌ **External dependencies** - Keep the library dependency-free  
❌ **Breaking changes** - Maintain backward compatibility  

## Development Process

### Setup

```bash
git clone https://github.com/WestMichiganRubyTraining/deanfi-calculators.git
cd deanfi-calculators
npm install
```

### Building

```bash
npm run build
```

TypeScript compiles to `dist/` directory.

### Type Checking

```bash
npm run type-check
```

Ensure no TypeScript errors.

### Testing

```bash
npm test
```

All tests must pass before submitting.

## Pull Request Guidelines

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b fix/calculation-error`
3. **Make your changes**
   - Update calculator code
   - Add/update comments explaining formulas
   - Update README if adding examples
4. **Test thoroughly** - Verify calculations with multiple test cases
5. **Submit PR** with:
   - Clear description of changes
   - Mathematical justification for formula changes
   - Test cases demonstrating correctness

## Code Style

- Use **TypeScript** strict mode
- Add **JSDoc comments** for all public functions
- Include **formula documentation** in comments
- Use **meaningful variable names** that match formula notation
- **Round results** appropriately (usually to 2 decimal places)

### Example

```typescript
/**
 * Calculate monthly mortgage payment using amortization formula
 * 
 * Formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
 * 
 * @param principal - Loan amount (P)
 * @param interestRate - Annual interest rate as percentage
 * @param termMonths - Loan term in months (n)
 * @returns Monthly payment amount (M)
 */
export function calculateMonthlyPayment(
  principal: number,
  interestRate: number,
  termMonths: number
): number {
  const monthlyRate = interestRate / 100 / 12; // r
  
  if (interestRate === 0) {
    return principal / termMonths;
  }
  
  const payment = principal *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return Math.round(payment * 100) / 100;
}
```

## Synchronization with DeanFinancials.com

**Important**: This library must stay synchronized with the DeanFinancials.com website.

- Calculator logic changes require corresponding website updates
- Website updates should be reflected here
- Both should produce identical results for the same inputs

If you're not part of the DeanFinancials team, your contribution may need to wait for website synchronization.

## Questions?

Open an issue for:
- Clarification on formulas
- Questions about contribution process
- Discussion of calculation methodologies

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make financial calculations more transparent! 🙏
