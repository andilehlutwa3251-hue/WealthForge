#!/bin/bash
# WealthForge Monorepo - Vercel Production Deployment Script
# Usage: ./scripts/deploy-to-vercel.sh

set -euo pipefail

echo "🚀 Starting WealthForge Vercel Production Deployment..."

# 1. Verify environment
echo "Checking environment variables..."
if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN not set"
  exit 1
fi

# 2. Build check
echo "Running local build verification..."
npm run build || { echo "❌ Build failed"; exit 1; }

# 3. Deploy to Vercel (Production)
echo "Deploying to Vercel Production..."
vercel --prod --token="$VERCEL_TOKEN" --yes

echo "✅ Deployment complete. Check Vercel dashboard for URL and logs."
echo "Next: Verify Paystack live mode, admin dashboard access, and revenue tracking endpoints."