/**
 * Coast FIRE Calculator
 * 
 * A dedicated calculator for Coast FIRE (Financial Independence Retire Early) planning.
 * Coast FIRE is when you have enough invested that compound growth alone will
 * grow your portfolio to your FIRE number by traditional retirement age,
 * without any additional contributions.
 * 
 * This calculator helps users understand:
 * - Their Coast FIRE number at different ages
 * - When they can "coast" and stop aggressive saving
 * - Visual trajectory of continued saving vs coasting
 * - Part-time income scenarios during coasting
 * - Risk tolerance variations and their impact
 * 
 * @see https://www.npmjs.com/package/@deanfinancials/calculators
 */

// ============================================================================
// PART 1: Types, Interfaces, and Core Mathematical Functions
// ============================================================================

// ============================================================================
// Types
// ============================================================================

/**
 * Risk tolerance level affecting return assumptions
 * - conservative: Lower return assumptions (5% real)
 * - moderate: Standard return assumptions (6% real)
 * - aggressive: Higher return assumptions (7% real)
 */
export type CoastFIRERiskTolerance = 'conservative' | 'moderate' | 'aggressive';

/**
 * Coast status indicating progress toward Coast FIRE
 */
export type CoastFIREStatus = 
  | 'not-started'      // No savings yet
  | 'building'         // Working toward Coast FIRE
  | 'coast-ready'      // Can coast now
  | 'fire-ready';      // Already at full FIRE number

/**
 * Input parameters for Coast FIRE calculation
 */
export interface CoastFIREInputs {
  /** Current age in years */
  currentAge: number;
  /** Target retirement age (when you want to fully retire) */
  targetRetirementAge: number;
  /** Current total invested assets (retirement accounts + taxable) */
  currentSavings: number;
  /** Annual expenses you expect in retirement (today's dollars) */
  annualExpenses: number;
  /** Monthly savings/contribution amount (for projection) */
  monthlySavings?: number;
  /** Expected nominal investment return (default: 7%) */
  expectedReturn?: number;
  /** Expected inflation rate (default: 3%) */
  inflationRate?: number;
  /** Safe withdrawal rate for retirement (default: 4%) */
  safeWithdrawalRate?: number;
  /** Risk tolerance level affecting return assumptions */
  riskTolerance?: CoastFIRERiskTolerance;
  /** Optional part-time income during coast phase (annual) */
  partTimeIncome?: number;
  /** Age to stop part-time work (if applicable) */
  partTimeEndAge?: number;
}

/**
 * Result of the "when can I coast" reverse calculation
 */
export interface WhenCanICoastResult {
  /** Age when Coast FIRE will be achieved */
  coastAge: number;
  /** Years from now until Coast FIRE */
  yearsToCoast: number;
  /** Portfolio value at coast age */
  portfolioAtCoastAge: number;
  /** Whether already at Coast FIRE */
  alreadyCoastFIRE: boolean;
  /** Calendar year of Coast FIRE */
  coastYear: number;
}

/**
 * Coast age analysis for different retirement ages
 */
export interface CoastAgeAnalysis {
  /** Target retirement age */
  retirementAge: number;
  /** Coast FIRE number needed today */
  coastNumberToday: number;
  /** Years to reach coast (if not already there) */
  yearsToCoast: number;
  /** Age when coast is achieved */
  coastAchievedAge: number;
  /** Whether coast is already achieved */
  alreadyAchieved: boolean;
  /** FIRE number at this retirement age */
  fireNumber: number;
}

/**
 * Coast FIRE number at different ages
 */
export interface CoastNumberByAge {
  /** Age */
  age: number;
  /** Coast FIRE number at this age */
  coastNumber: number;
  /** Years until retirement from this age */
  yearsToRetirement: number;
  /** Whether current savings already meets this coast number */
  achieved: boolean;
  /** Gap to coast number (negative if achieved) */
  gap: number;
}

/**
 * Year-by-year projection data
 */
export interface CoastFIREYearlyProjection {
  /** Year number (1, 2, 3, ...) */
  year: number;
  /** Age at this year */
  age: number;
  /** Calendar year */
  calendarYear: number;
  /** Portfolio balance if continuing to save */
  balanceWithContributions: number;
  /** Portfolio balance if coasting from start */
  balanceCoasting: number;
  /** Portfolio balance if coasting from coast age */
  balanceCoastingFromOptimal: number;
  /** Coast FIRE number at this age */
  coastNumberAtAge: number;
  /** FIRE number (constant, inflation adjusted) */
  fireNumber: number;
  /** Whether Coast FIRE is achieved at this point */
  coastAchieved: boolean;
  /** Whether full FIRE is achieved at this point */
  fireAchieved: boolean;
  /** Progress toward FIRE (0-100%) */
  fireProgress: number;
  /** Progress toward Coast FIRE (0-100%) */
  coastProgress: number;
  /** Part-time income (if applicable) */
  partTimeIncome: number;
}

/**
 * Part-time income scenario analysis
 */
export interface PartTimeIncomeScenario {
  /** Annual part-time income */
  annualIncome: number;
  /** Monthly equivalent */
  monthlyIncome: number;
  /** How much earlier you can coast with this income */
  yearsEarlierToCoast: number;
  /** New coast age with part-time income */
  newCoastAge: number;
  /** Total part-time income earned until retirement */
  totalPartTimeEarnings: number;
  /** Years of part-time work */
  yearsOfPartTimeWork: number;
  /** Description */
  description: string;
}

/**
 * Risk tolerance scenario showing impact of different assumptions
 */
