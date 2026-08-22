import { NextResponse } from 'next/server';
import { headers }      from 'next/headers';
import stripe           from '@/lib/stripe';
import { prisma }       from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = headers().get('stripe-signature');
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as any;
    if (s.metadata?.userId) {
      await prisma.user.update({
        where: { id: s.metadata.userId },
        data: {
          subscriptionPlan:   s.metadata.plan === 'elite' ? 'Elite' : 'Forger',
          subscriptionStatus: 'active',
          stripeCustomerId:   s.customer,
          stripeSubscriptionId: s.subscription,
        },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data:  { subscriptionPlan: 'Free', subscriptionStatus: 'cancelled' },
    });
  }

  return NextResponse.json({ received: true });
}
