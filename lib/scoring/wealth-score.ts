/**
 * WealthForge Wealth Score engine.
 *
 * Produces a 0-1000 composite score plus a tier band, from the financial
 * profile a user submits during onboarding. This is an educational,
 * self-assessment indicator of financial habits and positioning — it is
 * NOT personalized financial advice, a credit score, or an investment
 * recommendation, and must not be presented as such (FAIS Act, South
 * Africa). Pair any score display with that disclaimer in the UI.
 *
 * Weights and thresholds are intentionally named constants so they can be
 * tuned without touching the calculation logic.
 */

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export interface WealthScoreInput {
  monthlyIncome: number; // ZAR, net/after-tax
  monthlyExpenses: number; // ZAR
  monthlyDebtRepayments: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebt: number;
  monthsOfExpensesSaved: number;
  hasRetirementAnnuity: boolean;
  hasTFSA: boolean;
  riskTolerance: RiskTolerance;
  goalTimeframeYears: number;
}

export interface WealthScoreBreakdown {
  savingsRate: { value: number; score: number; max: number };
  debtHealth: { debtToIncomeRatio: number; repaymentBurden: number; score: number; max: number };
  emergencyFund: { monthsCovered: number; score: number; max: number };
  investments: { investmentToIncomeRatio: number; score: number; max: number };
  goalAlignment: { projectedYearsToGoal: number | null; score: number; max: number };
  riskAlignment: { score: number; max: number };
}

export interface WealthScoreResult {
  score: number; // 0-1000
  band: "Starter" | "Builder" | "Forger" | "Elite";
  breakdown: WealthScoreBreakdown;
}

const MAX_POINTS = {
  savingsRate: 250,
  debtHealth: 200,
  emergencyFund: 150,
  investments: 200,
  goalAlignment: 100,
  riskAlignment: 100,
} as const;

// Sanity check that weights sum to 1000 — keeps the model honest if tuned later.
const TOTAL_POINTS = Object.values(MAX_POINTS).reduce((a, b) => a + b, 0);
if (TOTAL_POINTS !== 1000) {
  throw new Error(`Wealth Score weights must sum to 1000, got ${TOTAL_POINTS}`);
}

