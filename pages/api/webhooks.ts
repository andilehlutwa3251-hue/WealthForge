import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import { PrismaClient } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set');
    return res.status(400).send('Webhook secret not configured');
  }

  const buf = await buffer(req as any);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig as string, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      // If you collect customer email at Checkout configure 'customer_email'
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (customerEmail) {
        try {
          await prisma.user.updateMany({
            where: { email: customerEmail },
            data: {
              subscriptionPlan: 'Pro',
              subscriptionStatus: 'active',
              subscriptionUpdatedAt: new Date(),
            },
          });
        } catch (e) {
          console.error('Failed to update user subscription in DB', e);
        }
      }

      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      const customer = invoice.customer;
      // handle failed payments if desired
      console.log('Invoice payment failed', invoice.id, 'customer', customer);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;
      // Optionally reconcile subscription status in your DB
      console.log('Subscription cancelled', subscription.id, 'customer', customerId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
