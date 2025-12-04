/**
 * Financial Goals Monte Carlo Simulation Calculator
 * 
 * A comprehensive Monte Carlo simulation tool for planning financial goals and retirement.
 * Supports multiple simulation models for portfolio returns:
 * - Historical Returns: Randomly samples from historical market data
 * - Forecasted Returns: Uses user-specified mean and standard deviation
 * - Statistical Returns: Based on mean, volatility, and correlations of assets
 * - Parameterized Returns: Statistical distributions (Normal, Log-Normal, T-distribution)
 * 
 * Features:
 * - Multiple cashflow goals based on life stages
 * - Linear glide path from growth to income portfolio
 * - Sequence of returns risk analysis
 * - Life Stage Scenario Planner (unique feature)
 * 
 * Based on research from:
 * - Portfolio Visualizer Financial Goals
 * - Early Retirement Now SWR Series
 * - FIRECalc
 * - engaging-data.com FIRE Calculator
 * 
 * @module fire/financialGoals
 */

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Simulation model types for generating portfolio returns
 */
export type SimulationModel = 
  | 'historical'     // Random sampling from historical returns
  | 'forecasted'     // User-specified mean and standard deviation
  | 'statistical'    // Mean, volatility, and correlations
  | 'parameterized'; // Statistical distribution (Normal, Log-Normal, T)

/**
 * Statistical distribution types for parameterized returns
 */
export type DistributionType = 'normal' | 'lognormal' | 't-distribution';

/**
 * Tax treatment options for portfolio
 */
export type TaxTreatment = 'pre-tax' | 'post-tax' | 'mixed';

/**
 * Rebalancing frequency options
 */
export type RebalancingFrequency = 'monthly' | 'quarterly' | 'annually' | 'none';

/**
 * Inflation model options
 */
export type InflationModel = 'historical' | 'fixed' | 'custom';

/**
 * Cashflow type - income or expense
 */
export type CashflowType = 'income' | 'expense' | 'one-time';

/**
 * Life stage category
 */
export type LifeStage = 
  | 'accumulation'    // Still working, building wealth
  | 'transition'      // Pre-retirement, preparing
  | 'early-retirement' // Early retirement phase
  | 'traditional-retirement' // Traditional retirement
  | 'late-retirement'; // Later retirement years

/**
 * Asset class definition for portfolio allocation
 */
export interface AssetClass {
  name: string;
  allocation: number;  // Percentage (0-100)
  expectedReturn?: number; // Annual return (for forecasted/statistical)
  volatility?: number;     // Standard deviation (for forecasted/statistical)
}

/**
 * Portfolio allocation definition
 */
export interface PortfolioAllocationDef {
  stocks: number;        // 0-100
  bonds: number;         // 0-100
  cash: number;          // 0-100
  other?: number;        // 0-100 (REITs, commodities, etc.)
  customAssets?: AssetClass[];
}

/**
 * Glide path configuration for transitioning between portfolios
 */
export interface GlidePath {
  enabled: boolean;
  startYear: number;          // Year to start transition
  endYear: number;            // Year to complete transition
  startAllocation: PortfolioAllocationDef;
  endAllocation: PortfolioAllocationDef;
}

/**
 * Cashflow goal definition
 */
export interface CashflowGoal {
  id: string;
  name: string;
  type: CashflowType;
  amount: number;            // Annual amount (or one-time if type is 'one-time')
  startYear: number;         // Year to start (relative to simulation start)
  endYear?: number;          // Year to end (undefined for ongoing or one-time)
  adjustForInflation: boolean;
  growthRate?: number;       // Annual growth rate for this cashflow
}

/**
 * Life stage definition with spending and income patterns
 */
export interface LifeStageConfig {
  name: string;
  stage: LifeStage;
  startAge: number;
  endAge: number;
  annualSpending: number;
  additionalIncome?: number; // Part-time work, rental income, etc.
  specialExpenses?: CashflowGoal[];
}

/**
 * Main simulation inputs
 */
export interface FinancialGoalsInputs {
  // Portfolio settings
  initialPortfolioValue: number;
  startingAllocation: PortfolioAllocationDef;
  
  // Simulation settings
  simulationModel: SimulationModel;
  simulationYears: number;
  numberOfSimulations: number;
  
  // Age and timing
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  
  // Annual contributions/withdrawals
  annualContribution: number;       // Pre-retirement
  annualWithdrawal: number;         // Post-retirement
  contributionGrowthRate?: number;  // Annual increase in contributions
  
  // Tax and inflation
  taxTreatment: TaxTreatment;
  effectiveTaxRate?: number;        // For pre-tax calculations
  inflationModel: InflationModel;
  inflationRate?: number;           // For fixed/custom inflation
  
  // Glide path
  glidePath?: GlidePath;
  
  // Life stages (optional - for advanced planning)
  lifeStages?: LifeStageConfig[];
  
  // Additional cashflows
  cashflowGoals?: CashflowGoal[];
  
  // For forecasted/statistical models
  expectedStockReturn?: number;
  expectedBondReturn?: number;
  stockVolatility?: number;
  bondVolatility?: number;
  stockBondCorrelation?: number;
  
  // For parameterized model
  distributionType?: DistributionType;
  degreesOfFreedom?: number; // For t-distribution
  
  // Rebalancing
  rebalancingFrequency: RebalancingFrequency;
  
  // Sequence of returns risk
  analyzeSequenceRisk?: boolean;
  
  // Bootstrap settings
  useBootstrap?: boolean;
  blockSize?: number; // For block bootstrap
}

/**
 * Single year simulation data
 */
export interface YearlySimulationData {
  year: number;
  age: number;
  portfolioValueStart: number;
  portfolioValueEnd: number;
  contribution: number;
  withdrawal: number;
  netCashflow: number;
  portfolioReturn: number;
  inflation: number;
  realReturn: number;
  stocksValue: number;
  bondsValue: number;
  cashValue: number;
  allocation: PortfolioAllocationDef;
  lifeStage?: LifeStage;
}

/**
 * Single simulation result
 */