export interface RiskToleranceScenario {
  /** Risk level */
  riskLevel: CoastFIRERiskTolerance;
  /** Expected real return used */
  expectedRealReturn: number;
  /** Coast FIRE number */
  coastNumber: number;
  /** Years to coast */
  yearsToCoast: number;
  /** Coast age */
  coastAge: number;
  /** Description of assumptions */
  description: string;
  /** Color for visualization */
  color: string;
}

/**
 * Milestone tracking for Coast FIRE progress
 */
export interface CoastFIREMilestone {
  /** Milestone name */
  name: string;
  /** Target amount */
  amount: number;
  /** Percentage of Coast FIRE number */
  percentage: number;
  /** Whether achieved */
  achieved: boolean;
  /** Year achieved (years from now) */
  yearAchieved: number | null;
  /** Age when achieved */
  ageAchieved: number | null;
  /** Description */
  description: string;
}

/**
 * Comparison of multiple retirement ages
 */
export interface RetirementAgeComparison {
  /** Retirement age */
  retirementAge: number;
  /** FIRE number for this age */
  fireNumber: number;
  /** Coast FIRE number today for this retirement age */
  coastNumberToday: number;
  /** Years of coasting (retirement age - coast age) */
  coastingYears: number;
  /** Coast age if continuing current savings */
  coastAge: number;
  /** Whether coast is already achieved for this retirement age */
  alreadyCoastFIRE: boolean;
  /** Color for visualization */
  color: string;
}

/**
 * Main result interface for Coast FIRE calculation
 */
export interface CoastFIREResult {
  // ============================================
  // Core Results
  // ============================================
  
  /** Coast FIRE number needed today to reach FIRE at target age */
  coastFIRENumber: number;
  
  /** Full FIRE number (portfolio needed at retirement) */
  fireNumber: number;
  
  /** Current Coast FIRE status */
  status: CoastFIREStatus;
  
  /** Whether Coast FIRE has been achieved */
  coastFIREAchieved: boolean;
  
  /** Progress toward Coast FIRE (0-100%) */
  coastFIREProgress: number;
  
  /** Gap to Coast FIRE (0 if achieved, positive if not) */
  gapToCoastFIRE: number;
  
  // ============================================
  // Timeline Analysis
  // ============================================
  
  /** When can I coast? Analysis */
  whenCanICoast: WhenCanICoastResult;
  
  /** Coast age for different retirement ages */
  coastAgeAnalysis: CoastAgeAnalysis[];
  
  /** Coast FIRE number at different ages */
  coastNumbersByAge: CoastNumberByAge[];
  
  // ============================================
  // Projections
  // ============================================
  
  /** Year-by-year projections */
  projections: CoastFIREYearlyProjection[];
  
  /** Milestones toward Coast FIRE */
  milestones: CoastFIREMilestone[];
  
  // ============================================
  // Scenarios & Comparisons
  // ============================================
  
  /** Part-time income scenarios */
  partTimeScenarios: PartTimeIncomeScenario[];
  
  /** Risk tolerance scenarios */
  riskToleranceScenarios: RiskToleranceScenario[];
  
  /** Retirement age comparison (UNIQUE FEATURE) */
  retirementAgeComparison: RetirementAgeComparison[];
  
  // ============================================
  // Summary & Recommendations
  // ============================================
  
  /** Summary text */
  summary: string;
  
  /** Key insights */
  insights: string[];
  
  /** Recommendations */
  recommendations: string[];
  
  /** Warnings */
  warnings: string[];
  
  // ============================================
  // Inputs Echo (for reference)
  // ============================================
  
