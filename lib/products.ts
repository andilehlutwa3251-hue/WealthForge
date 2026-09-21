export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: 'month'
}

export const PRODUCTS: Product[] = [
  {
    id: 'builder',
    name: 'WealthForge Builder',
    description: 'Full Wealth Score, recommendations, Academy library, and stokvel tracking tools.',
    priceInCents: 14900,
    interval: 'month',
  },
  {
    id: 'forge-elite',
    name: 'WealthForge Elite',
    description: 'AI wealth coach, advanced investing insights, group accounts, and priority support.',
    priceInCents: 34900,
    interval: 'month',
  },
]

export function getProduct(productId: string) {
  return PRODUCTS.find((product) => product.id === productId)
}
