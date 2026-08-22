import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

export async function GET() {
  let db = 'ok';
  try { await prisma.$queryRaw`SELECT 1`; } catch { db = 'error'; }
  return NextResponse.json({
    status: db === 'ok' ? 'ok' : 'degraded',
    db,
    ts:  Date.now(),
    env: process.env.NODE_ENV,
    app: 'wealthforge',
  });
}
