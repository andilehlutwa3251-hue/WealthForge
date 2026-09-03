import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import { getStripe }        from '@/lib/stripe';

const PRICES: Record<string, string> = {
  forger: process.env.STRIPE_PRICE_FORGER ?? '',
  elite:  process.env.STRIPE_PRICE_ELITE  ?? '',
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { plan } = await req.json();
  const priceId  = PRICES[plan as keyof typeof PRICES];
  if (!priceId) return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });

  const stripe = getStripe();
  const origin = req.headers.get('origin') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const checkout = await stripe.checkout.sessions.create({
    mode:                 'subscription',
    payment_method_types: ['card'],
    customer_email:       session.user.email,
    line_items:           [{ price: priceId, quantity: 1 }],
    success_url:          `${origin}/dashboard?upgraded=true`,
    cancel_url:           `${origin}/pricing?cancelled=true`,
    metadata:             { userId: session.user.id, plan },
  });
  return NextResponse.json({ url: checkout.url });
}
