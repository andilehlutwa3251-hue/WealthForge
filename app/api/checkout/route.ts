import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { getProduct } from '@/lib/products'

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
    }
    const body = await request.json()
    const product = getProduct(typeof body.productId === 'string' ? body.productId : '')
    if (!product) return NextResponse.json({ error: 'That plan is not available.' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      success_url: `${new URL(request.url).origin}/?checkout=success`,
      cancel_url: `${new URL(request.url).origin}/?checkout=cancelled`,
      mode: 'subscription',
      customer_email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined,
      metadata: { plan: product.id },
      subscription_data: { metadata: { plan: product.id } },
      line_items: [{
        price_data: {
          currency: 'zar',
          product_data: { name: product.name, description: product.description },
          unit_amount: product.priceInCents,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      integration_identifier: `wealthforge_${Math.random().toString(36).slice(2, 10)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[v0] Checkout session failed:', error)
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 500 })
  }
}
