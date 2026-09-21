import { NextResponse } from 'next/server'
import { ensureWaitlistTable, query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    await ensureWaitlistTable()
    await query(
      'INSERT INTO wealthforge_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email],
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] Waitlist submission failed:', error)
    return NextResponse.json({ error: 'We could not save your email. Please try again.' }, { status: 500 })
  }
}
