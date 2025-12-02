/**
 * RMD (Required Minimum Distribution) Calculator
 *
 * Calculates required minimum distributions from retirement accounts
 * based on IRS life expectancy tables and current regulations.
 *
 * Key Rules (SECURE Act 2.0):
 * - Age 73: RMD starting age for those born 1951-1959
 * - Age 75: RMD starting age for those born 1960 or later (effective 2033)
 * - First RMD: Due by April 1 of the year after reaching RMD age
 * - Subsequent RMDs: Due by December 31 of each year
 * - Penalty: 25% excise tax on amounts not withdrawn (10% if corrected within 2 years)
 *
 * Affected Accounts:
 * - Traditional IRA, SEP IRA, SIMPLE IRA
 * - 401(k), 403(b), 457(b)
 * - Roth 401(k) (prior to 2024, now exempt)
 * - NOT Roth IRAs (unless inherited)
 *
 * @module retirement/rmdCalculator
 */

// ============================================================================
// IRS LIFE EXPECTANCY TABLES (Publication 590-B)
// ============================================================================

/**
 * IRS Uniform Lifetime Table (Table III)
 * Used by most IRA owners to calculate RMDs
 * Based on joint life expectancy with hypothetical beneficiary 10 years younger
 * Updated for 2022+ per IRS final regulations
 */
export const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4,
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  116: 2.8,
  117: 2.7,
  118: 2.5,
  119: 2.3,
  120: 2.0,
};

/**
 * IRS Joint Life and Last Survivor Expectancy Table (Table II)
 * Used when spouse is sole beneficiary AND more than 10 years younger
 * Format: jointLifeTable[ownerAge][beneficiaryAge] = distribution period
 * Simplified subset - key combinations for common age differences
 */
