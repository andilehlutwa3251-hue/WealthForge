import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import { prisma }           from '@/lib/prisma';

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.financialProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: 'Complete onboarding first' }, { status: 404 });

  const score = calculateScore(profile);
  return NextResponse.json({ score, updatedAt: profile.updatedAt });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const score = calculateScore(body);

  await prisma.$transaction(async (tx) => {
    await tx.financialProfile.upsert({
      where:  { userId: session.user.id },
      create: { userId: session.user.id, ...body },
      update: body,
    });
    await tx.user.update({ where: { id: session.user.id }, data: { wealthScore: score.total } });
    await tx.wealthScoreHistory.create({
      data: { userId: session.user.id, score: score.total, band: score.band,
               dimensionScores: score.dimensions.reduce((a: any, d: any) => ({ ...a, [d.name]: d.score }), {}) },
    });
  });

  return NextResponse.json({ score });
}

function calculateScore(p: any) {
  const income = p.monthlyNetIncome ?? 0;

  // Foundation (0-180)
  let foundation = 0;
  if (p.hasBudget) foundation += 40;
  foundation += clamp(Math.round(((p.monthsEmergencyFund ?? 0) / 6) * 80), 0, 80);
  if (p.hasLifeInsurance)    foundation += 20;
  if (p.hasIncomeProtection) foundation += 25;
  if (p.hasDreadDisease)     foundation += 15;

  // Debt (0-180)
  let debt = 0;
  const unsecMonths = income > 0 ? (p.unsecuredDebtTotal ?? 0) / income : 99;
  if (unsecMonths === 0)       debt += 60;
  else if (unsecMonths <= 1)   debt += 45;
  else if (unsecMonths <= 3)   debt += 25;
  else if (unsecMonths <= 6)   debt += 10;
  const dpr = income > 0 ? (p.monthlyDebtPayments ?? 0) / income : 1;
  if (dpr <= 0.15)      debt += 60;
  else if (dpr <= 0.25) debt += 40;
  else if (dpr <= 0.35) debt += 20;
  const cs = p.creditScore || 580;
  if (cs >= 750)      debt += 60;
  else if (cs >= 700) debt += 45;
  else if (cs >= 650) debt += 25;
  else if (cs >= 600) debt += 10;

  // Savings (0-160)
  let savings = 0;
  const sr = income > 0 ? ((p.monthlySavings ?? 0) + (p.stokvelMonthly ?? 0)) / income : 0;
  if (sr >= 0.20)      savings += 80;
  else if (sr >= 0.15) savings += 60;
  else if (sr >= 0.10) savings += 40;
  else if (sr >= 0.05) savings += 20;
  if (p.stokvelMonthly > 0) savings += clamp(Math.round(((p.stokvelMonthly ?? 0) / (income * 0.1)) * 40), 0, 40);
  if (p.hasAutomatedSavings) savings += 40;

  // Investment (0-200)
  let investment = 0;
  const tfsaRate = income > 0 ? ((p.tfsaMonthlyContrib ?? 0) * 12) / 36000 : 0;
  investment += clamp(Math.round(tfsaRate * 60), 0, 60);
  const jseM = income > 0 ? (p.jsePortfolioValue ?? 0) / income : 0;
  investment += clamp(Math.round((jseM / 12) * 60), 0, 60);
  const raRate = income > 0 ? ((p.raMonthlyContrib ?? 0) * 12) / (income * 12) : 0;
  investment += clamp(Math.round((raRate / 0.275) * 50), 0, 50);
  const propM = income > 0 ? (p.propertyEquity ?? 0) / income : 0;
  investment += clamp(Math.round((propM / 24) * 30), 0, 30);

  // Tax (0-130)
  let tax = 0;
  if (p.fileSARSReturn)    tax += 40;
  if (p.claimsRADeduction) tax += 50;
  if (p.maximisedTFSA)     tax += 40;

  // Knowledge (0-150)
  let knowledge = 0;
  knowledge += clamp(Math.round(((p.academyScoreEarned ?? 0) / 270) * 100), 0, 100);
  knowledge += clamp(((p.incomeStreams ?? 1) - 1) * 25, 0, 50);

  const dims = [
    { name: 'Foundation',    score: clamp(foundation, 0, 180), max: 180 },
    { name: 'Debt Health',   score: clamp(debt, 0, 180),       max: 180 },
    { name: 'Savings Rate',  score: clamp(savings, 0, 160),    max: 160 },
    { name: 'Investment',    score: clamp(investment, 0, 200), max: 200 },
    { name: 'Tax',           score: clamp(tax, 0, 130),        max: 130 },
    { name: 'Knowledge',     score: clamp(knowledge, 0, 150),  max: 150 },
  ];
  const total = clamp(dims.reduce((a, d) => a + d.score, 0), 0, 1000);
  const band  = total <= 250 ? 'STARTER' : total <= 500 ? 'BUILDER' : total <= 750 ? 'FORGER' : 'ELITE';

  return {
    total,
    band,
    dimensions: dims.map(d => ({ ...d, pct: Math.round((d.score / d.max) * 100) })),
  };
}