export interface SimulationRun {
  runId: number;
  success: boolean;
  finalValue: number;
  peakValue: number;
  minValue: number;
  yearlyData: YearlySimulationData[];
  yearsBeforeDepletion?: number;
  annualizedReturn: number;
  volatility: number;
}

/**
 * Percentile outcomes for simulation results
 */
export interface PercentileOutcomes {
  p5: number;
  p10: number;
  p25: number;
  p50: number; // Median
  p75: number;
  p90: number;
  p95: number;
}

/**
 * Success rate analysis
 */
export interface SuccessAnalysis {
  successRate: number;
  successfulRuns: number;
  failedRuns: number;
  averageYearsBeforeFailure?: number;
  medianFinalValue: number;
  averageFinalValue: number;
  percentileOutcomes: PercentileOutcomes;
}

/**
 * Sequence of returns risk analysis
 */
export interface SequenceRiskAnalysis {
  worstFirstFiveYearReturn: number;
  bestFirstFiveYearReturn: number;
  correlationWithSuccess: number;
  highRiskYears: number[];
  impactScore: number; // 0-100, higher = more sequence risk
  recommendations: string[];
}

/**
 * Life stage scenario for comparison
 */
export interface LifeStageScenario {
  id: string;
  name: string;
  color: string;
  inputs: Partial<FinancialGoalsInputs>;
  successRate: number;
  medianFinalValue: number;
  p10FinalValue: number;
  p90FinalValue: number;
  yearsToGoal?: number;
  insights: string[];
}

/**
 * Sensitivity analysis result
 */
export interface SensitivityResult {
  variable: string;
  baseValue: number;
  testedValues: number[];
  successRates: number[];
  medianOutcomes: number[];
  impact: 'high' | 'medium' | 'low';
}

/**
 * Complete simulation result
 */
export interface FinancialGoalsResult {
  // Summary
  successRate: number;
  medianFinalValue: number;
  averageFinalValue: number;
  
  // Detailed analysis
  successAnalysis: SuccessAnalysis;
  percentileOutcomes: PercentileOutcomes;
  
  // All simulations (may be truncated for large N)
  simulations: SimulationRun[];
  
  // Yearly percentile paths
  yearlyPercentiles: {
    year: number;
    age: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  }[];
  
  // Risk analysis
  sequenceRiskAnalysis?: SequenceRiskAnalysis;
  
  // Life stage scenarios (unique feature)
  lifeStageScenarios?: LifeStageScenario[];
  
  // Sensitivity analysis
  sensitivityAnalysis?: SensitivityResult[];
  
  // Recommendations
  recommendations: string[];
  warnings: string[];
  
