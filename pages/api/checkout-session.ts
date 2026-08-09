import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

// Price in the smallest currency unit (ZAR cents). R300.00 => 30000
const DEFAULT_AMOUNT = 30000;
const CURRENCY = 'zar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Attempt to use an existing price id from env
    let priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      // Create a Product and Price on-the-fly (idempotent if run repeatedly in Stripe)
      const product = await stripe.products.create({
        name: 'WealthForge Pro Monthly',
        description: 'Monthly subscription to WealthForge Pro',
      });

      const price = await stripe.prices.create({
        unit_amount: DEFAULT_AMOUNT,
        currency: CURRENCY,
        recurring: { interval: 'month' },
        product: product.id,
      });

      priceId = price.id;
      // Note: We cannot write back to repo secrets from server code. Consider saving this value
      // in your deployment environment (GitHub Actions or Vercel) as STRIPE_PRICE_ID.
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://your-site.example'}/?checkout_success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://your-site.example'}/pricing?canceled=1`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
