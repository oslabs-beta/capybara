# 🚀 Setup Guide

This guide provides comprehensive setup instructions for Coffybara.

## Prerequisites

### Required Software

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Google Cloud CLI** - [Installation guide](https://cloud.google.com/sdk/docs/install)
- **Git** - For cloning the repository

### Required Accounts

- **Google Cloud Account** with an existing GKE cluster
- **Slack Workspace** - For receiving notifications
- **Pinecone Account** - For vector database (free tier available)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/oslabs-beta/capybara.git
cd coffybara
```

### 2. Google Cloud Setup

Coffybara uses **Google Cloud Secrets Manager** for secure configuration storage.

#### Enable Required APIs

```bash
gcloud services enable secretmanager.googleapis.com
gcloud services enable pubsub.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable monitoring.googleapis.com
```

#### Authentication

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Get cluster credentials
gcloud container clusters get-credentials YOUR_CLUSTER_NAME --region=YOUR_REGION
```

### 3. Create Required Secrets

Create the following secrets in Google Cloud Secrets Manager:

```bash
# Pinecone Configuration
gcloud secrets create pinecone-api-key --data-file=<(echo "your-pinecone-api-key")
gcloud secrets create pinecone-index-name --data-file=<(echo "your-pinecone-index-name")

# Gemini AI
gcloud secrets create gemini-api-key --data-file=<(echo "your-gemini-api-key")

# Slack Integration
gcloud secrets create slack-bot-token --data-file=<(echo "xoxb-your-slack-bot-token")
gcloud secrets create slack-channel --data-file=<(echo "your-channel-id")

# Redis (optional - will use local Redis if not provided)
gcloud secrets create redis-url --data-file=<(echo "redis://your-redis-url")

# Clerk Authentication (for dashboard access)
gcloud secrets create clerk-publishable-key --data-file=<(echo "your-clerk-publishable-key")
```

### 4. Google Cloud Pub/Sub Setup

Create the required Pub/Sub infrastructure:

```bash
# Create Pub/Sub topic for Kubernetes events
gcloud pubsub topics create kubernetes-events

# Create subscription for event processing
gcloud pubsub subscriptions create kubernetes-events-sub --topic=kubernetes-events
```

### 5. Slack App Setup

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Coffybara") and select your workspace
4. Go to "OAuth & Permissions" in the sidebar
5. Add the following Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
6. Install the app to your workspace
7. Copy the "Bot User OAuth Token" (starts with `xoxb-`)
8. Add the bot to your desired channel and get the channel ID

### 6. Pinecone Setup

1. Create account at [Pinecone](https://www.pinecone.io/)
2. Create a new index:
   - **Name**: `kubernetes-events` (or your preferred name)
   - **Dimensions**: `768` (for Gemini embeddings)
   - **Metric**: `cosine`
3. Copy your API key from the dashboard

### 7. Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Copy the API key for your secrets

## Running the Application

### Development Mode

From the root directory:

```bash
# Install all dependencies and start both client and server
npm start
```

This will:

- Install dependencies for root, client, and server
- Start the backend server on port 3000
- Start the frontend client on port 5173

### Individual Services

```bash
# Start only the backend server
npm run server

# Start only the frontend client
npm run client
```

### Access Points

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Configuration

### Required IAM Roles

Ensure your Google Cloud service account has these roles:

- `Kubernetes Engine Viewer` - Access cluster information
- `Pub/Sub Editor` - Event streaming
- `Secret Manager Secret Accessor` - Read configuration secrets
- `Monitoring Viewer` - Access cluster metrics

### Environment Variables

The application automatically loads configuration from Google Cloud Secrets Manager. No local `.env` files are needed for development.

### GKE Cluster Requirements

Your GKE cluster should have:

- **Workload Identity** enabled (recommended)
- **Cloud Monitoring** enabled
- **Event streaming** to Pub/Sub configured

## Troubleshooting

### Common Issues

**"Cannot connect to cluster"**

- Verify `gcloud auth login` is completed
- Check that your service account has proper IAM roles
- Ensure cluster credentials are configured: `gcloud container clusters get-credentials CLUSTER_NAME --region=REGION`

**"Secrets not found"**

- Verify all required secrets exist in Google Cloud Secrets Manager
- Check that your service account has `Secret Manager Secret Accessor` role
- Ensure you're in the correct Google Cloud project

**"Pub/Sub subscription not receiving events"**

- Verify the Pub/Sub topic and subscription exist
- Check that your GKE cluster is configured to send events to Pub/Sub
- Review Cloud Logging for any error messages

**"Slack notifications not working"**

- Verify your Slack bot token is correct and starts with `xoxb-`
- Ensure the bot is added to your target channel
- Check that the channel ID is correct (not the channel name)

### Getting Help

1. Check the [troubleshooting section](https://github.com/oslabs-beta/capybara/issues) in our GitHub issues
2. Enable debug logging by setting log level to debug in the application
3. Review Google Cloud Logs for error messages

## Next Steps

Once setup is complete:

1. Visit the dashboard at http://localhost:5173
2. Authenticate with Clerk
3. Start monitoring your Kubernetes events in real-time
4. Configure your notification preferences
5. Review the [Architecture documentation](architecture.md) to understand the system better

## Development Setup

For contributors and developers:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Type checking
npm run typecheck
```
