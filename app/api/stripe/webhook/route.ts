import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { ensureSubscriptionsTable, recordSubscription, updateSubscriptionStatus } from '@/lib/db'

export async function POST(request: Request) {
  const signature = (await headers()).get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })

  const payload = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('[v0] Stripe webhook verification failed:', error)
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 })
  }

  try {
    await ensureSubscriptionsTable()

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
      const email = session.customer_details?.email
      const plan = session.metadata?.plan

      if (subscriptionId && customerId && email && plan && (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded')) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await recordSubscription(customerId, subscriptionId, email, plan, subscription.start_date, subscription.ended_at || subscription.current_period_end)
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      await updateSubscriptionStatus(subscription.id, subscription.status)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Stripe webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