  /** Input parameters (echoed back) */
  inputs: {
    currentAge: number;
    targetRetirementAge: number;
    currentSavings: number;
    annualExpenses: number;
    monthlySavings: number;
    expectedReturn: number;
    inflationRate: number;
    safeWithdrawalRate: number;
    riskTolerance: CoastFIRERiskTolerance;
    partTimeIncome: number;
  };
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Risk tolerance return assumptions (real returns after inflation)
 */
export const RISK_TOLERANCE_RETURNS: Record<CoastFIRERiskTolerance, { 
  realReturn: number; 
  description: string;
  color: string;
}> = {
  conservative: { 
    realReturn: 0.05, 
    description: '5% real return - Lower risk, bond-heavy portfolio',
    color: '#22c55e' // green
  },
  moderate: { 
    realReturn: 0.06, 
    description: '6% real return - Balanced stock/bond portfolio',
    color: '#3b82f6' // blue
  },
  aggressive: { 
    realReturn: 0.07, 
    description: '7% real return - Stock-heavy portfolio',
    color: '#f59e0b' // amber
  }
};

/**
 * Default input values
 */
export const COAST_FIRE_DEFAULTS = {
  expectedReturn: 0.07,      // 7% nominal
  inflationRate: 0.03,       // 3%
  safeWithdrawalRate: 0.04,  // 4%
  riskTolerance: 'moderate' as CoastFIRERiskTolerance
};

/**
 * Colors for visualization
 */
export const COAST_FIRE_COLORS = {
  withContributions: '#22c55e',     // green - continued saving
  coasting: '#3b82f6',              // blue - coasting trajectory
  coastNumber: '#f59e0b',           // amber - coast FIRE line
  fireNumber: '#ef4444',            // red - full FIRE line
  achieved: '#10b981',              // emerald - milestone achieved
  pending: '#94a3b8',               // slate - milestone pending
  retirementAge55: '#8b5cf6',       // violet
  retirementAge60: '#ec4899',       // pink
  retirementAge65: '#06b6d4',       // cyan
  retirementAge67: '#84cc16'        // lime
};

/**
 * Part-time income scenario templates
 */
export const PART_TIME_INCOME_SCENARIOS = [
  { name: 'Minimal', monthlyAmount: 1000, description: 'Very part-time, 10-15 hrs/week' },
  { name: 'Moderate', monthlyAmount: 2000, description: 'Part-time, 20-25 hrs/week' },
  { name: 'Substantial', monthlyAmount: 3000, description: 'Near full-time equivalent' },
  { name: 'Barista FIRE', monthlyAmount: 1500, description: 'Classic Barista FIRE scenario' }
];

// ============================================================================
// Core Mathematical Functions
// ============================================================================

/**
 * Calculate real return (after inflation)
 */
export function calculateRealReturn(
  nominalReturn: number,
  inflationRate: number
): number {
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

/**
 * Calculate FIRE number based on annual expenses and withdrawal rate
 * Formula: FIRE Number = Annual Expenses / Safe Withdrawal Rate
 */
export function calculateFIRENumberForCoast(
  annualExpenses: number,
  safeWithdrawalRate: number = 0.04
): number {
  if (safeWithdrawalRate <= 0) {
    throw new Error('Safe withdrawal rate must be greater than 0');
  }
  return annualExpenses / safeWithdrawalRate;
}

/**
 * Calculate Coast FIRE number
 * This is the amount you need TODAY to reach your FIRE number by retirement
 * through compound growth alone (no additional contributions)
 * 
 * Formula: Coast FIRE = FIRE Number / (1 + realReturn)^yearsToRetirement
 * 
 * @param fireNumber - Target FIRE number at retirement
 * @param yearsToRetirement - Years until retirement
 * @param realReturn - Expected real return (after inflation)
 * @returns Coast FIRE number
 */
export function calculateCoastFIRENumber(
  fireNumber: number,
  yearsToRetirement: number,
  realReturn: number
): number {
  if (yearsToRetirement <= 0) return fireNumber;
  return fireNumber / Math.pow(1 + realReturn, yearsToRetirement);
}

/**
 * Calculate future value with compound growth only (no contributions)
 * 
 * @param presentValue - Current portfolio value
 * @param realReturn - Expected real return (after inflation)
 * @param years - Number of years
 * @returns Future value
 */
export function calculateFutureValueNoContributions(
  presentValue: number,
  realReturn: number,
  years: number
): number {
  if (years <= 0) return presentValue;
  return presentValue * Math.pow(1 + realReturn, years);
}

/**
 * Calculate future value with regular contributions
 * 
 * @param presentValue - Current portfolio value
 * @param annualContribution - Annual contribution amount
 * @param realReturn - Expected real return (after inflation)
 * @param years - Number of years
 * @returns Future value
 */
export function calculateFutureValueWithContributions(
  presentValue: number,
  annualContribution: number,
  realReturn: number,
  years: number
): number {
  if (years <= 0) return presentValue;
  
  // Future value of existing balance
  const fvPresentValue = presentValue * Math.pow(1 + realReturn, years);
  
  // Future value of annuity (contributions)
  // FVA = PMT × [(1 + r)^n - 1] / r
  const fvContributions = realReturn > 0
    ? annualContribution * (Math.pow(1 + realReturn, years) - 1) / realReturn
    : annualContribution * years;
  
  return fvPresentValue + fvContributions;
}

/**
 * Calculate years to reach target with compound growth only
 * 
 * Formula: n = ln(FV/PV) / ln(1 + r)
 * 
 * @param presentValue - Current portfolio value
 * @param targetValue - Target portfolio value
 * @param realReturn - Expected real return (after inflation)
 * @returns Years to reach target (Infinity if not achievable)
 */
export function calculateYearsToTargetNoContributions(
  presentValue: number,
  targetValue: number,
  realReturn: number
): number {
  if (presentValue >= targetValue) return 0;
  if (presentValue <= 0 || realReturn <= 0) return Infinity;
  
  return Math.log(targetValue / presentValue) / Math.log(1 + realReturn);
}

/**
 * Calculate years to reach target with regular contributions
 * Uses iterative approach for accuracy
 * 
 * @param presentValue - Current portfolio value
 * @param annualContribution - Annual contribution amount
 * @param targetValue - Target portfolio value
 * @param realReturn - Expected real return (after inflation)
 * @returns Years to reach target
 */
export function calculateYearsToTargetWithContributions(
  presentValue: number,
  annualContribution: number,
  targetValue: number,
  realReturn: number
): number {
  if (presentValue >= targetValue) return 0;
  if (annualContribution <= 0 && realReturn <= 0) return Infinity;
  
  let balance = presentValue;
  let years = 0;
  const maxYears = 100;
  
  while (balance < targetValue && years < maxYears) {
    balance = balance * (1 + realReturn) + annualContribution;
    years++;
  }
  
  return years >= maxYears ? Infinity : years;
}

/**
 * Determine Coast FIRE status based on current position
 */
export function determineCoastFIREStatus(
  currentSavings: number,
  coastFIRENumber: number,
  fireNumber: number
): CoastFIREStatus {
  if (currentSavings <= 0) return 'not-started';
  if (currentSavings >= fireNumber) return 'fire-ready';
  if (currentSavings >= coastFIRENumber) return 'coast-ready';
  return 'building';
}

/**
 * Calculate progress percentage toward a target
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.max(0, (current / target) * 100));
}

/**
 * Get real return based on risk tolerance
 */
export function getRealReturnForRiskTolerance(
  riskTolerance: CoastFIRERiskTolerance
): number {
  return RISK_TOLERANCE_RETURNS[riskTolerance].realReturn;
}

// ============================================================================
// PART 2: Coast Age Analysis, Trajectories, and "When Can I Coast" Calculator
// ============================================================================

/**
 * Calculate "When can I coast?" - the age at which current savings
 * will be sufficient to reach FIRE through compound growth alone
 */
export function calculateWhenCanICoast(
  inputs: CoastFIREInputs
): WhenCanICoastResult {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  const annualContribution = monthlySavings * 12;
  const currentYear = new Date().getFullYear();

  // Check if already at Coast FIRE
  const coastFIRENumberToday = calculateCoastFIRENumber(
    fireNumber,
    targetRetirementAge - currentAge,
    realReturn
  );

  if (currentSavings >= coastFIRENumberToday) {
    return {
      coastAge: currentAge,
      yearsToCoast: 0,
      portfolioAtCoastAge: currentSavings,
      alreadyCoastFIRE: true,
      coastYear: currentYear
    };
  }

  // If no contributions, calculate when current savings will meet coast number
  if (annualContribution <= 0) {
    // Iteratively find when portfolio meets coast number
    let balance = currentSavings;
    let years = 0;
    const maxYears = targetRetirementAge - currentAge;

    while (years < maxYears) {
      years++;
      balance = balance * (1 + realReturn);
      const coastNumberAtAge = calculateCoastFIRENumber(
        fireNumber,
        targetRetirementAge - (currentAge + years),
        realReturn
      );

      if (balance >= coastNumberAtAge) {
        return {
          coastAge: currentAge + years,
          yearsToCoast: years,
          portfolioAtCoastAge: balance,
          alreadyCoastFIRE: false,
          coastYear: currentYear + years
        };
      }
    }

    // Cannot reach coast FIRE without contributions
    return {
      coastAge: Infinity,
      yearsToCoast: Infinity,
      portfolioAtCoastAge: 0,
      alreadyCoastFIRE: false,
      coastYear: Infinity
    };
  }

  // With contributions, find when portfolio crosses coast number line
  let balance = currentSavings;
  let years = 0;
  const maxYears = targetRetirementAge - currentAge;

  while (years < maxYears) {
    years++;
    balance = balance * (1 + realReturn) + annualContribution;
    const coastNumberAtAge = calculateCoastFIRENumber(
      fireNumber,
      targetRetirementAge - (currentAge + years),
      realReturn
    );

    if (balance >= coastNumberAtAge) {
      return {
        coastAge: currentAge + years,
        yearsToCoast: years,
        portfolioAtCoastAge: balance,
        alreadyCoastFIRE: false,
        coastYear: currentYear + years
      };
    }
  }

  // Should reach coast before retirement with contributions
  return {
    coastAge: currentAge + years,
    yearsToCoast: years,
    portfolioAtCoastAge: balance,
    alreadyCoastFIRE: false,
    coastYear: currentYear + years
  };
}

/**
 * Analyze Coast FIRE for different retirement ages
 * Shows how much earlier you can coast if targeting later retirement
 */
export function analyzeCoastAgesByRetirement(
  inputs: CoastFIREInputs,
  retirementAges: number[] = [55, 60, 65, 67, 70]
): CoastAgeAnalysis[] {
  const {
    currentAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const annualContribution = monthlySavings * 12;

  return retirementAges
    .filter(age => age > currentAge)
    .map(retirementAge => {
      const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
      const yearsToRetirement = retirementAge - currentAge;
      const coastNumberToday = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
      const alreadyAchieved = currentSavings >= coastNumberToday;

      // Find years to coast
      let yearsToCoast = 0;
      if (!alreadyAchieved) {
        let balance = currentSavings;
        while (yearsToCoast < yearsToRetirement) {
          yearsToCoast++;
          balance = balance * (1 + realReturn) + annualContribution;
          const coastNumberAtAge = calculateCoastFIRENumber(
            fireNumber,
            retirementAge - (currentAge + yearsToCoast),
            realReturn
          );
          if (balance >= coastNumberAtAge) break;
        }
      }

      return {
        retirementAge,
        coastNumberToday,
        yearsToCoast: alreadyAchieved ? 0 : yearsToCoast,
        coastAchievedAge: alreadyAchieved ? currentAge : currentAge + yearsToCoast,
        alreadyAchieved,
        fireNumber
      };
    });
}

/**
 * Calculate Coast FIRE number at each age from current to retirement
 * This creates the "coast line" for visualization
 */
export function calculateCoastNumbersByAge(
  inputs: CoastFIREInputs
): CoastNumberByAge[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  const annualContribution = monthlySavings * 12;
  const results: CoastNumberByAge[] = [];

  let projectedBalance = currentSavings;

  for (let age = currentAge; age <= targetRetirementAge; age++) {
    const yearsToRetirement = targetRetirementAge - age;
    const coastNumber = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
    
    // Project balance at this age
    if (age > currentAge) {
      projectedBalance = projectedBalance * (1 + realReturn) + annualContribution;
    }

    const achieved = projectedBalance >= coastNumber;
    const gap = coastNumber - projectedBalance;

    results.push({
      age,
      coastNumber,
      yearsToRetirement,
      achieved,
      gap: achieved ? 0 : gap
    });
  }

  return results;
}

/**
 * Generate year-by-year projections showing multiple trajectories
 */
export function generateCoastFIREProjections(
  inputs: CoastFIREInputs
): CoastFIREYearlyProjection[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate,
    partTimeIncome = 0,
    partTimeEndAge
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  const annualContribution = monthlySavings * 12;
  const currentYear = new Date().getFullYear();
  const yearsToProject = targetRetirementAge - currentAge;

  // Find optimal coast age first
  const whenCanICoast = calculateWhenCanICoast(inputs);
  const optimalCoastAge = whenCanICoast.coastAge;

  const projections: CoastFIREYearlyProjection[] = [];

  let balanceWithContributions = currentSavings;
  let balanceCoasting = currentSavings;
  let balanceCoastingFromOptimal = currentSavings;
  let hasReachedOptimalCoastAge = false;

  for (let year = 0; year <= yearsToProject; year++) {
    const age = currentAge + year;
    const calendarYear = currentYear + year;
    const yearsToRetirement = targetRetirementAge - age;
    const coastNumberAtAge = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);

    // Part-time income (only during coast phase)
    const ptIncome = (partTimeIncome > 0 && 
                      age >= optimalCoastAge && 
                      (partTimeEndAge === undefined || age < partTimeEndAge))
      ? partTimeIncome
      : 0;

    // Check if we've reached optimal coast age
    if (age >= optimalCoastAge && !hasReachedOptimalCoastAge) {
      hasReachedOptimalCoastAge = true;
      balanceCoastingFromOptimal = balanceWithContributions;
    }

    // Apply growth for all trajectories (after year 0)
    if (year > 0) {
      // Trajectory 1: Continue saving
      balanceWithContributions = balanceWithContributions * (1 + realReturn) + annualContribution;

      // Trajectory 2: Coast from day 1 (no contributions ever)
      balanceCoasting = balanceCoasting * (1 + realReturn);

      // Trajectory 3: Coast from optimal coast age
      if (hasReachedOptimalCoastAge) {
        // Add part-time income if applicable (as if it's invested)
        balanceCoastingFromOptimal = balanceCoastingFromOptimal * (1 + realReturn) + ptIncome;
      } else {
        // Before coast age, same as with contributions
        balanceCoastingFromOptimal = balanceCoastingFromOptimal * (1 + realReturn) + annualContribution;
      }
    }

    const coastAchieved = balanceWithContributions >= coastNumberAtAge;
    const fireAchieved = balanceWithContributions >= fireNumber;
    const fireProgress = calculateProgress(balanceWithContributions, fireNumber);
    const coastProgress = calculateProgress(balanceWithContributions, coastNumberAtAge);

    projections.push({
      year,
      age,
      calendarYear,
      balanceWithContributions,
      balanceCoasting,
      balanceCoastingFromOptimal,
      coastNumberAtAge,
      fireNumber,
      coastAchieved,
      fireAchieved,
      fireProgress,
      coastProgress,
      partTimeIncome: ptIncome
    });
  }

  return projections;
}

// ============================================================================
// PART 3: Part-Time Income, Risk Tolerance, and Milestone Calculations
// ============================================================================

/**
 * Generate part-time income scenarios showing how work income affects coast timeline
 */
export function generatePartTimeIncomeScenarios(
  inputs: CoastFIREInputs
): PartTimeIncomeScenario[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  // Base case: years to coast without part-time income
  const baseWhenCanICoast = calculateWhenCanICoast(inputs);
  const baseCoastAge = baseWhenCanICoast.coastAge;

  return PART_TIME_INCOME_SCENARIOS.map(scenario => {
    const annualIncome = scenario.monthlyAmount * 12;
    
    // Calculate new coast age with part-time income
    // Part-time income reduces the amount you need from portfolio
    const effectiveExpenses = annualExpenses - annualIncome;
    const effectiveExpensesPositive = Math.max(effectiveExpenses, annualExpenses * 0.2); // Floor at 20%
    
    const newInputs: CoastFIREInputs = {
      ...inputs,
      annualExpenses: effectiveExpensesPositive
    };
    
    const withPartTime = calculateWhenCanICoast(newInputs);
    const newCoastAge = withPartTime.coastAge;
    
    // Calculate years of part-time work
    const yearsOfPartTimeWork = Math.max(0, targetRetirementAge - newCoastAge);
    const totalPartTimeEarnings = yearsOfPartTimeWork * annualIncome;

    return {
      annualIncome,
      monthlyIncome: scenario.monthlyAmount,
      yearsEarlierToCoast: Math.max(0, baseCoastAge - newCoastAge),
      newCoastAge: Number.isFinite(newCoastAge) ? newCoastAge : baseCoastAge,
      totalPartTimeEarnings,
      yearsOfPartTimeWork,
      description: scenario.description
    };
  });
}

/**
 * Generate risk tolerance scenarios showing impact of different return assumptions
 */
export function generateRiskToleranceScenarios(
  inputs: CoastFIREInputs
): RiskToleranceScenario[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const riskLevels: CoastFIRERiskTolerance[] = ['conservative', 'moderate', 'aggressive'];

  return riskLevels.map(riskLevel => {
    const { realReturn, description, color } = RISK_TOLERANCE_RETURNS[riskLevel];
    const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
    const yearsToRetirement = targetRetirementAge - currentAge;
    const coastNumber = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
    
    // Calculate years to coast
    const annualContribution = monthlySavings * 12;
    const yearsToCoast = calculateYearsToTargetWithContributions(
      currentSavings,
      annualContribution,
      coastNumber,
      realReturn
    );

    return {
      riskLevel,
      expectedRealReturn: realReturn,
      coastNumber,
      yearsToCoast: Number.isFinite(yearsToCoast) ? yearsToCoast : Infinity,
      coastAge: Number.isFinite(yearsToCoast) ? currentAge + yearsToCoast : Infinity,
      description,
      color
    };
  });
}

/**
 * Generate Coast FIRE milestones
 */
export function generateCoastFIREMilestones(
  inputs: CoastFIREInputs
): CoastFIREMilestone[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  const yearsToRetirement = targetRetirementAge - currentAge;
  const coastFIRENumber = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
  const annualContribution = monthlySavings * 12;

  const percentages = [25, 50, 75, 100];
  const milestones: CoastFIREMilestone[] = [];

  for (const pct of percentages) {
    const targetAmount = coastFIRENumber * (pct / 100);
    const achieved = currentSavings >= targetAmount;

    let yearAchieved: number | null = null;
    let ageAchieved: number | null = null;

    if (achieved) {
      yearAchieved = 0;
      ageAchieved = currentAge;
    } else if (annualContribution > 0 || realReturn > 0) {
      // Project when milestone will be achieved
      const years = calculateYearsToTargetWithContributions(
        currentSavings,
        annualContribution,
        targetAmount,
        realReturn
      );
      if (Number.isFinite(years) && years < yearsToRetirement) {
        yearAchieved = Math.ceil(years);
        ageAchieved = currentAge + yearAchieved;
      }
    }

    const descriptions: Record<number, string> = {
      25: 'Quarter way to Coast FIRE - momentum building!',
      50: 'Halfway to Coast FIRE - great progress!',
      75: 'Three-quarters to Coast FIRE - almost there!',
      100: 'Coast FIRE achieved! You can stop aggressive saving.'
    };

    milestones.push({
      name: `${pct}% of Coast FIRE`,
      amount: targetAmount,
      percentage: pct,
      achieved,
      yearAchieved,
      ageAchieved,
      description: descriptions[pct] ?? `${pct}% milestone`
    });
  }

  return milestones;
}

/**
 * Compare retirement ages to show how they affect Coast FIRE
 * UNIQUE FEATURE: Multi-retirement age comparison
 */
export function compareRetirementAges(
  inputs: CoastFIREInputs,
  retirementAges: number[] = [55, 60, 65, 67]
): RetirementAgeComparison[] {
  const {
    currentAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const colors = [
    COAST_FIRE_COLORS.retirementAge55,
    COAST_FIRE_COLORS.retirementAge60,
    COAST_FIRE_COLORS.retirementAge65,
    COAST_FIRE_COLORS.retirementAge67
  ];

  return retirementAges
    .filter(age => age > currentAge)
    .map((retirementAge, index) => {
      const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
      const yearsToRetirement = retirementAge - currentAge;
      const coastNumberToday = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
      const alreadyCoastFIRE = currentSavings >= coastNumberToday;

      // Find coast age
      const tempInputs: CoastFIREInputs = {
        ...inputs,
        targetRetirementAge: retirementAge
      };
      const whenCoast = calculateWhenCanICoast(tempInputs);
      const coastAge = whenCoast.coastAge;
      const coastingYears = Math.max(0, retirementAge - coastAge);

      return {
        retirementAge,
        fireNumber,
        coastNumberToday,
        coastingYears,
        coastAge: Number.isFinite(coastAge) ? coastAge : currentAge,
        alreadyCoastFIRE,
        color: colors[index % colors.length]
      };
    });
}

/**
 * Generate insights based on analysis
 */
export function generateCoastFIREInsights(
  inputs: CoastFIREInputs,
  coastFIRENumber: number,
  fireNumber: number,
  whenCanICoast: WhenCanICoastResult,
  projections: CoastFIREYearlyProjection[]
): string[] {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    monthlySavings = 0
  } = inputs;

  const insights: string[] = [];
  const coastProgress = calculateProgress(currentSavings, coastFIRENumber);
  const yearsToRetirement = targetRetirementAge - currentAge;

  // Progress insights
  if (whenCanICoast.alreadyCoastFIRE) {
    insights.push(`🎉 You've already achieved Coast FIRE! Your current savings of $${currentSavings.toLocaleString()} will grow to your FIRE number by age ${targetRetirementAge}.`);
    
    if (monthlySavings > 0) {
      // Calculate how much earlier full FIRE is with continued contributions
      const fireProjection = projections.find(p => p.fireAchieved);
      if (fireProjection && fireProjection.age < targetRetirementAge) {
        insights.push(`💡 If you continue saving $${monthlySavings.toLocaleString()}/month, you could reach full FIRE ${targetRetirementAge - fireProjection.age} years earlier at age ${fireProjection.age}.`);
      }
    }
  } else {
    insights.push(`📊 You're ${coastProgress.toFixed(1)}% of the way to Coast FIRE.`);
    
    if (Number.isFinite(whenCanICoast.yearsToCoast)) {
      insights.push(`⏱️ At your current savings rate, you'll reach Coast FIRE in ${whenCanICoast.yearsToCoast} years at age ${whenCanICoast.coastAge}.`);
    }
  }

  // Coast years insight
  if (Number.isFinite(whenCanICoast.coastAge) && whenCanICoast.coastAge < targetRetirementAge) {
    const coastingYears = targetRetirementAge - whenCanICoast.coastAge;
    insights.push(`🌴 You'll have ${coastingYears} "coasting years" where you can work less or pursue passion projects.`);
  }

  // Savings rate impact
  if (monthlySavings > 0 && !whenCanICoast.alreadyCoastFIRE) {
    const doubledSavings = monthlySavings * 2;
    const doubledInputs: CoastFIREInputs = { ...inputs, monthlySavings: doubledSavings };
    const withDoubled = calculateWhenCanICoast(doubledInputs);
    
    if (Number.isFinite(withDoubled.yearsToCoast) && withDoubled.yearsToCoast < whenCanICoast.yearsToCoast) {
      const yearsSaved = whenCanICoast.yearsToCoast - withDoubled.yearsToCoast;
      insights.push(`💰 Doubling your savings to $${doubledSavings.toLocaleString()}/month would reach Coast FIRE ${yearsSaved.toFixed(1)} years sooner.`);
    }
  }

  return insights;
}

/**
 * Generate recommendations based on analysis
 */
export function generateCoastFIRERecommendations(
  inputs: CoastFIREInputs,
  status: CoastFIREStatus,
  whenCanICoast: WhenCanICoastResult
): string[] {
  const {
    currentAge,
    targetRetirementAge,
    monthlySavings = 0
  } = inputs;

  const recommendations: string[] = [];

  switch (status) {
    case 'fire-ready':
      recommendations.push('You\'ve already reached full FIRE! Consider your withdrawal strategy and asset allocation for retirement.');
      recommendations.push('Review your portfolio for appropriate risk level now that you\'re at your goal.');
      break;

    case 'coast-ready':
      recommendations.push('You\'ve achieved Coast FIRE! Consider reducing work hours or pursuing passion projects.');
      recommendations.push('Any additional savings will accelerate full FIRE or increase retirement spending flexibility.');
      recommendations.push('Consider part-time work that provides fulfillment rather than maximizing income.');
      break;

    case 'building':
      if (monthlySavings === 0) {
        recommendations.push('Start contributing to retirement accounts to reach Coast FIRE.');
        recommendations.push('Even small monthly contributions can significantly reduce time to Coast FIRE.');
      } else {
        if (whenCanICoast.yearsToCoast > 10) {
          recommendations.push('Consider increasing contributions to reach Coast FIRE sooner.');
          recommendations.push('Look for ways to reduce expenses to boost savings rate.');
        } else {
          recommendations.push('You\'re on track! Stay consistent with your savings plan.');
          recommendations.push('Consider automating contributions to maintain discipline.');
        }
      }
      recommendations.push('Maximize tax-advantaged accounts (401k, IRA) before taxable investments.');
      break;

    case 'not-started':
      recommendations.push('Start investing as soon as possible - time is your greatest asset for Coast FIRE.');
      recommendations.push('Begin with employer 401(k) match if available - it\'s free money.');
      recommendations.push('Even $100/month starting early can lead to significant growth.');
      break;
  }

  // Age-specific recommendations
  if (currentAge < 30 && status !== 'fire-ready') {
    recommendations.push('Starting young gives you a huge advantage - compound growth over 30+ years is powerful.');
  } else if (currentAge >= 50 && status === 'building') {
    recommendations.push('Consider catch-up contributions to retirement accounts ($7,500 extra for 401k, $1,000 for IRA).');
  }

  return recommendations;
}

/**
 * Generate warnings based on inputs and analysis
 */
export function generateCoastFIREWarnings(
  inputs: CoastFIREInputs,
  projections: CoastFIREYearlyProjection[]
): string[] {
  const {
    currentAge,
    targetRetirementAge,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate
  } = inputs;

  const warnings: string[] = [];

  // Return assumption warnings
  if (expectedReturn > 0.10) {
    warnings.push('⚠️ Your expected return assumption (>10%) is optimistic. Consider more conservative estimates.');
  }

  // Withdrawal rate warnings
  if (safeWithdrawalRate > 0.05) {
    warnings.push('⚠️ A withdrawal rate above 5% significantly increases the risk of outliving your savings.');
  }

  // Timeline warnings
  const yearsToRetirement = targetRetirementAge - currentAge;
  if (yearsToRetirement < 10) {
    warnings.push('⚠️ With less than 10 years to retirement, Coast FIRE may be difficult to achieve.');
  }

  if (yearsToRetirement > 40) {
    warnings.push('⚠️ Projecting 40+ years involves significant uncertainty. Revisit assumptions regularly.');
  }

  // Age warnings
  if (targetRetirementAge < 50) {
    warnings.push('⚠️ Very early retirement requires careful healthcare planning before Medicare eligibility.');
  }

  return warnings;
}

// ============================================================================
// Main Calculation Function
// ============================================================================

/**
 * Main Coast FIRE calculation function
 * Provides comprehensive analysis for Coast FIRE planning
 */
export function calculateCoastFIRE(inputs: CoastFIREInputs): CoastFIREResult {
  // Extract and validate inputs
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings = 0,
    expectedReturn = COAST_FIRE_DEFAULTS.expectedReturn,
    inflationRate = COAST_FIRE_DEFAULTS.inflationRate,
    safeWithdrawalRate = COAST_FIRE_DEFAULTS.safeWithdrawalRate,
    riskTolerance = COAST_FIRE_DEFAULTS.riskTolerance,
    partTimeIncome = 0
  } = inputs;

  // Calculate real return
  const realReturn = calculateRealReturn(expectedReturn, inflationRate);

  // Calculate core numbers
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  const yearsToRetirement = targetRetirementAge - currentAge;
  const coastFIRENumber = calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);

