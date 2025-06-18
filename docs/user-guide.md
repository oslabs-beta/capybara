# 📖 User Guide

This guide covers how to use Coffybara's current features for monitoring your Kubernetes infrastructure.

## Getting Started

Once you've completed the [Setup Guide](setup.md), you can access Coffybara through:

- **Web Dashboard**: http://localhost:5173 (development) or your deployed URL
- **Slack Notifications**: Automated alerts in your configured channel

## Dashboard Features

### 🔴 Live Events

**Real-time Event Stream**

- Continuous stream of Kubernetes events as they happen
- Events displayed with timestamp, namespace, pod, and message details
- Real-time updates via WebSocket connection
- Events are automatically filtered and deduplicated

### 📈 Analytics

**Historical Event Trends**

- View patterns in your Kubernetes events over time
- Analyze event frequency and types
- Identify recurring issues in your clusters

### 🎯 Filtered Views

**Focus on What Matters**

- Filter events by specific namespaces
- Focus on particular event types (warnings, errors, etc.)
- View events from specific time periods

### 🔍 Search

**Find Specific Events**

- Search through event messages and descriptions
- Locate events by pod name or namespace
- Quickly find historical incidents

### ⚙️ Settings

**Configure Your Experience**

- Adjust notification preferences
- Set up dashboard display options
- Manage your account settings

## Slack Notifications

Coffybara sends intelligent Slack notifications that include:

### Event Context

- **Pod Information**: Which pod triggered the event
- **Namespace**: Where the event occurred
- **Timing**: When the event happened
- **Event Message**: Full Kubernetes event details

### AI Analysis

- **Root Cause Analysis**: Intelligent analysis of what caused the event
- **Recommendations**: Specific steps to resolve the issue
- **Context**: How this event relates to your cluster's health

### Historical Context

- **Similar Past Events**: References to related events from your history
- **Pattern Recognition**: Identification of recurring issues
- **Learning**: Insights based on previous incidents

### Action Items

- **Specific Steps**: Clear, actionable remediation steps
- **Priority Guidance**: Which actions to take first
- **Documentation Links**: Relevant resources to help resolve issues

## Basic API Usage

### Health Check

```bash
GET /api/health
```

### WebSocket Connection

Connect to receive real-time events:

```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

socket.on('kubernetes-event', (event) => {
  console.log('New event:', event);
});
```

## Getting Support

- **Issues**: [GitHub Issues](https://github.com/oslabs-beta/capybara/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oslabs-beta/capybara/discussions)
