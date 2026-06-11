# WealthForge Monorepo Deployment Playbook (June 2026)

## Current Recommended Stack
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Expo/React Native
- **Backend:** NestJS + Prisma + PostgreSQL
- **Payments:** Stripe (international) + Paystack (ZAR primary)
- **AI:** OpenAI (RAG + multi-agent orchestration)
- **Hosting & DevOps:** Vercel (primary) + Docker + Kubernetes + Helm + ArgoCD GitOps

## Production Deployment Checklist (Vercel + GitOps)
1. Environment variables verified (Paystack live keys, Stripe, OpenAI, database URLs, auth secrets)
2. Build succeeds locally before push
3. Vercel project settings correct (root directory, build command, output directory)
4. Custom domain + SSL configured
5. Admin dashboard routes protected (middleware or route guards)
6. Early revenue tracking endpoints live and tested
7. Sandbox vs Live payment toggle clearly documented and switched

## Common Issues & Fast Fixes
- **404 on production routes** → Check next.config.js rewrites, dynamic route casing, Vercel trailing slash settings
- **Build fails on Paystack/Stripe env vars** → Add them in Vercel dashboard + redeploy
- **Admin dashboard inaccessible** → Verify auth middleware + role checks in production build
- **ArgoCD not picking up new images** → Check image tag in Helm values + force sync

## Recommended Monorepo Folder Structure
```
wealthforge-os/
├── apps/
│   ├── web/                 # Next.js 15 frontend
│   ├── admin/               # Admin dashboard
│   └── mobile/              # Expo/React Native
├── packages/
│   ├── ui/                  # Shared shadcn + components
│   ├── db/                  # Prisma schema + migrations
│   └── utils/               # Shared helpers, RAG clients
├── infrastructure/
│   ├── helm/                # Helm charts
│   ├── k8s/                 # Raw manifests
│   └── argocd/              # Application manifests
└── scripts/                 # Deployment & packaging scripts
```

## Sample Helm Values (infrastructure/helm/values.yaml)
```yaml
replicaCount: 2

image:
  repository: ghcr.io/your-org/wealthforge-web
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: app.wealthforge.ai
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: wealthforge-tls
      hosts:
        - app.wealthforge.ai

env:
  - name: NODE_ENV
    value: "production"
  - name: PAYSTACK_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: wealthforge-secrets
        key: paystack-secret-key
  - name: STRIPE_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: wealthforge-secrets
        key: stripe-secret-key
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: wealthforge-secrets
        key: database-url

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70

nodeSelector: {}
tolerations: []
affinity: {}
```

## Next Implementation Steps
- Full ArgoCD Application manifest
- GitHub Actions workflow for image build + push
- Vercel + K8s promotion script

---

*This playbook is implemented as a living reference in the wealthforge-os skill. Ready for expansion into actual files/scripts.*