  // Determine status
  const status = determineCoastFIREStatus(currentSavings, coastFIRENumber, fireNumber);
  const coastFIREAchieved = currentSavings >= coastFIRENumber;
  const coastFIREProgress = calculateProgress(currentSavings, coastFIRENumber);
  const gapToCoastFIRE = Math.max(0, coastFIRENumber - currentSavings);

  // Timeline analysis
  const whenCanICoast = calculateWhenCanICoast(inputs);
  const coastAgeAnalysis = analyzeCoastAgesByRetirement(inputs);
  const coastNumbersByAge = calculateCoastNumbersByAge(inputs);

  // Projections
  const projections = generateCoastFIREProjections(inputs);
  const milestones = generateCoastFIREMilestones(inputs);

  // Scenarios
  const partTimeScenarios = generatePartTimeIncomeScenarios(inputs);
  const riskToleranceScenarios = generateRiskToleranceScenarios(inputs);
  const retirementAgeComparison = compareRetirementAges(inputs);

  // Generate insights, recommendations, warnings
  const insights = generateCoastFIREInsights(inputs, coastFIRENumber, fireNumber, whenCanICoast, projections);
  const recommendations = generateCoastFIRERecommendations(inputs, status, whenCanICoast);
  const warnings = generateCoastFIREWarnings(inputs, projections);

