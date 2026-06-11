import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user (you can change email)
  const user = await prisma.user.upsert({
    where: { email: 'andile@wealthforge.ai' },
    update: {},
    create: {
      email: 'andile@wealthforge.ai',
      name: 'Andile',
      subscriptionPlan: 'Pro',
      subscriptionStatus: 'active',
    },
  });

  // Seed realistic South African assets
  await prisma.asset.createMany({
    data: [
      { name: 'S&P 500 ETF', value: 320000, type: 'Investment', userId: user.id },
      { name: 'Property in Centurion', value: 850000, type: 'Property', userId: user.id },
      { name: 'Retirement Annuity', value: 245000, type: 'Retirement', userId: user.id },
      { name: 'Emergency Fund (Capitec)', value: 85000, type: 'Cash', userId: user.id },
      { name: 'Car (Toyota Corolla)', value: 145000, type: 'Other', userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeded real South African portfolio data');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());