import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { assets: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const totalValue = user.assets.reduce((sum, asset) => sum + asset.value, 0);

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    wealthScore: user.wealthScore,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    totalValue,
    assets: user.assets,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, value, type } = body;

  if (!name || typeof name !== 'string' || !type || typeof type !== 'string') {
    return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return NextResponse.json({ error: 'Value must be a number' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.asset.create({
    data: {
      name,
      value: numericValue,
      type,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
