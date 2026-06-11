#!/bin/bash
# WealthForge Monorepo - Vercel Production Deployment Script
# Usage: ./scripts/deploy-to-vercel.sh
# On failure it will automatically log the issue.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FAILURE_SCRIPT="$SCRIPT_DIR/log-deployment-failure.sh"

echo "🚀 Starting WealthForge Vercel Production Deployment..."

# Function to handle failures
handle_failure() {
  local exit_code=$?
  echo "❌ Deployment failed with exit code $exit_code"
  
  if [ -x "$LOG_FAILURE_SCRIPT" ]; then
    "$LOG_FAILURE_SCRIPT" "vercel" "deployment-failed" "Exit code: $exit_code. Check Vercel dashboard and build logs for details." --auto-commit
  else
    echo "⚠️  log-deployment-failure.sh not found or not executable."
  fi
  
  exit $exit_code
}

trap 'handle_failure' ERR

# 1. Verify environment
echo "Checking environment variables..."
if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN not set"
  "$LOG_FAILURE_SCRIPT" "vercel" "env-var-missing" "VERCEL_TOKEN is not set" --auto-commit || true
  exit 1
fi

# 2. Build check
echo "Running local build verification..."
if ! npm run build; then
  "$LOG_FAILURE_SCRIPT" "vercel" "build-failed" "npm run build failed. Check for TypeScript, module, or config errors." --auto-commit || true
  exit 1
fi

# 3. Deploy to Vercel (Production)
echo "Deploying to Vercel Production..."
if ! vercel --prod --token="$VERCEL_TOKEN" --yes; then
  "$LOG_FAILURE_SCRIPT" "vercel" "vercel-deploy-failed" "Vercel CLI deployment failed. Check dashboard for build/runtime errors." --auto-commit || true
  exit 1
fi

echo "✅ Deployment complete. Check Vercel dashboard for URL and logs."
echo "Next: Verify Paystack live mode, admin dashboard access, and revenue tracking endpoints."