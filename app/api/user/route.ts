import { NextResponse }     from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/lib/auth';
import { prisma }            from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where:   { email: session.user.email },
    include: { assets: true },
  });
  const totalValue = user?.assets.reduce((sum, a) => sum + a.value, 0) ?? 0;
  return NextResponse.json({ ...user, totalValue });
}
