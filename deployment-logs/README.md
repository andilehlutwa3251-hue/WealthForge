# Deployment Failure Logs

This folder contains logs of unsuccessful deployments for debugging and historical tracking.

## How to Use

```bash
./scripts/log-deployment-failure.sh "vercel" "build-failed-404" "Specific error message or build log excerpt here"
```

## Recommended Failure Types
- `build-failed`
- `build-failed-404`
- `env-var-missing`
- `paystack-error`
- `database-connection`
- `argocd-sync-failed`
- `admin-dashboard-inaccessible`

Logs are timestamped and include branch/commit info for easy debugging.