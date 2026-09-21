'use server'

import { stripe } from '@/lib/stripe'
import { getProduct } from '@/lib/products'

export async function startCheckoutSession(productId: string) {
  const product = getProduct(productId)
  if (!product) throw new Error('That plan is not available.')

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'zar',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    integration_identifier: `wealthforge_${Math.random().toString(36).slice(2, 10)}`,
  })

  return session.client_secret
}
