# Vercel Deployment Troubleshooting Guide

## How to Read Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the failed deployment
3. Go to the **Build Logs** tab
4. Scroll to the **bottom** — the real error is almost always near the end

## Common Error Patterns & Fixes

### 1. Module Not Found
**Error**: `Module not found: Can't resolve '...'`

**Fix**:
- Check your imports
- Run `npm install` locally
- Make sure the package exists in `package.json`

### 2. Environment Variables Missing
**Error**: `Environment variable X is not set`

**Fix**:
- Go to Vercel → Project → Settings → Environment Variables
- Add the missing variable for **Preview** and **Production** environments
- Common ones: `PAYSTACK_SECRET_KEY`, `DATABASE_URL`, `OPENAI_API_KEY`

### 3. Build Fails Locally but Works on Vercel (or vice versa)
**Fix**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### 4. 404 Errors After Deployment
**Possible causes**:
- `trailingSlash` mismatch
- Dynamic route issues
- Middleware problems

**Fix**: Use the improved `next.config.js` in this repo.

### 5. Paystack / Payment Related Errors
Usually caused by:
- Missing `PAYSTACK_SECRET_KEY` in Preview environment
- Using test keys in production or vice versa

## Recommended Debugging Steps

1. Check the **last 30 lines** of the build log
2. Search for the words: `Error`, `Failed`, `Module not found`
3. Copy the error and paste it here for faster debugging

## Useful Commands

```bash
# Clean build
rm -rf .next
npm run build

# Type check
npx tsc --noEmit

# Check environment variables locally
echo $PAYSTACK_SECRET_KEY
```

---
*Part of Wealth OS Deployment Resilience System*