  // Metadata
  modelUsed: SimulationModel;
  simulationCount: number;
  simulationYears: number;
  computeTimeMs: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Historical annual returns data (1926-2023) - Real returns (inflation-adjusted)
 * Source: Various including Shiller data, FRED
 */
export const HISTORICAL_DATA = {
  // Stocks: S&P 500 total return
  stockReturns: [
    0.1162, 0.3749, 0.4361, -0.0842, -0.2490, -0.4334, -0.0819, 0.5399, -0.0144, 0.4767,
    0.3392, -0.3503, 0.3112, -0.0041, -0.0978, -0.1159, 0.2034, 0.3644, 0.1965, 0.3672,
    -0.0807, 0.0571, 0.0506, 0.1879, 0.3181, 0.2400, 0.1878, -0.0099, 0.5262, 0.3256,
    0.0744, -0.1046, 0.4372, 0.1198, 0.0047, 0.2689, -0.0850, 0.2280, 0.1645, 0.1245,
    -0.1006, 0.2398, 0.1106, -0.0850, 0.0401, 0.1431, 0.1898, -0.1466, -0.2647, 0.3720,
    0.2384, -0.0706, 0.0656, 0.1844, 0.3242, -0.0491, 0.2155, 0.2256, 0.0627, 0.3173,
    0.1867, 0.0525, 0.1650, 0.3148, -0.0317, 0.3049, 0.0762, 0.1008, 0.0132, 0.3758,
    0.2296, 0.3336, 0.2858, 0.2104, -0.0910, -0.1189, -0.2210, 0.2869, 0.1088, 0.0491,
    0.1579, 0.0549, -0.3700, 0.2646, 0.1506, 0.0211, 0.1600, 0.3239, 0.1369, 0.0138,
    0.1196, 0.2183, -0.0438, 0.3149, 0.1840, 0.2861, -0.1204, 0.2658
  ],
  // Bonds: 10-year Treasury
  bondReturns: [
    0.0577, 0.0430, 0.0084, 0.0342, 0.0466, -0.0231, 0.1282, 0.0179, 0.1001, 0.0714,
    0.0025, 0.0460, 0.0445, 0.0232, 0.0300, -0.0088, 0.0297, 0.0276, 0.0125, -0.0072,
    -0.0259, -0.0041, -0.0010, 0.0168, 0.0070, -0.0193, -0.0051, 0.0003, -0.0120, -0.0673,
    0.0744, -0.0527, -0.0138, 0.0109, 0.1324, 0.0370, 0.0306, 0.0172, 0.0366, -0.0183,
    0.1223, 0.0584, -0.0113, -0.0118, 0.0481, -0.0195, 0.0028, 0.0507, -0.0107, 0.0505,
    0.0095, 0.0127, 0.0191, -0.0008, 0.0143, -0.0056, -0.0117, 0.0113, -0.0007, 0.0135,
    0.0277, 0.0155, -0.0074, 0.0188, 0.0082, 0.0158, 0.2546, 0.1468, 0.1867, 0.0056,
    -0.0102, 0.1829, 0.1029, -0.0803, 0.1451, 0.0861, 0.0166, 0.1022, 0.0201, 0.0110,
    0.1321, -0.1125, 0.0594, 0.0706, 0.0569, -0.0202, 0.0895, 0.0251, 0.0065, 0.0089,
    -0.0002, 0.0984, 0.0675, -0.1112, 0.0372, -0.0102, -0.1717, 0.0385
  ],
  // Inflation (CPI)
  inflation: [
    0.0149, -0.0097, -0.0104, 0.0020, -0.0603, -0.0952, -0.1027, -0.0531, 0.0303, 0.0247,
    0.0142, 0.0309, -0.0210, -0.0048, 0.0096, 0.0572, 0.1080, 0.0629, 0.0229, 0.0228,
    0.1437, 0.0765, 0.0299, -0.0101, 0.0579, 0.0600, 0.0106, 0.0076, 0.0037, 0.0114,
    0.0067, 0.0307, 0.0276, 0.0086, 0.0158, 0.0107, 0.0122, 0.0165, 0.0119, 0.0292,
    0.0246, 0.0557, 0.0449, 0.0330, 0.0620, 0.0911, 0.1324, 0.0758, 0.0904, 0.1331,
    0.0591, 0.0392, 0.0379, 0.0113, 0.0439, 0.0435, 0.0410, 0.0461, 0.0612, 0.0306,
    0.0291, 0.0275, 0.0267, 0.0254, 0.0332, 0.0167, 0.0154, 0.0276, 0.0234, 0.0188,
    0.0334, 0.0163, 0.0270, 0.0339, 0.0256, 0.0307, 0.0168, 0.0238, 0.0340, 0.0326,
    -0.0036, 0.0164, 0.0316, 0.0214, 0.0146, 0.0076, 0.0074, 0.0212, 0.0241, 0.0184,
    0.0121, 0.0213, 0.0181, 0.0470, 0.0800, 0.0650, 0.0340, 0.0290
  ],
  // Cash/T-bills
  cashReturns: [
    0.0327, 0.0311, 0.0305, 0.0458, 0.0236, 0.0107, 0.0050, 0.0015, 0.0016, 0.0017,
    0.0014, 0.0005, 0.0004, 0.0005, 0.0003, 0.0003, 0.0038, 0.0038, 0.0038, 0.0038,
    0.0094, 0.0114, 0.0118, 0.0189, 0.0234, 0.0265, 0.0228, 0.0267, 0.0153, 0.0187,
    0.0298, 0.0339, 0.0227, 0.0432, 0.0356, 0.0254, 0.0288, 0.0352, 0.0393, 0.0463,
    0.0398, 0.0502, 0.0410, 0.0592, 0.0788, 0.0587, 0.0507, 0.1038, 0.1126, 0.1228,
    0.0889, 0.0806, 0.0880, 0.0594, 0.0572, 0.0533, 0.0341, 0.0287, 0.0480, 0.0580,
    0.0560, 0.0352, 0.0303, 0.0438, 0.0526, 0.0499, 0.0473, 0.0481, 0.0443, 0.0225,
    0.0470, 0.0162, 0.0113, 0.0098, 0.0160, 0.0328, 0.0488, 0.0459, 0.0188, 0.0007,
    0.0014, 0.0005, 0.0006, 0.0010, 0.0003, 0.0002, 0.0002, 0.0003, 0.0021, 0.0088,
    0.0194, 0.0226, 0.0052, 0.0004, 0.0456, 0.0530, 0.0502, 0.0448
  ],
  years: Array.from({ length: 98 }, (_, i) => 1926 + i)
};

/**
 * Default expected returns and volatilities by asset class
 */
export const DEFAULT_ASSET_ASSUMPTIONS = {
  stocks: {
    expectedReturn: 0.07,  // 7% real
    volatility: 0.18       // 18% standard deviation
  },
  bonds: {
    expectedReturn: 0.025, // 2.5% real
    volatility: 0.06       // 6% standard deviation
  },
  cash: {
    expectedReturn: 0.005, // 0.5% real
    volatility: 0.02       // 2% standard deviation
  },
  stockBondCorrelation: 0.0 // Near zero historically
};

/**
 * Life stage scenario colors for visualization
 */
export const SCENARIO_COLORS = {
  scenario1: '#3b82f6', // Blue
  scenario2: '#10b981', // Green
  scenario3: '#f59e0b', // Orange
  scenario4: '#8b5cf6'  // Purple
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate a random number from standard normal distribution using Box-Muller
 */
export function generateStandardNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Generate a random number from normal distribution
 */
export function generateNormalReturn(mean: number, stdDev: number): number {
  return mean + stdDev * generateStandardNormal();
}

/**
 * Generate a random number from log-normal distribution
 */
export function generateLogNormalReturn(mean: number, stdDev: number): number {
  // Convert arithmetic mean/std to log parameters
  const variance = stdDev * stdDev;
  const mu = Math.log(mean) - variance / 2;
  const sigma = Math.sqrt(Math.log(1 + variance / (mean * mean)));
  
  return Math.exp(mu + sigma * generateStandardNormal()) - 1;
}

/**
 * Generate a random number from t-distribution
 */
export function generateTDistributionReturn(
  mean: number, 
  stdDev: number, 
  degreesOfFreedom: number
): number {
  // Generate t-distributed random variable
  const z = generateStandardNormal();
  const u = 2 * Math.random() - 1;
  const chi2 = -2 * Math.log(Math.abs(u));
  const t = z / Math.sqrt(chi2 / degreesOfFreedom);
  
  return mean + stdDev * t;
}

/**
 * Calculate percentile from array
 */
export function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate mean of array
 */
export function mean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(arr: number[]): number {
  const avg = mean(arr);
  const squaredDiffs = arr.map(val => Math.pow(val - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
}

/**
 * Calculate correlation between two arrays
 */
export function correlation(arr1: number[], arr2: number[]): number {
  const n = Math.min(arr1.length, arr2.length);
  const mean1 = mean(arr1.slice(0, n));
  const mean2 = mean(arr2.slice(0, n));
  const std1 = standardDeviation(arr1.slice(0, n));
  const std2 = standardDeviation(arr2.slice(0, n));
  
  if (std1 === 0 || std2 === 0) return 0;
  
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (arr1[i] - mean1) * (arr2[i] - mean2);
  }
  
  return sum / (n * std1 * std2);
}

/**
 * Generate correlated returns for two assets
 */
export function generateCorrelatedReturns(
  mean1: number,
  std1: number,
  mean2: number,
  std2: number,
  corr: number
): [number, number] {
  const z1 = generateStandardNormal();
  const z2 = generateStandardNormal();
  
  // Cholesky decomposition for correlation
  const z2Correlated = corr * z1 + Math.sqrt(1 - corr * corr) * z2;
  
  return [
    mean1 + std1 * z1,
    mean2 + std2 * z2Correlated
  ];
}

/**
 * Get allocation at a specific year considering glide path
 */
export function getAllocationAtYear(
  year: number,
  startAllocation: PortfolioAllocationDef,
  glidePath?: GlidePath
): PortfolioAllocationDef {
  if (!glidePath || !glidePath.enabled) {
    return startAllocation;
  }
  
  if (year <= glidePath.startYear) {
    return glidePath.startAllocation;
  }
  
  if (year >= glidePath.endYear) {
    return glidePath.endAllocation;
  }
  
  // Linear interpolation
  const progress = (year - glidePath.startYear) / (glidePath.endYear - glidePath.startYear);
  
  return {
    stocks: glidePath.startAllocation.stocks + 
      (glidePath.endAllocation.stocks - glidePath.startAllocation.stocks) * progress,
    bonds: glidePath.startAllocation.bonds + 
      (glidePath.endAllocation.bonds - glidePath.startAllocation.bonds) * progress,
    cash: glidePath.startAllocation.cash + 
      (glidePath.endAllocation.cash - glidePath.startAllocation.cash) * progress,
    other: (glidePath.startAllocation.other ?? 0) + 
      ((glidePath.endAllocation.other ?? 0) - (glidePath.startAllocation.other ?? 0)) * progress
  };
}

// =============================================================================
// RETURN GENERATION FUNCTIONS
// =============================================================================

/**
 * Generate returns using historical sampling
 */
export function generateHistoricalReturns(
  useBootstrap: boolean = false,
  blockSize: number = 5
): { stockReturn: number; bondReturn: number; cashReturn: number; inflation: number } {
  const data = HISTORICAL_DATA;
  
  if (useBootstrap && blockSize > 1) {
    // Block bootstrap - select a random starting point and use consecutive years
    const maxStart = data.stockReturns.length - blockSize;
    const startIndex = Math.floor(Math.random() * maxStart);
    const yearIndex = startIndex + Math.floor(Math.random() * blockSize);
    
    return {
      stockReturn: data.stockReturns[yearIndex],
      bondReturn: data.bondReturns[yearIndex],
      cashReturn: data.cashReturns[yearIndex],
      inflation: data.inflation[yearIndex]
    };
  }
  
  // Simple random sampling
  const randomIndex = Math.floor(Math.random() * data.stockReturns.length);
  
  return {
    stockReturn: data.stockReturns[randomIndex],
    bondReturn: data.bondReturns[randomIndex],
    cashReturn: data.cashReturns[randomIndex],
    inflation: data.inflation[randomIndex]
  };
}

/**
 * Generate returns using forecasted model
 */
export function generateForecastedReturns(
  stockReturn: number,
  stockVol: number,
  bondReturn: number,
  bondVol: number,
  corr: number,
  inflationRate: number
): { stockReturn: number; bondReturn: number; cashReturn: number; inflation: number } {
  const [stockRet, bondRet] = generateCorrelatedReturns(
    stockReturn,
    stockVol,
    bondReturn,
    bondVol,
    corr
  );
  
  return {
    stockReturn: stockRet,
    bondReturn: bondRet,
    cashReturn: DEFAULT_ASSET_ASSUMPTIONS.cash.expectedReturn + 
      generateNormalReturn(0, DEFAULT_ASSET_ASSUMPTIONS.cash.volatility),
    inflation: inflationRate + generateNormalReturn(0, 0.01) // Small inflation variance
  };
}

/**
 * Generate returns using parameterized distribution
 */
export function generateParameterizedReturns(
  stockReturn: number,
  stockVol: number,
  bondReturn: number,
  bondVol: number,
  distribution: DistributionType,
  degreesOfFreedom: number,
  inflationRate: number
): { stockReturn: number; bondReturn: number; cashReturn: number; inflation: number } {
  let stockRet: number;
  let bondRet: number;
  
  switch (distribution) {
    case 'lognormal':
      stockRet = generateLogNormalReturn(1 + stockReturn, stockVol) - 1;
      bondRet = generateLogNormalReturn(1 + bondReturn, bondVol) - 1;
      break;
    case 't-distribution':
      stockRet = generateTDistributionReturn(stockReturn, stockVol, degreesOfFreedom);
      bondRet = generateTDistributionReturn(bondReturn, bondVol, degreesOfFreedom);
      break;
    case 'normal':
    default:
      stockRet = generateNormalReturn(stockReturn, stockVol);
      bondRet = generateNormalReturn(bondReturn, bondVol);
  }
  
  return {
    stockReturn: stockRet,
    bondReturn: bondRet,
    cashReturn: DEFAULT_ASSET_ASSUMPTIONS.cash.expectedReturn + 
      generateNormalReturn(0, DEFAULT_ASSET_ASSUMPTIONS.cash.volatility),
    inflation: inflationRate + generateNormalReturn(0, 0.01)
  };
}

// =============================================================================
// MAIN SIMULATION FUNCTIONS
// =============================================================================

/**
 * Run a single simulation
 */
export function runSingleSimulation(
  inputs: FinancialGoalsInputs,
  runId: number
): SimulationRun {
  const yearlyData: YearlySimulationData[] = [];
  let portfolioValue = inputs.initialPortfolioValue;
  let peakValue = portfolioValue;
  let minValue = portfolioValue;
  let success = true;
  const allReturns: number[] = [];
  
  // Track cumulative inflation for real value calculations
  let cumulativeInflation = 1;
  
  for (let year = 0; year < inputs.simulationYears; year++) {
    const age = inputs.currentAge + year;
    const isRetired = age >= inputs.retirementAge;
    
    // Get current allocation (considering glide path)
    const allocation = getAllocationAtYear(
      year,
      inputs.startingAllocation,
      inputs.glidePath
    );
    
    // Generate returns based on model
    let returns: { stockReturn: number; bondReturn: number; cashReturn: number; inflation: number };
    
    switch (inputs.simulationModel) {
      case 'historical':
        returns = generateHistoricalReturns(inputs.useBootstrap, inputs.blockSize);
        break;
      case 'forecasted':
      case 'statistical':
        returns = generateForecastedReturns(
          inputs.expectedStockReturn ?? DEFAULT_ASSET_ASSUMPTIONS.stocks.expectedReturn,
          inputs.stockVolatility ?? DEFAULT_ASSET_ASSUMPTIONS.stocks.volatility,
          inputs.expectedBondReturn ?? DEFAULT_ASSET_ASSUMPTIONS.bonds.expectedReturn,
          inputs.bondVolatility ?? DEFAULT_ASSET_ASSUMPTIONS.bonds.volatility,
          inputs.stockBondCorrelation ?? DEFAULT_ASSET_ASSUMPTIONS.stockBondCorrelation,
          inputs.inflationRate ?? 0.025
        );
        break;
      case 'parameterized':
        returns = generateParameterizedReturns(
          inputs.expectedStockReturn ?? DEFAULT_ASSET_ASSUMPTIONS.stocks.expectedReturn,
          inputs.stockVolatility ?? DEFAULT_ASSET_ASSUMPTIONS.stocks.volatility,
          inputs.expectedBondReturn ?? DEFAULT_ASSET_ASSUMPTIONS.bonds.expectedReturn,
          inputs.bondVolatility ?? DEFAULT_ASSET_ASSUMPTIONS.bonds.volatility,
          inputs.distributionType ?? 'normal',
          inputs.degreesOfFreedom ?? 5,
          inputs.inflationRate ?? 0.025
        );
        break;
      default:
        returns = generateHistoricalReturns();
    }
    
    // Calculate blended portfolio return
    const stockWeight = allocation.stocks / 100;
    const bondWeight = allocation.bonds / 100;
    const cashWeight = allocation.cash / 100;
    const otherWeight = (allocation.other ?? 0) / 100;
    
    const portfolioReturn = 
      stockWeight * returns.stockReturn +
      bondWeight * returns.bondReturn +
      cashWeight * returns.cashReturn +
      otherWeight * (returns.stockReturn * 0.5 + returns.bondReturn * 0.5); // Other assumed 50/50
    
    allReturns.push(portfolioReturn);
    cumulativeInflation *= (1 + returns.inflation);
    
    // Calculate contribution or withdrawal
    let contribution = 0;
    let withdrawal = 0;
    
    if (isRetired) {
      // Retirement - withdrawing
      withdrawal = inputs.annualWithdrawal;
      
      // Adjust for inflation if needed
      if (inputs.inflationModel !== 'fixed') {
        withdrawal *= cumulativeInflation;
      }
      
      // Apply tax if pre-tax
      if (inputs.taxTreatment === 'pre-tax' && inputs.effectiveTaxRate) {
        withdrawal *= (1 + inputs.effectiveTaxRate);
      }
    } else {
      // Accumulation - contributing
      contribution = inputs.annualContribution;
      
      // Apply contribution growth
      if (inputs.contributionGrowthRate) {
        contribution *= Math.pow(1 + inputs.contributionGrowthRate, year);
      }
    }
    
    // Process additional cashflows
    if (inputs.cashflowGoals) {
      for (const goal of inputs.cashflowGoals) {
        if (year >= goal.startYear && (goal.endYear === undefined || year <= goal.endYear)) {
          let amount = goal.amount;
          
          if (goal.adjustForInflation) {
            amount *= cumulativeInflation;
          }
          
          if (goal.growthRate) {
            amount *= Math.pow(1 + goal.growthRate, year - goal.startYear);
          }
          
          if (goal.type === 'income' || (goal.type === 'one-time' && year === goal.startYear)) {
            contribution += amount;
          } else if (goal.type === 'expense') {
            withdrawal += amount;
          }
        }
      }
    }
    
    const netCashflow = contribution - withdrawal;
    
    // Calculate portfolio values
    const portfolioValueStart = portfolioValue;
    portfolioValue = portfolioValue * (1 + portfolioReturn) + netCashflow;
    
    // Check for portfolio depletion
    if (portfolioValue <= 0) {
      portfolioValue = 0;
      success = false;
    }
    
    // Update peak and min
    peakValue = Math.max(peakValue, portfolioValue);
    minValue = Math.min(minValue, portfolioValue);
    
    // Determine life stage
    let lifeStage: LifeStage = 'accumulation';
    if (isRetired) {
      const yearsRetired = age - inputs.retirementAge;
      if (yearsRetired < 5) {
        lifeStage = 'early-retirement';
      } else if (age < 70) {
        lifeStage = 'traditional-retirement';
      } else {
        lifeStage = 'late-retirement';
      }
    } else if (inputs.retirementAge - age <= 5) {
      lifeStage = 'transition';
    }
    
    // Calculate component values
    const stocksValue = portfolioValue * stockWeight;
    const bondsValue = portfolioValue * bondWeight;
    const cashValue = portfolioValue * cashWeight;
    
    yearlyData.push({
      year,
      age,
      portfolioValueStart,
      portfolioValueEnd: portfolioValue,
      contribution,
      withdrawal,
      netCashflow,
      portfolioReturn,
      inflation: returns.inflation,
      realReturn: portfolioReturn - returns.inflation,
      stocksValue,
      bondsValue,
      cashValue,
      allocation,
      lifeStage
    });
    
    // Early termination if portfolio depleted
    if (portfolioValue <= 0) {
      break;
    }
  }
  
  // Calculate annualized return
  const totalReturn = portfolioValue / inputs.initialPortfolioValue;
  const years = yearlyData.length;
  const annualizedReturn = Math.pow(totalReturn, 1 / years) - 1;
  const volatility = standardDeviation(allReturns);
  
  return {
    runId,
    success,
    finalValue: portfolioValue,
    peakValue,
    minValue,
    yearlyData,
    yearsBeforeDepletion: success ? undefined : yearlyData.length,
    annualizedReturn,
    volatility
  };
}

/**
 * Analyze sequence of returns risk
 */
export function analyzeSequenceOfReturnsRisk(
  simulations: SimulationRun[]
): SequenceRiskAnalysis {
  const firstFiveYearReturns: number[] = [];
  const successFlags: number[] = [];
  
  for (const sim of simulations) {
    if (sim.yearlyData.length >= 5) {
      const first5Return = sim.yearlyData
        .slice(0, 5)
        .reduce((acc, year) => acc * (1 + year.portfolioReturn), 1) - 1;
      firstFiveYearReturns.push(first5Return);
      successFlags.push(sim.success ? 1 : 0);
    }
  }
  
  const worstFirst5 = Math.min(...firstFiveYearReturns);
  const bestFirst5 = Math.max(...firstFiveYearReturns);
  const corr = correlation(firstFiveYearReturns, successFlags);
  
  // Find high-risk years (years where bad returns correlated with failure)
  const highRiskYears: number[] = [];
  for (let year = 0; year < 10; year++) {
    const yearReturns = simulations.map(s => s.yearlyData[year]?.portfolioReturn ?? 0);
    const yearCorr = correlation(yearReturns, successFlags);
    if (yearCorr > 0.3) {
      highRiskYears.push(year + 1);
    }
  }
  
  // Calculate impact score (0-100)
  const impactScore = Math.min(100, Math.max(0, Math.abs(corr) * 100));
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (impactScore > 50) {
    recommendations.push('High sequence risk detected. Consider a bond tent strategy.');
    recommendations.push('Building a cash buffer of 2-3 years expenses can help.');
  }
  
  if (corr > 0.4) {
    recommendations.push('Early returns strongly correlate with success. Consider delaying retirement in a bear market.');
  }
  
  if (highRiskYears.length > 3) {
    recommendations.push(`Years 1-${Math.max(...highRiskYears)} are critical. Reduce withdrawal rate during this period.`);
  }
  
  recommendations.push('Consider a rising equity glide path in early retirement.');
  
  return {
    worstFirstFiveYearReturn: worstFirst5,
    bestFirstFiveYearReturn: bestFirst5,
    correlationWithSuccess: corr,
    highRiskYears,
    impactScore,
    recommendations
  };
}

/**
 * Generate life stage scenarios for comparison
 */
export function generateLifeStageScenarios(
  baseInputs: FinancialGoalsInputs,
  scenarios: { name: string; modifications: Partial<FinancialGoalsInputs> }[]
): LifeStageScenario[] {
  const colors = Object.values(SCENARIO_COLORS);
  const results: LifeStageScenario[] = [];
  
  for (let i = 0; i < Math.min(scenarios.length, 4); i++) {
    const scenario = scenarios[i];
    const modifiedInputs: FinancialGoalsInputs = {
      ...baseInputs,
      ...scenario.modifications,
      numberOfSimulations: Math.min(baseInputs.numberOfSimulations, 1000) // Limit for performance
    };
    
    // Run simulations for this scenario
    const simulations: SimulationRun[] = [];
    for (let j = 0; j < modifiedInputs.numberOfSimulations; j++) {
      simulations.push(runSingleSimulation(modifiedInputs, j));
    }
    
    const successfulRuns = simulations.filter(s => s.success);
    const finalValues = simulations.map(s => s.finalValue);
    
    // Generate insights
    const insights: string[] = [];
    const successRate = successfulRuns.length / simulations.length;
    
    if (successRate >= 0.95) {
      insights.push('Excellent success rate - this scenario is well-funded');
    } else if (successRate >= 0.85) {
      insights.push('Good success rate - consider small adjustments for more safety');
    } else if (successRate >= 0.70) {
      insights.push('Moderate risk - adjustments recommended');
    } else {
      insights.push('High failure risk - significant changes needed');
    }
    
    if (modifiedInputs.retirementAge < 55) {
      insights.push('Very early retirement - sequence risk is elevated');
    }
    
    if (modifiedInputs.annualWithdrawal / modifiedInputs.initialPortfolioValue > 0.04) {
      insights.push('Withdrawal rate above 4% - consider reducing');
    }
    
    results.push({
      id: `scenario-${i + 1}`,
      name: scenario.name,
      color: colors[i],
      inputs: scenario.modifications,
      successRate,
      medianFinalValue: percentile(finalValues, 50),
      p10FinalValue: percentile(finalValues, 10),
      p90FinalValue: percentile(finalValues, 90),
      insights
    });
  }
  
  return results;
}

/**
 * Run sensitivity analysis
 */
export function runSensitivityAnalysis(
  baseInputs: FinancialGoalsInputs
): SensitivityResult[] {
  const results: SensitivityResult[] = [];
  
  // Test withdrawal rate sensitivity
  const withdrawalRates = [0.03, 0.035, 0.04, 0.045, 0.05];
  const withdrawalResults = withdrawalRates.map(rate => {
    const inputs = {
      ...baseInputs,
      annualWithdrawal: baseInputs.initialPortfolioValue * rate,
      numberOfSimulations: 500
    };
    const sims = Array.from({ length: inputs.numberOfSimulations }, (_, i) => 
      runSingleSimulation(inputs, i)
    );
    return {
      successRate: sims.filter(s => s.success).length / sims.length,
      medianFinal: percentile(sims.map(s => s.finalValue), 50)
    };
  });
  
  results.push({
    variable: 'Withdrawal Rate',
    baseValue: baseInputs.annualWithdrawal / baseInputs.initialPortfolioValue,
    testedValues: withdrawalRates,
    successRates: withdrawalResults.map(r => r.successRate),
    medianOutcomes: withdrawalResults.map(r => r.medianFinal),
    impact: 'high'
  });
  
  // Test stock allocation sensitivity
  const stockAllocations = [40, 50, 60, 70, 80];
  const stockResults = stockAllocations.map(stocks => {
    const inputs = {
      ...baseInputs,
      startingAllocation: { 
        stocks, 
        bonds: 100 - stocks - (baseInputs.startingAllocation.cash || 0), 
        cash: baseInputs.startingAllocation.cash || 0 
      },
      numberOfSimulations: 500
    };
    const sims = Array.from({ length: inputs.numberOfSimulations }, (_, i) => 
      runSingleSimulation(inputs, i)
    );
    return {
      successRate: sims.filter(s => s.success).length / sims.length,
      medianFinal: percentile(sims.map(s => s.finalValue), 50)
    };
  });
  
  results.push({
    variable: 'Stock Allocation (%)',
    baseValue: baseInputs.startingAllocation.stocks,
    testedValues: stockAllocations,
    successRates: stockResults.map(r => r.successRate),
    medianOutcomes: stockResults.map(r => r.medianFinal),
    impact: 'medium'
  });
  
  return results;
}

/**
 * Generate recommendations based on simulation results
 */
export function generateRecommendations(
  inputs: FinancialGoalsInputs,
  successAnalysis: SuccessAnalysis,
  sequenceRisk?: SequenceRiskAnalysis
): string[] {
  const recommendations: string[] = [];
  
  // Success rate recommendations
  if (successAnalysis.successRate < 0.80) {
    recommendations.push('Consider reducing annual withdrawal by 10-15%');
    recommendations.push('Delaying retirement by 2-3 years could significantly improve success rate');
  } else if (successAnalysis.successRate < 0.90) {
    recommendations.push('Moderate success rate - consider building additional buffer');
  } else if (successAnalysis.successRate >= 0.95) {
    recommendations.push('Excellent success rate - you may be able to increase spending safely');
  }
  
  // Withdrawal rate recommendations
  const withdrawalRate = inputs.annualWithdrawal / inputs.initialPortfolioValue;
  if (withdrawalRate > 0.04) {
    recommendations.push(`Your withdrawal rate of ${(withdrawalRate * 100).toFixed(1)}% is above the traditional 4% rule`);
  }
  
  // Allocation recommendations
  if (inputs.startingAllocation.stocks > 80) {
    recommendations.push('High equity allocation increases volatility - consider more bonds for stability');
  } else if (inputs.startingAllocation.stocks < 40) {
    recommendations.push('Low equity allocation may not keep pace with inflation long-term');
  }
  
  // Sequence risk recommendations
  if (sequenceRisk && sequenceRisk.impactScore > 50) {
    recommendations.push(...sequenceRisk.recommendations.slice(0, 2));
  }
  
  // Glide path recommendation
  if (!inputs.glidePath?.enabled) {
    recommendations.push('Consider using a glide path to reduce risk as you transition to retirement');
  }
  
  // Diversification
  if (inputs.startingAllocation.cash < 5) {
    recommendations.push('Consider holding 1-2 years of expenses in cash for emergencies');
  }
  
  return recommendations;
}

/**
 * Generate warnings based on inputs
 */
export function generateWarnings(inputs: FinancialGoalsInputs): string[] {
  const warnings: string[] = [];
  
  // Allocation validation
  const totalAllocation = inputs.startingAllocation.stocks + 
    inputs.startingAllocation.bonds + 
    inputs.startingAllocation.cash + 
    (inputs.startingAllocation.other ?? 0);
  
  if (Math.abs(totalAllocation - 100) > 0.01) {
    warnings.push(`Portfolio allocation totals ${totalAllocation.toFixed(1)}% - should be 100%`);
  }
  
  // Retirement age validation
  if (inputs.retirementAge < inputs.currentAge) {
    warnings.push('Retirement age cannot be less than current age');
  }
  
  if (inputs.retirementAge >= inputs.lifeExpectancy) {
    warnings.push('Retirement age should be less than life expectancy');
  }
  
  // Withdrawal rate warnings
  const withdrawalRate = inputs.annualWithdrawal / inputs.initialPortfolioValue;
  if (withdrawalRate > 0.06) {
    warnings.push(`High withdrawal rate (${(withdrawalRate * 100).toFixed(1)}%) may deplete portfolio quickly`);
  }
  
  // Simulation count warnings
  if (inputs.numberOfSimulations < 1000) {
    warnings.push('Running fewer than 1000 simulations may produce less reliable results');
  }
  
  // Long horizon warning
  const horizonYears = inputs.lifeExpectancy - inputs.currentAge;
  if (horizonYears > 60) {
    warnings.push('Very long simulation horizon - results become less reliable beyond 50 years');
  }
  
  return warnings;
}

// =============================================================================
// MAIN CALCULATION FUNCTION
// =============================================================================

/**
 * Main Financial Goals calculation function
 * 
 * @param inputs - The simulation inputs
 * @returns Complete simulation results with analysis
 */
export function calculateFinancialGoals(inputs: FinancialGoalsInputs): FinancialGoalsResult {
  const startTime = Date.now();
  
  // Validate and normalize inputs
  const warnings = generateWarnings(inputs);
  
  // Set defaults
  const normalizedInputs: FinancialGoalsInputs = {
    ...inputs,
    numberOfSimulations: inputs.numberOfSimulations || 10000,
    simulationYears: inputs.simulationYears || (inputs.lifeExpectancy - inputs.currentAge),
    inflationRate: inputs.inflationRate ?? 0.025,
    rebalancingFrequency: inputs.rebalancingFrequency || 'annually'
  };
  
  // Run simulations
  const simulations: SimulationRun[] = [];
  for (let i = 0; i < normalizedInputs.numberOfSimulations; i++) {
    simulations.push(runSingleSimulation(normalizedInputs, i));
  }
  
  // Calculate success metrics
  const successfulRuns = simulations.filter(s => s.success);
  const finalValues = simulations.map(s => s.finalValue);
  const successRate = successfulRuns.length / simulations.length;
  
  // Calculate percentiles
  const percentileOutcomes: PercentileOutcomes = {
    p5: percentile(finalValues, 5),
    p10: percentile(finalValues, 10),
    p25: percentile(finalValues, 25),
    p50: percentile(finalValues, 50),
    p75: percentile(finalValues, 75),
    p90: percentile(finalValues, 90),
    p95: percentile(finalValues, 95)
  };
  
  // Calculate yearly percentile paths
  const yearlyPercentiles: FinancialGoalsResult['yearlyPercentiles'] = [];
  for (let year = 0; year < normalizedInputs.simulationYears; year++) {
    const yearValues = simulations
      .filter(s => s.yearlyData[year])
      .map(s => s.yearlyData[year].portfolioValueEnd);
    
    if (yearValues.length > 0) {
      yearlyPercentiles.push({
        year,
        age: normalizedInputs.currentAge + year,
        p10: percentile(yearValues, 10),
        p25: percentile(yearValues, 25),
        p50: percentile(yearValues, 50),
        p75: percentile(yearValues, 75),
        p90: percentile(yearValues, 90)
      });
    }
  }
  
  // Success analysis
  const failedRuns = simulations.filter(s => !s.success);
  const yearsBeforeFailure = failedRuns
    .map(s => s.yearsBeforeDepletion ?? 0)
    .filter(y => y > 0);
  
  const successAnalysis: SuccessAnalysis = {
    successRate,
    successfulRuns: successfulRuns.length,
    failedRuns: failedRuns.length,
    averageYearsBeforeFailure: yearsBeforeFailure.length > 0 
      ? mean(yearsBeforeFailure) 
      : undefined,
    medianFinalValue: percentileOutcomes.p50,
    averageFinalValue: mean(finalValues),
    percentileOutcomes
  };
  
  // Sequence risk analysis
  let sequenceRiskAnalysis: SequenceRiskAnalysis | undefined;
  if (inputs.analyzeSequenceRisk) {
    sequenceRiskAnalysis = analyzeSequenceOfReturnsRisk(simulations);
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    normalizedInputs, 
    successAnalysis, 
    sequenceRiskAnalysis
  );
  
  const computeTimeMs = Date.now() - startTime;
  
  return {
    successRate,
    medianFinalValue: percentileOutcomes.p50,
    averageFinalValue: mean(finalValues),
    successAnalysis,
    percentileOutcomes,
    simulations: simulations.slice(0, 100), // Limit stored simulations
    yearlyPercentiles,
    sequenceRiskAnalysis,
    recommendations,
    warnings,
    modelUsed: normalizedInputs.simulationModel,
    simulationCount: normalizedInputs.numberOfSimulations,
    simulationYears: normalizedInputs.simulationYears,
    computeTimeMs
  };
}

// =============================================================================
// QUICK UTILITY FUNCTIONS
// =============================================================================

/**
 * Quick success probability estimate based on withdrawal rate
 */
export function quickSuccessProbability(
  withdrawalRate: number,
  stockAllocation: number,
  years: number
): number {
  // Simplified model based on Trinity Study data
  // This is an approximation for quick estimates
  
  // Base success rate for 4% rule at 60/40 for 30 years
  let baseSuccess = 0.95;
  
  // Adjust for withdrawal rate
  if (withdrawalRate <= 0.03) {
    baseSuccess = 0.99;
  } else if (withdrawalRate <= 0.035) {
    baseSuccess = 0.97;
  } else if (withdrawalRate <= 0.04) {
    baseSuccess = 0.95;
  } else if (withdrawalRate <= 0.045) {
    baseSuccess = 0.88;
  } else if (withdrawalRate <= 0.05) {
    baseSuccess = 0.78;
  } else {
    baseSuccess = 0.65;
  }
  
  // Adjust for time horizon
  if (years > 40) {
    baseSuccess -= 0.05;
  } else if (years > 30) {
    baseSuccess -= 0.02;
  } else if (years < 20) {
    baseSuccess += 0.03;
  }
  
  // Adjust for stock allocation
  if (stockAllocation < 30 || stockAllocation > 90) {
    baseSuccess -= 0.05;
  }
  
  return Math.max(0, Math.min(1, baseSuccess));
}

/**
 * Calculate required portfolio for desired income
 */
export function calculateRequiredPortfolio(
  desiredAnnualIncome: number,
  targetWithdrawalRate: number,
  yearsUntilRetirement: number,
  annualContribution: number,
  expectedReturn: number = 0.07
): number {
  // Calculate what portfolio is needed at retirement
  const portfolioAtRetirement = desiredAnnualIncome / targetWithdrawalRate;
  
  // Calculate what we need to save today
  // FV = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r
  // Solve for PV
  
  const futureValueFactor = Math.pow(1 + expectedReturn, yearsUntilRetirement);
  const annuityFactor = (futureValueFactor - 1) / expectedReturn;
  const futureContributions = annualContribution * annuityFactor;
  
  const currentPortfolioNeeded = (portfolioAtRetirement - futureContributions) / futureValueFactor;
  
  return Math.max(0, currentPortfolioNeeded);
}

/**
 * Compare multiple financial scenarios
 */
export function compareFinancialScenarios(
  baseInputs: FinancialGoalsInputs,
  scenarios: { name: string; modifications: Partial<FinancialGoalsInputs> }[]
): LifeStageScenario[] {
  return generateLifeStageScenarios(baseInputs, scenarios);
}

/**
 * Calculate years to financial independence
 */
export function calculateYearsToFI(
  currentPortfolio: number,
  annualContribution: number,
  targetPortfolio: number,
  expectedReturn: number = 0.07
): number {
  // Using logarithm to solve for years
  // targetPortfolio = currentPortfolio * (1+r)^n + PMT * ((1+r)^n - 1) / r
  
  if (currentPortfolio >= targetPortfolio) {
    return 0;
  }
  
  // Newton's method approximation
  let years = 10;
  for (let i = 0; i < 100; i++) {
    const fv = currentPortfolio * Math.pow(1 + expectedReturn, years) +
      annualContribution * (Math.pow(1 + expectedReturn, years) - 1) / expectedReturn;
    
    if (Math.abs(fv - targetPortfolio) < 1) {
      break;
    }
    
    // Adjust estimate
    if (fv < targetPortfolio) {
      years += 1;
    } else {
      years -= 0.5;
    }
    
    years = Math.max(0, years);
  }
  
  return Math.ceil(years);
}
