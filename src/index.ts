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

// Roth IRA Conversion Calculator
export {
  type RothFilingStatus,
  type ConvertibleAccountType,
  type RothConversionInputs,
  type TaxBracket,
  type TaxImpact,
  type YearlyProjection as RothYearlyProjection,
  type BreakEvenAnalysis,
  type OptimalConversion,
  type RothConversionResult,
  FEDERAL_TAX_BRACKETS_2024 as ROTH_FEDERAL_TAX_BRACKETS_2024,
  FEDERAL_TAX_BRACKETS_2025 as ROTH_FEDERAL_TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS_2024 as ROTH_STANDARD_DEDUCTIONS_2024,
  getTaxBracket as getRothTaxBracket,
  calculateFederalTax as calculateRothFederalTax,
  getMarginalRate,
  getRoomInCurrentBracket,
  calculateTaxImpact,
  generateProjections,
  calculateBreakEven as calculateBreakEvenRoth,
  calculateOptimalConversion,
  calculateRothConversion,
  quickConversionTax,
  calculateBracketFillingAmount,
  compareConversionScenarios
} from './retirement/rothConversion.js';

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

// Dividend Income Calculator
export {
  type DividendTaxFilingStatus,
  type DividendFrequency,
  type DividendStabilityRating,
  type DividendIncomeInputs,
  type DividendYieldResult,
  type YearlyDividendProjection,
  type DividendTaxBreakdown,
  type DividendStabilityAssessment,
  type DividendIncomeResult,
  getDividendPaymentsPerYear,
  calculateDividendYield,
  calculateSharesFromInvestment,
  calculateAnnualDividendIncome,
  getQualifiedDividendTaxRate,
  estimateOrdinaryTaxRate,
  calculateDividendTaxBreakdown,
  assessDividendStability,
  calculateDividendIncome,
  quickDividendYield,
  calculateRequiredInvestment,
  compareDividendScenarios,
  estimateYearsToGoal
} from './investment/dividendCalculator.js';

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

// FIRE (Financial Independence Retire Early) Calculator
export {
  type FIREType,
  type WithdrawalStrategy,
  type FIREInputs,
  type YearlyFIREProjection,
  type FIREMilestone,
  type StressTestScenario as FIREStressTestScenario,
  type CoastFIREAnalysis,
  type BaristaFIREAnalysis,
  type SensitivityAnalysis,
  type FIREResult,
  HISTORICAL_CRISES,
  FIRE_MULTIPLIERS,
  EXPENSE_MULTIPLIERS,
  calculateFIRENumber,
  calculateYearsToFire,
  calculateSavingsRate,
  calculateCoastFIRETarget,
  calculateBaristaFIRERequirements,
  estimateSuccessProbability,
  runStressTest,
  generateProjections as generateFIREProjections,
  generateMilestones as generateFIREMilestones,
  generateSensitivityAnalysis as generateFIRESensitivityAnalysis,
  generateRecommendations as generateFIRERecommendations,
  generateWarnings as generateFIREWarnings,
  calculateFIRE,
  quickFIRENumber,
  quickYearsToFire,
  savingsRateForYears,
  compareFIREScenarios
} from './fire/fireCalculator.js';

// Savings Rate Calculator
export {
  type SavingsRateMethod,
  type SavingsRateInputs,
  type SavingsBreakdown,
  type SavingsRateByMethod,
  type FIREBenchmark,
  type YearsToRetirementChartPoint,
  type SavingsProjection,
  type SavingsScenario as SavingsRateScenario,
  type SavingsRateResult,
  FIRE_BENCHMARKS,
  DEFAULT_ASSUMPTIONS,
  calculateGrossSavingsRate,
  calculateNetSavingsRate,
  calculatePostTaxAdjustedSavingsRate,
  calculateYearsToFI,
  quickYearsToFI,
  generateYearsToRetirementChart,
  calculateSavingsBreakdown,
  calculateAllSavingsRates,
  getBenchmarksWithStatus,
  getCurrentAndNextTier,
  generateSavingsProjections,
  generateScenarios,
  generateInsights as generateSavingsInsights,
  generateWarnings as generateSavingsWarnings,
  calculateSavingsRate as calculateSavingsRateAnalysis,
  quickSavingsRate,
  monthlySavingsForRate,
  savingsRateForYearsToFI,
  compareSavingsScenarios as compareSavingsRateScenarios,
  getSavingsRateTable
} from './fire/savingsRateCalculator.js';

// Safe Withdrawal Rate (SWR) Calculator
export {
  type PortfolioAllocation,
  type SWRWithdrawalStrategy,
  type SimulationMethod,
  type SWRInputs,
  type SWRYearlyData,
  type SimulationResult,
  type WithdrawalRateSuccess,
  type TimeHorizonComparison,
  type SequenceRiskAnalysis,
  type WhatIfScenario,
  type SWRResult,
  HISTORICAL_RETURNS,
  TRINITY_STUDY_RATES,
  EXPECTED_RETURNS,
  SWR_COLORS,
  SCENARIO_COLORS,
  getBlendedReturn,
  generateRandomReturn,
  percentile,
  standardDeviation,
  runHistoricalSimulation,
  runMonteCarloSimulation,
  runAllSimulations,
  calculateWithdrawalRateComparison,
  calculateTimeHorizonComparison,
  analyzeSequenceRisk,
  generateWhatIfScenarios,
  calculateSWR,
  quickWithdrawalRate,
  quickSuccessRate,
  calculateSafeWithdrawal,
  calculatePortfolioNeeded,
  compareSWRScenarios
} from './fire/swrCalculator.js';

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

// Paycheck Calculator
export {
  type PayType,
  type PayFrequency,
  type FilingStatus,
  type USState,
  type PreTaxDeductions,
  type PostTaxDeductions,
  type PaycheckInputs,
  type TaxBreakdown,
  type DeductionBreakdown,
  type PaycheckComparison,
  type PaycheckResult,
  PAY_PERIODS_PER_YEAR,
  FEDERAL_TAX_BRACKETS_2024,
  FEDERAL_TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS_2024,
  STANDARD_DEDUCTIONS_2025,
  FICA_2024,
  FICA_2025,
  STATE_TAX_INFO,
  NO_INCOME_TAX_STATES,
  STATE_NAMES,
  calculatePaycheck,
  quickPaycheckEstimate,
  hourlyToAnnual,
  annualToHourly,
  comparePaychecks,
  compareStates,
  getTaxBracketInfo
} from './budget/paycheckCalculator.js';
