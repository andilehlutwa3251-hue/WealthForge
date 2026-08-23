import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import { prisma }           from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await prisma.wealthScoreHistory.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    take:    30,
    select:  { score: true, band: true, createdAt: true },
  });

  return NextResponse.json({
    history: history.map(h => ({
      score: h.score,
      band:  h.band,
      date:  h.createdAt.toISOString().split('T')[0],
    })),
  });
}
