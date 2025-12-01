/**
 * DeanFinancials Calculator Library
 * 
 * Transparent financial calculators used on DeanFinancials.com
 * This library contains the exact calculation logic used on the website,
 * allowing for public verification of accuracy.
 */

// Retirement Calculators
export * from './retirement/retirement.js';
export * from './retirement/withdrawalStrategy.js';
export * from './retirement/socialSecurity.js';
export * from './retirement/fourZeroOneKVsIRA.js';

// Debt Calculators
export {
  type Debt,
  type PayoffResult,
  type MonthlySnapshot as DebtPayoffMonthlySnapshot,
  type DebtSnapshot,
  calculateDebtPayoff,
  comparePayoffStrategies
} from './debt/debtPayoff.js';

export {
  type DebtItem,
  type DTIResult,
  calculateDTI
} from './debt/debtToIncomeRatio.js';

export {
  type CreditCardInputs,
  type PayoffScenario,
  type MonthlySnapshot as CreditCardMonthlySnapshot,
  calculateCreditCardPayoff
} from './debt/creditCardPayoff.js';

export {
  type LoanInputs,
  type AmortizationSchedule,
  type LoanSummary,
  calculateMonthlyPayment,
  calculateLoanAmortization,
  calculateRemainingBalance
} from './debt/loanCalculator.js';

export {
  type MortgageInputs,
  type MortgageAmortizationEntry,
  type MortgageSummary,
  calculateMortgage,
  calculateAffordableHome
} from './debt/mortgageCalculator.js';

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

export {
  type AssetCategory,
  type LiabilityCategory,
  type FinancialHealthRating,
  type AssetEntry,
  type LiabilityEntry,
  type AssetSummary,
  type LiabilitySummary,
  type NetWorthInputs,
  type AssetAllocation,
  type LiabilityAllocation,
  type FinancialHealthMetrics,
  type AgeBasedComparison,
  type YearlyProjection,
  type NetWorthResult,
  ASSET_COLORS,
  LIABILITY_COLORS,
  ASSET_CATEGORY_NAMES,
  LIABILITY_CATEGORY_NAMES,
  calculateNetWorth,
  quickNetWorth,
  calculateTargetNetWorth,
  getMedianNetWorthByAge,
  yearsToReachNetWorth
} from './investment/netWorth.js';

// Budget Calculators
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
} from './budget/savingsGoal.js';