  // Generate summary
  let summary: string;
  if (status === 'fire-ready') {
    summary = `Congratulations! You've already reached full FIRE with $${currentSavings.toLocaleString()}. Your portfolio exceeds your FIRE number of $${fireNumber.toLocaleString()}.`;
  } else if (status === 'coast-ready') {
    summary = `You've achieved Coast FIRE! Your current savings of $${currentSavings.toLocaleString()} will grow to your FIRE number of $${fireNumber.toLocaleString()} by age ${targetRetirementAge} without additional contributions.`;
  } else if (Number.isFinite(whenCanICoast.yearsToCoast)) {
    summary = `You're ${coastFIREProgress.toFixed(1)}% of the way to Coast FIRE. At your current savings rate, you'll reach Coast FIRE in ${whenCanICoast.yearsToCoast} years at age ${whenCanICoast.coastAge}.`;
  } else {
    summary = `You're ${coastFIREProgress.toFixed(1)}% of the way to Coast FIRE. Consider increasing your savings rate to reach Coast FIRE sooner.`;
  }

  return {
    // Core Results
    coastFIRENumber,
    fireNumber,
    status,
    coastFIREAchieved,
    coastFIREProgress,
    gapToCoastFIRE,

    // Timeline Analysis
    whenCanICoast,
    coastAgeAnalysis,
    coastNumbersByAge,

    // Projections
    projections,
    milestones,

    // Scenarios
    partTimeScenarios,
    riskToleranceScenarios,
    retirementAgeComparison,

    // Summary & Recommendations
    summary,
    insights,
    recommendations,
    warnings,

    // Inputs Echo
    inputs: {
      currentAge,
      targetRetirementAge,
      currentSavings,
      annualExpenses,
      monthlySavings,
      expectedReturn,
      inflationRate,
      safeWithdrawalRate,
      riskTolerance,
      partTimeIncome
    }
  };
}

