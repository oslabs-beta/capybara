# 🚀 Deployment Guide

This guide covers deploying Coffybara to production environments.

## Overview

Coffybara uses a microservices architecture with the following deployment targets:

- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Google Cloud Run
- **Infrastructure**: Google Cloud Platform (GKE, Pub/Sub, Redis, etc.)

## Prerequisites

- Completed [Setup Guide](setup.md)
- Google Cloud CLI authenticated and configured
- Vercel CLI installed (optional, but recommended)
- All secrets configured in Google Cloud Secrets Manager

## Backend Deployment (Google Cloud Run)

### 1. Prepare the Backend

```bash
# Navigate to server directory
cd server

# Build the TypeScript application
npm run build

# Test the build locally (optional)
npm start
```

### 2. Deploy to Cloud Run

```bash
# Deploy directly from source
gcloud run deploy coffybara-backend \
  --source=. \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=10 \
  --set-env-vars="NODE_ENV=production"
```

### 3. Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=coffybara-backend \
  --domain=api.coffybara.com \
  --region=us-central1
```

### 4. Set Up Cloud Run Service Account

Create a dedicated service account for Cloud Run:

```bash
# Create service account
gcloud iam service-accounts create coffybara-backend \
  --display-name="Coffybara Backend Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:coffybara-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:coffybara-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/pubsub.editor"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:coffybara-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/container.viewer"

# Update Cloud Run service to use the service account
gcloud run services update coffybara-backend \
  --service-account=coffybara-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --region=us-central1
```

## Frontend Deployment (Vercel)

### 1. Prepare the Frontend

```bash
# Navigate to client directory
cd client

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Build and test locally (optional)
npm run build
npm run preview
```

### 2. Configure Environment Variables

Create a `.env.production` file or set environment variables in Vercel dashboard:

```bash
# Required for production
VITE_API_URL=https://your-backend-url.run.app
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Deploy to Vercel

```bash
# Deploy to Vercel
vercel --prod

# Or configure via Vercel dashboard
# 1. Import GitHub repository
# 2. Set root directory to 'client'
# 3. Set build command to 'npm run build'
# 4. Set output directory to 'dist'
```

### 4. Configure Custom Domain

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `coffybara.com`)

## Infrastructure Configuration

### 1. Production Redis Setup

For production, use Google Cloud Memorystore:

```bash
# Create Redis instance
gcloud redis instances create coffybara-redis \
  --size=1 \
  --region=us-central1 \
  --network=default \
  --redis-version=redis_7_0

# Get the Redis IP
gcloud redis instances describe coffybara-redis --region=us-central1

# Update the redis-url secret
gcloud secrets versions add redis-url --data-file=<(echo "redis://REDIS_IP:6379")
```

### 2. Production Pub/Sub Configuration

```bash
# Create production topic and subscription
gcloud pubsub topics create kubernetes-events-prod

gcloud pubsub subscriptions create kubernetes-events-prod-sub \
  --topic=kubernetes-events-prod \
  --ack-deadline=60 \
  --message-retention-duration=7d
```

### 3. Monitoring and Alerting

Set up Cloud Monitoring alerts:

```bash
# Create alerting policy for high error rates
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/error-rate-policy.yaml

# Create alerting policy for high latency
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/latency-policy.yaml
```

## Environment-Specific Configurations

### Production Environment Variables

Update your secrets for production:

```bash
# Update Slack configuration for production channel
gcloud secrets versions add slack-channel --data-file=<(echo "production-alerts-channel-id")

# Update Pinecone to use production index
gcloud secrets versions add pinecone-index-name --data-file=<(echo "kubernetes-events-prod")
```

### Staging Environment

Create a staging environment:

```bash
# Deploy staging backend
gcloud run deploy coffybara-backend-staging \
  --source=./server \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=staging"

# Deploy staging frontend (using Vercel preview)
vercel --target=staging
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Google Cloud
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy coffybara-backend \
            --source=./server \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client
```

## Health Checks and Monitoring

### Application Health Checks

Both environments include health check endpoints:

- **Backend**: `https://your-backend.run.app/api/health`
- **Frontend**: Built-in Vercel health monitoring

### Monitoring Setup

1. **Google Cloud Monitoring**: Automatic metrics for Cloud Run
2. **Vercel Analytics**: Frontend performance monitoring
3. **Custom Metrics**: Application-specific metrics via the `/metrics` endpoint

### Log Aggregation

- **Backend Logs**: Automatically collected by Google Cloud Logging
- **Frontend Logs**: Available in Vercel dashboard
- **Structured Logging**: All logs include correlation IDs for tracing

## Security Considerations

### Production Security Checklist

- [ ] All secrets stored in Google Cloud Secrets Manager
- [ ] Service accounts follow principle of least privilege
- [ ] HTTPS enforced for all endpoints
- [ ] CORS properly configured for production domains
- [ ] Rate limiting enabled
- [ ] Authentication required for sensitive endpoints

### SSL/TLS Configuration

Both Vercel and Google Cloud Run provide automatic HTTPS:

- **Vercel**: Automatic SSL certificates for all domains
- **Cloud Run**: Automatic SSL termination

## Scaling Configuration

### Auto-scaling Settings

```bash
# Configure Cloud Run auto-scaling
gcloud run services update coffybara-backend \
  --min-instances=1 \
  --max-instances=100 \
  --cpu=1 \
  --memory=2Gi \
  --concurrency=80 \
  --region=us-central1
```

### Database Scaling

- **Redis**
- **Pinecone**: Automatically scales with usage

## Backup and Disaster Recovery

### Data Backup Strategy

1. **Configuration Backup**: All secrets backed up in Google Cloud Secrets Manager
2. **Vector Database**: Pinecone provides automatic backups
3. **Application State**: Stateless design - no persistent data to backup

## Cost Optimization

## Troubleshooting Deployment Issues

### Common Issues

**Cloud Run Deployment Fails**

- Check service account permissions
- Verify all required secrets exist
- Review Cloud Run logs for errors

**Frontend Build Fails**

- Ensure all environment variables are set
- Check Node.js version compatibility
- Verify build command in Vercel settings

**Application Not Receiving Events**

- Verify Pub/Sub topic and subscription configuration
- Check IAM permissions for Pub/Sub
- Review application logs for connection errors
