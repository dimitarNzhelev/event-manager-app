# Kubernetes Admin Dashboard

A modern, responsive admin dashboard for monitoring Kubernetes clusters, managing Prometheus alert rules, and tracking alerts in real-time.

## Features

- **Cluster Overview**
  - Total number of running pods
  - Active namespaces count
  - Current alert status
  - Interactive dashboard cards with smooth animations

- **Alert Management**
  - Real-time alert monitoring
  - Detailed alert information
  - Integration with Grafana dashboards
  - Alert history tracking

- **Pod Management**
  - Pod status monitoring
  - Pod metrics visualization
  - Namespace-based filtering

- **Alert Rules**
  - View and manage Prometheus alert rules
  - Rule status monitoring
  - Easy navigation between related alerts and rules

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Shadcn/UI
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Environment variables configured

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
BACKEND_URL=<your-backend-api-url>
AUTH_TOKEN=<your-auth-token>
DASHBOARD_URL=<your-grafana-dashboard-url>
NODE_ENV=development