// ============================================================================
// Quick Utility Functions
// ============================================================================

/**
 * Quick calculation of Coast FIRE number
 */
export function quickCoastFIRENumber(
  annualExpenses: number,
  yearsToRetirement: number,
  expectedReturn: number = 0.07,
  inflationRate: number = 0.03,
  safeWithdrawalRate: number = 0.04
): number {
  const realReturn = calculateRealReturn(expectedReturn, inflationRate);
  const fireNumber = calculateFIRENumberForCoast(annualExpenses, safeWithdrawalRate);
  return calculateCoastFIRENumber(fireNumber, yearsToRetirement, realReturn);
}

/**
 * Quick check if Coast FIRE is achieved
 */
export function isCoastFIREAchieved(
  currentSavings: number,
  annualExpenses: number,
  yearsToRetirement: number,
  expectedReturn: number = 0.07,
  inflationRate: number = 0.03,
  safeWithdrawalRate: number = 0.04
): boolean {
  const coastNumber = quickCoastFIRENumber(
    annualExpenses,
    yearsToRetirement,
    expectedReturn,
    inflationRate,
    safeWithdrawalRate
  );
  return currentSavings >= coastNumber;
}

/**
 * Quick calculation of years to Coast FIRE
 */
export function quickYearsToCoastFIRE(
  currentSavings: number,
  monthlySavings: number,
  annualExpenses: number,
  currentAge: number,
  targetRetirementAge: number,
  expectedReturn: number = 0.07,
  inflationRate: number = 0.03,
  safeWithdrawalRate: number = 0.04
): number {
  const inputs: CoastFIREInputs = {
    currentAge,
    targetRetirementAge,
    currentSavings,
    annualExpenses,
    monthlySavings,
    expectedReturn,
    inflationRate,
    safeWithdrawalRate
  };
  
  const result = calculateWhenCanICoast(inputs);
  return result.yearsToCoast;
}

/**
 * Compare Coast FIRE scenarios with different inputs
 */
export function compareCoastFIREScenarios(
  baseInputs: CoastFIREInputs,
  scenarios: Partial<CoastFIREInputs>[]
): {
  base: CoastFIREResult;
  scenarios: CoastFIREResult[];
} {
  const base = calculateCoastFIRE(baseInputs);
  const scenarioResults = scenarios.map(scenario => 
    calculateCoastFIRE({ ...baseInputs, ...scenario })
  );

  return {
    base,
    scenarios: scenarioResults
  };
}
