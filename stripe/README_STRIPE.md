# Stripe integration added

This commit adds a minimal Stripe Checkout integration to create subscription sessions and a webhook handler.

Environment variables required (add these to your repository / Vercel secrets):

- STRIPE_SECRET_KEY (server-side secret key)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (publishable key for the client)
- STRIPE_WEBHOOK_SECRET (webhook signing secret after you register the endpoint in Stripe)
- STRIPE_PRICE_ID (optional) — if you want to pin a price ID instead of allowing the server to create one on-demand
- NEXT_PUBLIC_SITE_URL (optional) — used for success/cancel URLs; defaults to https://your-site.example if not set

Notes:
- The server code will create a product+price on first Checkout request if STRIPE_PRICE_ID is not configured.
- The webhook handler verifies signatures using STRIPE_WEBHOOK_SECRET and updates the user's subscription status in the database based on the customer's email.