export const BAND_THRESHOLDS = {
  Starter: [0, 249],
  Builder: [250, 549],
  Forger: [550, 799],
  Elite: [800, 1000],
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function scoreSavingsRate(input: WealthScoreInput) {
  const { monthlyIncome, monthlyExpenses, monthlyDebtRepayments } = input;
  const max = MAX_POINTS.savingsRate;

  if (monthlyIncome <= 0) return { value: 0, score: 0, max };

  const rate = (monthlyIncome - monthlyExpenses - monthlyDebtRepayments) / monthlyIncome;

  let score: number;
  if (rate >= 0.3) score = max;
  else if (rate >= 0.2) score = max * 0.8;
  else if (rate >= 0.1) score = max * 0.56;
  else if (rate >= 0) score = max * 0.28;
  else score = 0; // spending beyond income

  return { value: Number(rate.toFixed(4)), score: Math.round(score), max };
}

function scoreDebtHealth(input: WealthScoreInput) {
  const { monthlyIncome, monthlyDebtRepayments, totalDebt } = input;
  const max = MAX_POINTS.debtHealth;

  if (monthlyIncome <= 0) return { debtToIncomeRatio: 0, repaymentBurden: 0, score: 0, max };

  const annualIncome = monthlyIncome * 12;
  const debtToIncomeRatio = annualIncome > 0 ? totalDebt / annualIncome : 0;
  const repaymentBurden = monthlyDebtRepayments / monthlyIncome;

  // Lower ratios are better. Each sub-metric scored on its own curve, then blended.
  const ratioScore =
    debtToIncomeRatio <= 0 ? 1 :
    debtToIncomeRatio <= 0.2 ? 0.9 :
    debtToIncomeRatio <= 0.5 ? 0.65 :
    debtToIncomeRatio <= 1 ? 0.35 :
    debtToIncomeRatio <= 2 ? 0.15 : 0;

  const burdenScore =
    repaymentBurden <= 0 ? 1 :
    repaymentBurden <= 0.15 ? 0.9 :
    repaymentBurden <= 0.3 ? 0.6 :
    repaymentBurden <= 0.45 ? 0.3 : 0.1;

  const blended = ratioScore * 0.6 + burdenScore * 0.4;

  return {
    debtToIncomeRatio: Number(debtToIncomeRatio.toFixed(4)),
    repaymentBurden: Number(repaymentBurden.toFixed(4)),
    score: Math.round(blended * max),
    max,
  };
}

function scoreEmergencyFund(input: WealthScoreInput) {
  const { monthsOfExpensesSaved } = input;
  const max = MAX_POINTS.emergencyFund;
  const TARGET_MONTHS = 6;

  let score: number;
  if (monthsOfExpensesSaved >= TARGET_MONTHS) score = max;
  else if (monthsOfExpensesSaved >= 3) score = max * 0.67;
  else if (monthsOfExpensesSaved >= 1) score = max * 0.33;
  else if (monthsOfExpensesSaved > 0) score = max * 0.1;
  else score = 0;

  return { monthsCovered: monthsOfExpensesSaved, score: Math.round(score), max };
}

function scoreInvestments(input: WealthScoreInput) {
  const { monthlyIncome, totalInvestments, hasTFSA, hasRetirementAnnuity } = input;
  const max = MAX_POINTS.investments;
  const BASE_MAX = 160; // remaining 40 pts come from TFSA/RA bonuses below
  const annualIncome = monthlyIncome * 12;

  const ratio = annualIncome > 0 ? totalInvestments / annualIncome : 0;

  let base: number;
  if (ratio >= 3) base = BASE_MAX;
  else if (ratio >= 1.5) base = BASE_MAX * 0.8;
  else if (ratio >= 0.5) base = BASE_MAX * 0.55;
  else if (ratio > 0) base = BASE_MAX * 0.3;
  else base = 0;

  const bonus = (hasTFSA ? 20 : 0) + (hasRetirementAnnuity ? 20 : 0);

  return {
    investmentToIncomeRatio: Number(ratio.toFixed(4)),
    score: clamp(Math.round(base + bonus), 0, max),
    max,
  };
}

function scoreGoalAlignment(input: WealthScoreInput) {
  const { monthlyIncome, monthlyExpenses, monthlyDebtRepayments, totalSavings, totalInvestments, goalTimeframeYears } = input;
  const max = MAX_POINTS.goalAlignment;

  const monthlySurplus = monthlyIncome - monthlyExpenses - monthlyDebtRepayments;

  // Simplified heuristic, not a real projection: without a target goal
  // amount we can't compute a true required rate. This estimates whether
  // the *pace* of current surplus accumulation plausibly supports the
  // stated timeframe, using net worth-to-date as a rough base. Treat this
  // as a placeholder — swap in a real target-amount-based projection once
  // onboarding captures a goal amount.
  if (monthlySurplus <= 0 || goalTimeframeYears <= 0) {
    return { projectedYearsToGoal: null, score: monthlySurplus > 0 ? Math.round(max * 0.3) : 0, max };
  }

  const currentBase = totalSavings + totalInvestments;
  const annualSurplus = monthlySurplus * 12;
  const projectedYears = currentBase > 0 ? currentBase / annualSurplus : goalTimeframeYears;

  let score: number;
  if (projectedYears <= goalTimeframeYears * 0.5) score = max;
  else if (projectedYears <= goalTimeframeYears) score = max * 0.75;
  else if (projectedYears <= goalTimeframeYears * 1.5) score = max * 0.45;
  else score = max * 0.2;

  return { projectedYearsToGoal: Number(projectedYears.toFixed(1)), score: Math.round(score), max };
}

function scoreRiskAlignment(input: WealthScoreInput) {
  const { riskTolerance, totalInvestments, totalSavings } = input;
  const max = MAX_POINTS.riskAlignment;

  const total = totalInvestments + totalSavings;
  const investmentShare = total > 0 ? totalInvestments / total : 0;

  // How well the actual cash/investment mix matches the stated risk
  // tolerance. Each tolerance has an "ideal" investment-share midpoint;
  // score decays with distance from it.
  const idealMidpoint: Record<RiskTolerance, number> = {
    conservative: 0.3,
    moderate: 0.55,
    aggressive: 0.8,
  };

  const distance = Math.abs(investmentShare - idealMidpoint[riskTolerance]);
  const score = clamp(max * (1 - distance / 0.6), 0, max);

  return { score: Math.round(score), max };
}

function bandForScore(score: number): WealthScoreResult["band"] {
  if (score >= BAND_THRESHOLDS.Elite[0]) return "Elite";
  if (score >= BAND_THRESHOLDS.Forger[0]) return "Forger";
  if (score >= BAND_THRESHOLDS.Builder[0]) return "Builder";
  return "Starter";
}

export function calculateWealthScore(input: WealthScoreInput): WealthScoreResult {
  const savingsRate = scoreSavingsRate(input);
  const debtHealth = scoreDebtHealth(input);
  const emergencyFund = scoreEmergencyFund(input);
  const investments = scoreInvestments(input);
  const goalAlignment = scoreGoalAlignment(input);
  const riskAlignment = scoreRiskAlignment(input);

  const score = clamp(
    savingsRate.score +
      debtHealth.score +
      emergencyFund.score +
      investments.score +
      goalAlignment.score +
      riskAlignment.score,
    0,
    1000
  );

  return {
    score,
    band: bandForScore(score),
    breakdown: {
      savingsRate,
      debtHealth,
      emergencyFund,
      investments,
      goalAlignment,
      riskAlignment,
    },
  };
}
