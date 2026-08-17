# Spotify Premium Retention Intelligence Platform - API Specification Contract

**Specification Version**: 1.0.0
**Base Path**: `/api/v1`
**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Executive Dashboard Endpoints

### `GET /api/v1/dashboard/kpis`
Fetches high-level executive retention KPIs.

**Response `200 OK`**:
```json
[
  {
    "id": "total-predictions",
    "title": "Total Predictions",
    "value": "128,450",
    "trend": "+12.4%",
    "status": "Excellent",
    "sparklineData": [92000, 98000, 105000, 112000, 118000, 124000, 128450],
    "accentColor": "#1DB954"
  }
]
```

---

## 2. Health & Governance Telemetry Endpoints

### `GET /api/v1/health/system`
Fetches overall AI platform health score and microservice topology status.

**Response `200 OK`**:
```json
{
  "overallScore": 99.8,
  "status": "Healthy",
  "lastCheck": "2 minutes ago",
  "environment": "Production",
  "healthyModelsCount": 8,
  "degradedModelsCount": 1,
  "offlineModelsCount": 0,
  "warningsCount": 2,
  "services": [
    {
      "id": "inference-engine",
      "name": "Inference Engine",
      "status": "Healthy",
      "uptime": "99.99%",
      "latency": "1.45ms",
      "accentColor": "#1DB954"
    }
  ]
}
```

---

## 3. Prediction Intelligence Endpoints

### `GET /api/v1/predictions/summary`
Returns inference summary metrics.

**Response `200 OK`**:
```json
{
  "totalPredictions": 128450,
  "highConfidenceRate": 91,
  "avgProcessingTimeMs": 28,
  "successRate": 99.8
}
```

### `GET /api/v1/predictions/recent`
Returns recent cohort inference records.

**Response `200 OK`**:
```json
[
  {
    "id": "PRD-94820",
    "segment": "Premium Individual",
    "type": "30-Day Churn Risk",
    "confidence": "94%",
    "status": "Completed",
    "time": "2 mins ago"
  }
]
```

---

## 4. Prescriptive Recommendation Endpoints

### `GET /api/v1/recommendations/summary`
Returns Next Best Action (NBA) conversion summaries.

**Response `200 OK`**:
```json
{
  "total": 18245,
  "acceptanceRate": 84,
  "revenueImpact": "+$2.8M",
  "avgConfidence": 92
}
```

### `GET /api/v1/recommendations/top`
Returns top prescriptive recommendations queue.

**Response `200 OK`**:
```json
[
  {
    "id": "REC-4029",
    "title": "Personalized 30-Day Premium Extension",
    "priority": "Critical",
    "confidence": 95,
    "impact": "+$420K ARR",
    "segment": "High Risk Cohort #104",
    "status": "In Progress",
    "created": "10m ago"
  }
]
```

---

## 5. Model Registry & MLOps Endpoints

### `GET /api/v1/models/registry`
Returns active champion model versions and catalog.

**Response `200 OK`**:
```json
[
  {
    "id": "model-1",
    "name": "Premium Churn Predictor",
    "version": "v1.4.2-prod",
    "status": "Production",
    "accuracy": "0.948",
    "latency": "1.45ms",
    "deployed": "2026-07-20",
    "environment": "Production"
  }
]
```

---

## 6. Operations Center Endpoints

### `GET /api/v1/monitoring/timeline`
Fetches chronological activity stream events.

### `GET /api/v1/monitoring/alerts`
Fetches active and historical platform alerts.