export const JOINT_LIFE_TABLE: Record<number, Record<number, number>> = {
  72: { 52: 32.4, 53: 31.6, 54: 30.9, 55: 30.1, 56: 29.4, 57: 28.7, 58: 28.0, 59: 27.4, 60: 26.8, 61: 26.2, 62: 25.7 },
  73: { 53: 31.8, 54: 31.1, 55: 30.3, 56: 29.6, 57: 28.9, 58: 28.2, 59: 27.6, 60: 26.9, 61: 26.4, 62: 25.8, 63: 25.3 },
  74: { 54: 31.3, 55: 30.5, 56: 29.8, 57: 29.1, 58: 28.4, 59: 27.7, 60: 27.1, 61: 26.5, 62: 25.9, 63: 25.4, 64: 24.9 },
  75: { 55: 30.7, 56: 30.0, 57: 29.3, 58: 28.6, 59: 27.9, 60: 27.3, 61: 26.7, 62: 26.1, 63: 25.5, 64: 25.0, 65: 24.5 },
  76: { 56: 30.2, 57: 29.5, 58: 28.8, 59: 28.1, 60: 27.4, 61: 26.8, 62: 26.2, 63: 25.7, 64: 25.1, 65: 24.6, 66: 24.1 },
  77: { 57: 29.7, 58: 29.0, 59: 28.3, 60: 27.6, 61: 27.0, 62: 26.4, 63: 25.8, 64: 25.2, 65: 24.7, 66: 24.2, 67: 23.7 },
  78: { 58: 29.2, 59: 28.5, 60: 27.8, 61: 27.2, 62: 26.5, 63: 25.9, 64: 25.4, 65: 24.8, 66: 24.3, 67: 23.8, 68: 23.3 },
  79: { 59: 28.7, 60: 28.0, 61: 27.3, 62: 26.7, 63: 26.1, 64: 25.5, 65: 24.9, 66: 24.4, 67: 23.9, 68: 23.4, 69: 22.9 },
  80: { 60: 28.2, 61: 27.5, 62: 26.8, 63: 26.2, 64: 25.6, 65: 25.0, 66: 24.5, 67: 23.9, 68: 23.4, 69: 22.9, 70: 22.5 },
  81: { 61: 27.7, 62: 27.0, 63: 26.4, 64: 25.7, 65: 25.1, 66: 24.6, 67: 24.0, 68: 23.5, 69: 23.0, 70: 22.5, 71: 22.1 },
  82: { 62: 27.2, 63: 26.5, 64: 25.9, 65: 25.2, 66: 24.7, 67: 24.1, 68: 23.6, 69: 23.1, 70: 22.6, 71: 22.1, 72: 21.7 },
  83: { 63: 26.7, 64: 26.0, 65: 25.4, 66: 24.8, 67: 24.2, 68: 23.7, 69: 23.1, 70: 22.6, 71: 22.2, 72: 21.7, 73: 21.3 },
  84: { 64: 26.2, 65: 25.5, 66: 24.9, 67: 24.3, 68: 23.7, 69: 23.2, 70: 22.7, 71: 22.2, 72: 21.7, 73: 21.3, 74: 20.8 },
  85: { 65: 25.7, 66: 25.1, 67: 24.4, 68: 23.8, 69: 23.3, 70: 22.7, 71: 22.2, 72: 21.8, 73: 21.3, 74: 20.9, 75: 20.4 },
  86: { 66: 25.2, 67: 24.6, 68: 24.0, 69: 23.4, 70: 22.8, 71: 22.3, 72: 21.8, 73: 21.3, 74: 20.9, 75: 20.4, 76: 20.0 },
  87: { 67: 24.8, 68: 24.1, 69: 23.5, 70: 22.9, 71: 22.4, 72: 21.9, 73: 21.4, 74: 20.9, 75: 20.5, 76: 20.0, 77: 19.6 },
  88: { 68: 24.3, 69: 23.7, 70: 23.1, 71: 22.5, 72: 21.9, 73: 21.4, 74: 21.0, 75: 20.5, 76: 20.1, 77: 19.6, 78: 19.2 },
  89: { 69: 23.9, 70: 23.2, 71: 22.6, 72: 22.1, 73: 21.5, 74: 21.0, 75: 20.6, 76: 20.1, 77: 19.7, 78: 19.2, 79: 18.8 },
  90: { 70: 23.4, 71: 22.8, 72: 22.2, 73: 21.6, 74: 21.1, 75: 20.6, 76: 20.1, 77: 19.7, 78: 19.3, 79: 18.8, 80: 18.4 },
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported retirement account types
 */
export type RetirementAccountType =
  | 'traditional_ira'
  | 'sep_ira'
  | 'simple_ira'
  | '401k'
  | '403b'
  | '457b'
  | 'roth_401k'
  | 'inherited_ira'
  | 'inherited_roth_ira';

/**
 * Accounts that require RMDs
 */
export const RMD_REQUIRED_ACCOUNTS: RetirementAccountType[] = [
  'traditional_ira',
  'sep_ira',
  'simple_ira',
  '401k',
  '403b',
  '457b',
  'inherited_ira',
  'inherited_roth_ira',
];

/**
 * Accounts exempt from RMDs (Roth 401k now exempt starting 2024)
 */
export const RMD_EXEMPT_ACCOUNTS: RetirementAccountType[] = ['roth_401k'];

/**
 * Input parameters for RMD calculation
 */
export interface RMDInputs {
  /** Account holder's birth year (e.g., 1955) */
  birthYear: number;
  /** Account balance as of December 31 of the prior year */
  accountBalance: number;
  /** Spouse's birth year (optional - for sole beneficiary calculation) */
  spouseBirthYear?: number;
  /** Whether spouse is the sole beneficiary */
  spouseIsSoleBeneficiary?: boolean;
  /** Expected annual rate of return (decimal, e.g., 0.06 for 6%) */
  expectedReturnRate?: number;
  /** Number of years to project forward */
  projectionYears?: number;
  /** Type of retirement account */
  accountType?: RetirementAccountType;
  /** Current year for calculations (defaults to current year) */
  calculationYear?: number;
}

/**
 * Single year projection in RMD schedule
 */
export interface YearlyRMDProjection {
  /** Calendar year */
  year: number;
  /** Age at end of year */
  age: number;
  /** Account balance at start of year (Dec 31 prior year) */
  startBalance: number;
  /** Required minimum distribution for the year */
  rmd: number;
  /** Distribution period (life expectancy factor) used */
  distributionPeriod: number;
  /** RMD as percentage of starting balance */
  rmdPercentage: number;
  /** Account balance at end of year (after RMD, with growth) */
  endBalance: number;
  /** Investment growth for the year */
  growth: number;
  /** Whether this is the first RMD year */
  isFirstRMDYear: boolean;
  /** Deadline for this RMD */
  deadline: string;
}

/**
 * Result of RMD calculation
 */
export interface RMDResult {
  /** Current year's RMD amount */
  currentRMD: number;
  /** Distribution period (life expectancy factor) */
  distributionPeriod: number;
  /** Account holder's current age */
  currentAge: number;
  /** Age when RMDs begin */
  rmdStartAge: number;
  /** Year when RMDs begin */
  rmdStartYear: number;
  /** Whether RMDs are currently required */
  rmdRequired: boolean;
  /** Years until RMDs begin (0 if already required) */
  yearsUntilRMD: number;
  /** Whether using Joint Life table (spouse >10 years younger) */
  usingJointLifeTable: boolean;
  /** Yearly RMD projections */
  projections: YearlyRMDProjection[];
  /** Total projected RMDs over projection period */
  totalProjectedRMDs: number;
  /** Total projected growth over projection period */
  totalProjectedGrowth: number;
  /** Final projected balance */
  finalProjectedBalance: number;
  /** First RMD deadline */
  firstRMDDeadline: string;
  /** Penalty rate for missed RMDs */
  penaltyRate: number;
  /** Account type being calculated */
  accountType: RetirementAccountType;
  /** Whether this account type requires RMDs */
  accountRequiresRMD: boolean;
  /** RMD as percentage of account balance */
  rmdPercentage: number;
  /** Warnings or important notices */
  warnings: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate age based on birth year and reference year
 */
export function calculateAge(birthYear: number, referenceYear: number): number {
  return referenceYear - birthYear;
}

/**
 * Determine RMD starting age based on birth year (SECURE Act 2.0)
 */
export function getRMDStartAge(birthYear: number): number {
  if (birthYear <= 1950) {
    return 72; // Pre-SECURE Act
  } else if (birthYear >= 1951 && birthYear <= 1959) {
    return 73; // SECURE Act 2.0 (2023+)
  } else {
    return 75; // SECURE Act 2.0 (2033+)
  }
}

/**
 * Get the first RMD year
 */
export function getFirstRMDYear(birthYear: number): number {
  const rmdStartAge = getRMDStartAge(birthYear);
  return birthYear + rmdStartAge;
}

/**
 * Check if spouse qualifies for Joint Life table (more than 10 years younger)
 */
export function qualifiesForJointLifeTable(
  ownerBirthYear: number,
  spouseBirthYear: number | undefined,
  spouseIsSoleBeneficiary: boolean | undefined
): boolean {
  if (!spouseBirthYear || !spouseIsSoleBeneficiary) {
    return false;
  }
  const ageDifference = spouseBirthYear - ownerBirthYear;
  return ageDifference > 10;
}

/**
 * Get distribution period from appropriate IRS table
 */
export function getDistributionPeriod(
  ownerAge: number,
  spouseAge?: number,
  useJointLifeTable?: boolean
): number {
  // If using Joint Life table and we have spouse age
  if (useJointLifeTable && spouseAge !== undefined) {
    const ownerAgeTable = JOINT_LIFE_TABLE[ownerAge];
    if (ownerAgeTable && ownerAgeTable[spouseAge]) {
      return ownerAgeTable[spouseAge];
    }
    // If exact combination not in table, interpolate or use Uniform
  }

  // Use Uniform Lifetime Table (default)
  const period = UNIFORM_LIFETIME_TABLE[ownerAge];
  if (period !== undefined) {
    return period;
  }

  // For ages beyond table, use minimum
  if (ownerAge > 120) {
    return 2.0;
  }

  // For ages before 72 (shouldn't need RMD yet)
  return UNIFORM_LIFETIME_TABLE[72] || 27.4;
}

/**
 * Calculate single year RMD
 */
export function calculateSingleYearRMD(
  accountBalance: number,
  distributionPeriod: number
): number {
  if (accountBalance <= 0 || distributionPeriod <= 0) {
    return 0;
  }
  return accountBalance / distributionPeriod;
}

/**
 * Format deadline string based on whether it's the first RMD year
 */
export function formatRMDDeadline(year: number, isFirstYear: boolean): string {
  if (isFirstYear) {
    return `April 1, ${year + 1}`;
  }
  return `December 31, ${year}`;
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate Required Minimum Distribution (RMD) and projections
 *
 * @param inputs - RMD calculation inputs
 * @returns Complete RMD calculation results including projections
 *
 * @example
 * ```typescript
 * const result = calculateRMD({
 *   birthYear: 1955,
 *   accountBalance: 500000,
 *   expectedReturnRate: 0.06,
 *   projectionYears: 15
 * });
 *
 * console.log(result.currentRMD); // Current year's RMD
 * console.log(result.projections); // Year-by-year RMD schedule
 * ```
 */
export function calculateRMD(inputs: RMDInputs): RMDResult {
  const {
    birthYear,
    accountBalance,
    spouseBirthYear,
    spouseIsSoleBeneficiary = false,
    expectedReturnRate = 0.06,
    projectionYears = 20,
    accountType = 'traditional_ira',
    calculationYear = new Date().getFullYear(),
  } = inputs;

  const warnings: string[] = [];

  // Validate inputs
  if (birthYear < 1900 || birthYear > calculationYear) {
    warnings.push('Birth year appears invalid');
  }

  if (accountBalance < 0) {
    warnings.push('Account balance cannot be negative');
  }

  // Check if account requires RMDs
  const accountRequiresRMD = RMD_REQUIRED_ACCOUNTS.includes(accountType);
  if (!accountRequiresRMD) {
    warnings.push(
      `${accountType.replace('_', ' ').toUpperCase()} accounts are now exempt from RMDs during owner's lifetime (SECURE Act 2.0)`
    );
  }

  // Calculate ages and RMD timing
  const currentAge = calculateAge(birthYear, calculationYear);
  const rmdStartAge = getRMDStartAge(birthYear);
  const rmdStartYear = getFirstRMDYear(birthYear);
  const yearsUntilRMD = Math.max(0, rmdStartYear - calculationYear);
  const rmdRequired = calculationYear >= rmdStartYear;

  // Determine if using Joint Life table
  const usingJointLifeTable = qualifiesForJointLifeTable(
    birthYear,
    spouseBirthYear,
    spouseIsSoleBeneficiary
  );

  if (usingJointLifeTable) {
    warnings.push(
      'Using Joint Life and Last Survivor Table because spouse is sole beneficiary and more than 10 years younger'
    );
  }

  // Calculate spouse age for Joint Life table
  const spouseAge = spouseBirthYear
    ? calculateAge(spouseBirthYear, calculationYear)
    : undefined;

  // Calculate current year's RMD
  let currentRMD = 0;
  let distributionPeriod = 0;

  if (rmdRequired && accountRequiresRMD) {
    distributionPeriod = getDistributionPeriod(
      currentAge,
      spouseAge,
      usingJointLifeTable
    );
    currentRMD = calculateSingleYearRMD(accountBalance, distributionPeriod);
  } else {
    // Get what the distribution period would be at RMD start age
    distributionPeriod = getDistributionPeriod(
      rmdStartAge,
      spouseAge ? spouseAge + yearsUntilRMD : undefined,
      usingJointLifeTable
    );
  }

  // First RMD deadline
  const firstRMDDeadline = formatRMDDeadline(rmdStartYear, true);

  // Generate projections
  const projections: YearlyRMDProjection[] = [];
  let runningBalance = accountBalance;
  let totalRMDs = 0;
  let totalGrowth = 0;

  // Start projections from current year or RMD start year, whichever is later
  const projectionStartYear = rmdRequired
    ? calculationYear
    : Math.max(calculationYear, rmdStartYear);

  for (let i = 0; i < projectionYears; i++) {
    const projectionYear = projectionStartYear + i;
    const projectionAge = calculateAge(birthYear, projectionYear);
    const projectionSpouseAge = spouseBirthYear
      ? calculateAge(spouseBirthYear, projectionYear)
      : undefined;

    // Skip if before RMD required
    if (projectionYear < rmdStartYear) {
      // Just apply growth, no RMD
      const growth = runningBalance * expectedReturnRate;
      runningBalance += growth;
      totalGrowth += growth;
      continue;
    }

    const isFirstRMDYear = projectionYear === rmdStartYear;
    const yearDistributionPeriod = getDistributionPeriod(
      projectionAge,
      projectionSpouseAge,
      usingJointLifeTable
    );
    const yearRMD = calculateSingleYearRMD(runningBalance, yearDistributionPeriod);
    const rmdPercentage = runningBalance > 0 ? (yearRMD / runningBalance) * 100 : 0;

    // Calculate end of year balance: (start - RMD) * (1 + return)
    const afterRMDBalance = runningBalance - yearRMD;
    const growth = afterRMDBalance * expectedReturnRate;
    const endBalance = afterRMDBalance + growth;

    projections.push({
      year: projectionYear,
      age: projectionAge,
      startBalance: runningBalance,
      rmd: yearRMD,
      distributionPeriod: yearDistributionPeriod,
      rmdPercentage,
      endBalance: Math.max(0, endBalance),
      growth,
      isFirstRMDYear,
      deadline: formatRMDDeadline(projectionYear, isFirstRMDYear),
    });

    totalRMDs += yearRMD;
    totalGrowth += growth;
    runningBalance = Math.max(0, endBalance);

    // Stop if balance depleted
    if (runningBalance <= 0) {
      break;
    }
  }

  // Calculate RMD percentage
  const rmdPercentage =
    accountBalance > 0 && currentRMD > 0
      ? (currentRMD / accountBalance) * 100
      : 0;

  // Add warnings for special situations
  if (currentAge >= 73 && !rmdRequired) {
    warnings.push(
      'Please verify your RMD status with a tax professional'
    );
  }

  if (accountType === 'inherited_ira' || accountType === 'inherited_roth_ira') {
    warnings.push(
      'Inherited IRA rules differ. Most non-spouse beneficiaries must withdraw entire account within 10 years (SECURE Act).'
    );
  }

  return {
    currentRMD,
    distributionPeriod,
    currentAge,
    rmdStartAge,
    rmdStartYear,
    rmdRequired,
    yearsUntilRMD,
    usingJointLifeTable,
    projections,
    totalProjectedRMDs: totalRMDs,
    totalProjectedGrowth: totalGrowth,
    finalProjectedBalance: runningBalance,
    firstRMDDeadline,
    penaltyRate: 0.25, // 25% penalty (can be reduced to 10%)
    accountType,
    accountRequiresRMD,
    rmdPercentage,
    warnings,
  };
}

/**
 * Calculate RMDs for multiple accounts
 *
 * @param accounts - Array of account inputs
 * @returns Combined RMD calculation with per-account breakdown
 *
 * @example
 * ```typescript
 * const result = calculateMultipleAccountRMDs([
 *   { birthYear: 1955, accountBalance: 300000, accountType: 'traditional_ira' },
 *   { birthYear: 1955, accountBalance: 200000, accountType: '401k' }
 * ]);
 * ```
 */
export interface MultiAccountRMDResult {
  /** Total RMD across all accounts */
  totalRMD: number;
  /** Total balance across all accounts */
  totalBalance: number;
  /** Individual account results */
  accounts: Array<RMDResult & { accountLabel: string }>;
  /** Combined projections */
  combinedProjections: YearlyRMDProjection[];
  /** Warnings across all accounts */
  warnings: string[];
}

export function calculateMultipleAccountRMDs(
  accounts: Array<RMDInputs & { accountLabel?: string }>
): MultiAccountRMDResult {
  const results: Array<RMDResult & { accountLabel: string }> = [];
  let totalRMD = 0;
  let totalBalance = 0;
  const allWarnings: string[] = [];

  // Calculate each account
  accounts.forEach((account, index) => {
    const result = calculateRMD(account);
    const label =
      account.accountLabel ||
      `Account ${index + 1} (${account.accountType || 'traditional_ira'})`;

    results.push({
      ...result,
      accountLabel: label,
    });

    totalRMD += result.currentRMD;
    totalBalance += account.accountBalance;
    allWarnings.push(...result.warnings.map((w) => `${label}: ${w}`));
  });

  // Combine projections (simplified - sum all accounts)
  const maxProjectionLength = Math.max(
    ...results.map((r) => r.projections.length)
  );
  const combinedProjections: YearlyRMDProjection[] = [];

  for (let i = 0; i < maxProjectionLength; i++) {
    const yearProjections = results
      .map((r) => r.projections[i])
      .filter((p) => p !== undefined);

    if (yearProjections.length > 0) {
      combinedProjections.push({
        year: yearProjections[0].year,
        age: yearProjections[0].age,
        startBalance: yearProjections.reduce((sum, p) => sum + p.startBalance, 0),
        rmd: yearProjections.reduce((sum, p) => sum + p.rmd, 0),
        distributionPeriod: yearProjections[0].distributionPeriod,
        rmdPercentage:
          yearProjections.reduce((sum, p) => sum + p.rmd, 0) /
          yearProjections.reduce((sum, p) => sum + p.startBalance, 0) *
          100,
        endBalance: yearProjections.reduce((sum, p) => sum + p.endBalance, 0),
        growth: yearProjections.reduce((sum, p) => sum + p.growth, 0),
        isFirstRMDYear: yearProjections.some((p) => p.isFirstRMDYear),
        deadline: yearProjections[0].deadline,
      });
    }
  }

  // Add note about IRA aggregation
  const iraTypes: RetirementAccountType[] = [
    'traditional_ira',
    'sep_ira',
    'simple_ira',
  ];
  const hasMultipleIRAs =
    accounts.filter((a) => iraTypes.includes(a.accountType || 'traditional_ira'))
      .length > 1;

  if (hasMultipleIRAs) {
    allWarnings.push(
      'Note: RMDs for Traditional, SEP, and SIMPLE IRAs can be aggregated and taken from any one or combination of these accounts.'
    );
  }

  return {
    totalRMD,
    totalBalance,
    accounts: results,
    combinedProjections,
    warnings: allWarnings,
  };
}

/**
 * Estimate tax impact of RMD
 *
 * @param rmd - RMD amount
 * @param otherIncome - Other taxable income
 * @param filingStatus - Tax filing status
 * @returns Estimated tax impact
 */
export interface TaxImpactEstimate {
  /** Estimated federal tax on RMD */
  federalTax: number;
  /** Marginal tax bracket */
  marginalRate: number;
  /** Effective tax rate on RMD */
  effectiveRate: number;
  /** Note about state taxes */
  stateNote: string;
}

export function estimateRMDTaxImpact(
  rmd: number,
  otherIncome: number = 0,
  filingStatus: 'single' | 'married_joint' = 'single'
): TaxImpactEstimate {
  // 2024 Tax Brackets (simplified)
  const brackets =
    filingStatus === 'single'
      ? [
          { min: 0, max: 11600, rate: 0.1 },
          { min: 11600, max: 47150, rate: 0.12 },
          { min: 47150, max: 100525, rate: 0.22 },
          { min: 100525, max: 191950, rate: 0.24 },
          { min: 191950, max: 243725, rate: 0.32 },
          { min: 243725, max: 609350, rate: 0.35 },
          { min: 609350, max: Infinity, rate: 0.37 },
        ]
      : [
          { min: 0, max: 23200, rate: 0.1 },
          { min: 23200, max: 94300, rate: 0.12 },
          { min: 94300, max: 201050, rate: 0.22 },
          { min: 201050, max: 383900, rate: 0.24 },
          { min: 383900, max: 487450, rate: 0.32 },
          { min: 487450, max: 731200, rate: 0.35 },
          { min: 731200, max: Infinity, rate: 0.37 },
        ];

  const totalIncome = otherIncome + rmd;
  let tax = 0;
  let marginalRate = 0.1;

  // Calculate tax on total income
  for (const bracket of brackets) {
    if (totalIncome > bracket.min) {
      const taxableInBracket = Math.min(
        totalIncome - bracket.min,
        bracket.max - bracket.min
      );
      tax += taxableInBracket * bracket.rate;
      marginalRate = bracket.rate;
    }
  }

  // Calculate tax without RMD
  let taxWithoutRMD = 0;
  for (const bracket of brackets) {
    if (otherIncome > bracket.min) {
      const taxableInBracket = Math.min(
        otherIncome - bracket.min,
        bracket.max - bracket.min
      );
      taxWithoutRMD += taxableInBracket * bracket.rate;
    }
  }

  const federalTax = tax - taxWithoutRMD;
  const effectiveRate = rmd > 0 ? federalTax / rmd : 0;

  return {
    federalTax,
    marginalRate,
    effectiveRate,
    stateNote:
      'State income taxes may also apply. Consult your tax advisor for a complete analysis.',
  };
}

/**
 * Calculate potential QCD (Qualified Charitable Distribution) benefits
 *
 * QCDs allow individuals 70½+ to donate up to $105,000 (2024) directly
 * from IRA to charity, satisfying RMD without counting as taxable income.
 */
export interface QCDAnalysis {
  /** Whether QCD is available (age 70.5+) */
  qcdAvailable: boolean;
  /** Maximum annual QCD amount (2024: $105,000) */
  maxQCDAmount: number;
  /** Amount of RMD that could be satisfied via QCD */
  rmdSatisfiedByQCD: number;
  /** Potential tax savings if full RMD done as QCD */
  potentialTaxSavings: number;
  /** Notes about QCD rules */
  notes: string[];
}

export function analyzeQCDOpportunity(
  birthYear: number,
  rmd: number,
  marginalTaxRate: number = 0.22,
  calculationYear: number = new Date().getFullYear()
): QCDAnalysis {
  const age = calculateAge(birthYear, calculationYear);
  const ageInMonths = age * 12 + 6; // Approximate - assume mid-year birthday
  const qcdAvailable = ageInMonths >= 70.5 * 12;

  const maxQCDAmount = 105000; // 2024 limit
  const rmdSatisfiedByQCD = Math.min(rmd, maxQCDAmount);
  const potentialTaxSavings = rmdSatisfiedByQCD * marginalTaxRate;

  const notes: string[] = [
    'QCD transfers must go directly from IRA to qualified charity.',
    'QCD does not apply to employer plans (401k, 403b) - only IRAs.',
    'QCD counts toward RMD but is not included in taxable income.',
    'QCD limit for 2024 is $105,000 per individual.',
  ];

  if (!qcdAvailable) {
    notes.unshift('You must be at least 70½ years old to make a QCD.');
  }

  return {
    qcdAvailable,
    maxQCDAmount,
    rmdSatisfiedByQCD,
    potentialTaxSavings,
    notes,
  };
}
