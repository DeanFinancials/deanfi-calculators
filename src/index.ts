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

// RMD (Required Minimum Distribution) Calculator
export {
  type RetirementAccountType,
  type RMDInputs,
  type YearlyRMDProjection,
  type RMDResult,
  type MultiAccountRMDResult,
  type TaxImpactEstimate,
  type QCDAnalysis,
  UNIFORM_LIFETIME_TABLE,
  JOINT_LIFE_TABLE,
  RMD_REQUIRED_ACCOUNTS,
  RMD_EXEMPT_ACCOUNTS,
  calculateAge,
  getRMDStartAge,
  getFirstRMDYear,
  qualifiesForJointLifeTable,
  getDistributionPeriod,
  calculateSingleYearRMD,
  formatRMDDeadline,
  calculateRMD,
  calculateMultipleAccountRMDs,
  estimateRMDTaxImpact,
  analyzeQCDOpportunity
} from './retirement/rmdCalculator.js';

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

// CD (Certificate of Deposit) Calculator
export {
  type CDCompoundingFrequency,
  type CDTermMonths,
  type CDInputs,
  type CDMonthlyBreakdown,
  type CDResult,
  type CDLadderRung,
  type CDLadderResult,
  type EarlyWithdrawalResult,
  type EarlyWithdrawalPenaltyType,
  type EarlyWithdrawalPenalty,
  type CDScenario,
  type CDComparisonResult,
  TYPICAL_PENALTIES,
  TYPICAL_CD_RATES,
  getCompoundingPeriodsPerYear,
  apyToApr,
  aprToApy,
  calculateCD,
  buildCDLadder,
  calculateEarlyWithdrawal,
  compareCDScenarios,
  quickCDCalculation,
  getTypicalPenalty
} from './investment/cdCalculator.js';

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

// Emergency Fund Calculator
export {
  type EmploymentType,
  type ExpenseCategory,
  type ExpenseEntry,
  type EmergencyFundInputs,
  type ExpenseBreakdown,
  type FundMilestone,
  type MonthlyProgress as EmergencyFundMonthlyProgress,
  type FundScenario,
  type RiskAssessment,
  type EmergencyFundResult,
  EXPENSE_CATEGORY_NAMES,
  calculateEmergencyFund,
  quickEmergencyFund,
  timeToEmergencyFund,
  getRecommendedMonths
} from './budget/emergencyFund.js';

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
