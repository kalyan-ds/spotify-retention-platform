![Spotify Premium Retention Intelligence Platform](assets/banner/hero-banner.png)

# 🎵 Spotify Premium Retention Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-%3E%3D0.100.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~6.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)

> **AI-powered customer retention analytics and churn prediction platform built with React 19, FastAPI, Python, and machine learning.**

An independent full-stack AI application combining subscriber churn forecasting, behavioral retention analytics, explainable machine learning (TreeSHAP), asynchronous REST APIs, and interactive management dashboards.

> 📋 **Portfolio & Demonstration Context**: The web application, REST API gateway, JWT authentication workflows, machine-learning inference pipelines, database integration, and analytics dashboards are fully implemented in this repository. Business-facing metrics and figures shown in the dashboard screenshots are demonstration/sample analytics for portfolio presentation and do not represent real Spotify users, financial results, or production business outcomes.
> *This is an independent educational portfolio project and is not affiliated with, endorsed by, sponsored by, or officially connected to Spotify AB or Spotify Technology S.A.*

---

## 📌 Project at a Glance

| Domain | Technology / Implementation | Verified Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript (~6.0), Vite 8, Tailwind CSS 4 | Glassmorphic analytics SPA with modular dashboard routes |
| **Backend** | FastAPI, Python 3.11, Pydantic v2, Starlette | High-performance asynchronous REST API gateway & middleware |
| **AI / ML** | XGBoost, Scikit-Learn, TreeSHAP, Joblib | Churn risk scoring, feature attribution, and PSI drift benchmarks |
| **Database** | MySQL 8.0, SQLAlchemy 2.0 (Async Engine), `asyncmy` | Relational persistence for subscriber data, users, and audit events |
| **Security & IAM** | OAuth2 JWT (15m access / 7d refresh), RBAC, Bcrypt | Route protection across Admin, Analyst, and Viewer permissions |
| **API Surface** | OpenAPI 3.1, Swagger UI, ReDoc | Documented interactive REST endpoints and schemas |
| **Analytics** | TanStack Query v5, Recharts, Lucide React | Server state caching, cohort distributions, and risk interventions |

---

## ✅ Implementation vs Demonstration

To ensure technical transparency for engineering evaluators:

| Component | Category | Description |
| :--- | :--- | :--- |
| **Full-Stack Application** | **Real Implementation** | Fully functional React 19 SPA, FastAPI backend REST service, SQLAlchemy ORM, and Pydantic schemas in this repository. |
| **ML Inference Engine** | **Real Implementation** | Real-time classification scoring (`POST /api/v1/ai/predict`), model artifact loading, and TreeSHAP attribution routines. |
| **Security & IAM** | **Real Implementation** | Dual-token JWT rotation, token refresh interceptors, bcrypt hashing, and role-based access route guards. |
| **Persistence & Telemetry** | **Real Implementation** | MySQL schema models, async repository abstraction layer, and correlation-traced audit logging (`CORR-...`). |
| **Dashboard Business Figures** | **Demonstration Data** | Subscriber KPIs, revenue numbers, and churn cohorts in UI screenshots are generated for portfolio demonstration. |
| **Spotify Business Telemetry** | **Simulated Patterns** | Streaming engagement patterns are synthetically modeled for educational analysis and do not represent actual Spotify internal metrics. |

---

## 📖 Table of Contents

- [💡 Why This Project?](#-why-this-project)
- [🎯 What This Project Demonstrates](#-what-this-project-demonstrates)
- [✨ Key Features](#-key-features)
- [📸 Product Showcase](#-product-showcase)
- [🏗️ System Architecture](#️-system-architecture)
- [🧭 Key Engineering Decisions](#-key-engineering-decisions)
- [🔄 Request & Prediction Flow](#-request--prediction-flow)
- [🧠 AI / ML Workflow](#-ai--ml-workflow)
- [🛠️ Technology Stack](#️-technology-stack)
- [📡 API Highlights](#-api-highlights)
- [🛡️ Security & Authentication](#️-security--authentication)
- [🗄️ Data & Persistence](#️-data--persistence)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔑 Environment Configuration](#-environment-configuration)
- [⚠️ Known Limitations](#️-known-limitations)
- [🧪 Verification & Quality](#-verification--quality)
- [📚 Documentation Suite](#-documentation-suite)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [⚠️ Disclaimer](#️-disclaimer)
- [🚀 Explore the Project](#-explore-the-project)
- [👤 Author & Links](#-author--links)

---

## 💡 Why This Project?

**The Problem**: Subscription-based digital media platforms experience subscriber churn driven by complex behavioral signals—including declining listening duration, elevated track skipping rates, low playlist creation, and payment friction. Identifying at-risk accounts early is critical for proactive retention.

**The Challenge**: Machine learning models often remain trapped in exploratory data science notebooks, isolated from actual product workflows. Bridging the gap between a trained classification algorithm and an interactive business tool requires robust application engineering: RESTful API design, schema validation, state management, asynchronous data caching, authentication, and explainable AI visualizations.

**The Engineering Approach**: This project solves that integration challenge by building a layered full-stack platform:
1. **Data & ML**: Feature preprocessing pipelines and classification models (XGBoost, Random Forest, Logistic Regression) evaluated on subscriber engagement metrics with TreeSHAP feature attributions.
2. **Backend Services**: High-performance FastAPI service exposing asynchronous endpoints for real-time inference, model catalog metadata, drift metrics, and authentication.
3. **Frontend Application**: React 19 SPA built with TypeScript, Tailwind CSS v4, and TanStack Query v5, providing modular dashboards for executive decision-makers, retention specialists, and ML engineers.

**The Result**: An end-to-end, locally reproducible retention platform demonstrating how machine learning intelligence is served, secured, and visualized in modern web applications.

---

## 🎯 What This Project Demonstrates

For engineering hiring managers, technical recruiters, and system design evaluators, this repository demonstrates competency across key software engineering domains:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FULL-STACK SKILLS MATRIX                               │
├──────────────────┬──────────────────────────────────────────────────────────────┤
│ Frontend         │ React 19, TypeScript (~6.0), Vite 8, Tailwind CSS 4,         │
│ Architecture     │ TanStack Query v5, Zustand, Lucide Icons, Glassmorphism UI   │
├──────────────────┼──────────────────────────────────────────────────────────────┤
│ Backend & API    │ FastAPI, Python 3.11, Pydantic v2 validation, Starlette      │
│ Engineering      │ Middleware, Async/Await concurrency, Dependency Injection    │
├──────────────────┼──────────────────────────────────────────────────────────────┤
│ Machine Learning │ XGBoost, Scikit-Learn, TreeSHAP explainability, feature      │
│ & Applied AI     │ engineering pipelines, PSI drift monitoring, Joblib serialization│
├──────────────────┼──────────────────────────────────────────────────────────────┤
│ Security & IAM   │ Dual-token OAuth2 JWT rotation (15m access / 7d refresh),    │
│                  │ Route-level RBAC (Admin/Analyst/Viewer), Bcrypt hashing      │
├──────────────────┼──────────────────────────────────────────────────────────────┤
│ Data Layer       │ MySQL 8.0, SQLAlchemy 2.0 Async ORM, asyncmy driver,         │
│                  │ Connection pooling, Repository pattern, Pydantic schemas     │
├──────────────────┼──────────────────────────────────────────────────────────────┤
│ Observability    │ Correlation-traced audit logging (CORR-...), client error    │
│ & Quality        │ boundaries, structured health probes, validated TypeScript build│
└──────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🤖 Applied AI & Machine Learning
- **Real-Time Churn Scoring**: Scoring endpoints predicting churn probability using trained classification models.
- **TreeSHAP Explainability**: Decomposes individual predictions into key positive and negative feature attribution drivers.
- **Feature Engineering Pipeline**: Processes behavioral signals including `listening_hours`, `completion_rate`, `skip_rate`, `active_days`, `is_premium`, and `subscription_age_days`.
- **Model Catalog & Health Monitoring**: Tracks registered model versions, validation performance metrics, and feature drift benchmarks (Population Stability Index).

### 📊 Business Intelligence & Dashboards
- **AI Command Center**: Central operational dashboard tracking active alerts, subscriber risk tiers, and model registry status.
- **Executive Retention Overview**: High-level cohort analysis displaying churn risk distributions and subscriber engagement trends.
- **Next Best Actions (NBA)**: Prescriptive intervention engine recommending targeted retention workflows for elevated-risk subscriber segments.
- **Interactive Visualizations**: Dynamic charts and telemetry widgets powered by Recharts and Lucide icons.

### 🛡️ Authentication & Authorization
- **Dual-Token JWT Flow**: Implements `/login`, `/refresh`, and `/logout` API endpoints handling 15-minute access tokens and 7-day refresh tokens.
- **Role-Based Access Control (RBAC)**: Route protection wrappers restricting permissions across `Admin`, `Analyst`, and `Viewer` roles.
- **Audit Logging**: Structured JSON logging pipeline capturing security and operational events with correlation tracing.

### ⚡ Developer Experience & Engineering
- **Strict Type Safety**: End-to-end TypeScript interfaces on frontend components and Pydantic validation schemas on backend endpoints.
- **Client Cache Synchronization**: Multi-layer state caching and query deduplication powered by TanStack Query v5.
- **Error Boundaries & Middleware**: Starlette HTTP exception handlers and React Error Boundary fallback components.

---

## 📸 Product Showcase

> *All business dashboards shown below use demonstration/sample analytics for portfolio presentation. They do not represent real Spotify users, financial results, or production business outcomes.*

### 1. AI Command Center
<div align="center">
  <img src="assets/screenshots/01-ai-command-center.png" alt="AI Command Center" width="100%">
  <p><em>Central operational dashboard tracking subscriber risk indicators, model registry status, and platform telemetry.</em></p>
</div>

<br>

<table>
  <tr>
    <td width="50%">
      <h3 align="center">2. Executive Retention Overview</h3>
      <img src="assets/screenshots/02-executive-dashboard.png" alt="Executive Retention Overview" width="100%">
      <p align="center"><em>Executive-facing retention, churn-risk, and business analytics overview.</em></p>
    </td>
    <td width="50%">
      <h3 align="center">3. Predictions & Explainability</h3>
      <img src="assets/screenshots/03-predictions.png" alt="Predictions and Explainability" width="100%">
      <p align="center"><em>Churn prediction, SHAP feature explanations, and prescriptive recommendations.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">4. Retention Analytics</h3>
      <img src="assets/screenshots/04-retention-analytics.png" alt="Retention Analytics" width="100%">
      <p align="center"><em>Trend, confidence, segmentation, and prediction-category analytics.</em></p>
    </td>
    <td width="50%">
      <h3 align="center">5. Next Best Actions</h3>
      <img src="assets/screenshots/05-next-best-actions.png" alt="Next Best Actions" width="100%">
      <p align="center"><em>Recommendation prioritization, intervention categories, and action queues.</em></p>
    </td>
  </tr>
</table>

<br>

### 6. Model Registry & Monitoring
<div align="center">
  <img src="assets/screenshots/06-model-registry-monitoring.png" alt="Model Registry and Monitoring" width="100%">
  <p><em>Model catalog, evaluation metrics, lifecycle state, inference monitoring, and Population Stability Index (PSI) drift benchmarks.</em></p>
</div>

<br>

<table>
  <tr>
    <td width="50%">
      <h3 align="center">7. Interactive REST API (Swagger UI)</h3>
      <img src="assets/screenshots/07-swagger.png" alt="FastAPI Swagger UI" width="100%">
      <p align="center"><em>FastAPI Swagger UI exposing the verified REST API endpoints and schema documentation.</em></p>
    </td>
    <td width="50%">
      <h3 align="center">8. AI Health & Subsystem Probes</h3>
      <img src="assets/screenshots/08-ai-health.png" alt="AI Health Endpoint" width="100%">
      <p align="center"><em>Live AI health endpoint returning current inference subsystem status.</em></p>
    </td>
  </tr>
</table>

---

## 🏗️ System Architecture

The platform implements a **layered full-stack architecture** separating client-side presentation, asynchronous API routing, machine learning inference services, and relational persistence.

![Spotify Retention Platform System Architecture](assets/architecture/system-architecture.png)

### Key Architectural Layers:
1. **Client Layer (React 19 + TypeScript)**: Single-page application consuming REST APIs through Axios interceptors with automatic JWT refresh. Client state is managed via TanStack Query v5 for asynchronous server data and Zustand for UI state.
2. **API Gateway Layer (FastAPI + Python 3.11)**: Asynchronous REST service handling CORS, request validation (Pydantic v2), dual-token authentication, and role authorization.
3. **Intelligence & ML Layer**: Serves model predictions from serialized artifacts (`models/`, `backend/app/ml/models/`) and computes TreeSHAP feature attributions and PSI drift benchmarks.
4. **Persistence Layer (MySQL 8.0 + SQLAlchemy Async)**: Relational storage for subscriber records, user accounts, audit telemetry logs, and registered model metadata.

> *Mermaid source topology is maintained in [`assets/architecture/system-architecture.mmd`](assets/architecture/system-architecture.mmd).*

---

## 🧭 Key Engineering Decisions

The platform architecture reflects deliberate engineering trade-offs documented in Architecture Decision Records ([`docs/adr/`](docs/adr/)):

1. **Decoupled React 19 SPA + FastAPI Backend ([ADR-004](docs/adr/ADR-004-FastAPI.md))**:
   - *Rationale*: Separates high-frequency interactive dashboard rendering from asynchronous machine-learning inference and database operations.
   - *Benefit*: Independent scalability, clean separation of concerns, and full TypeScript/Python type safety across layers.

2. **Dual-Token JWT Rotation & Route-Level RBAC ([ADR-001](docs/adr/ADR-001-JWT-Authentication.md), [ADR-002](docs/adr/ADR-002-RBAC.md))**:
   - *Rationale*: Short-lived access tokens (15 minutes) reduce credential exposure, while 7-day refresh tokens allow seamless automated rotation via Axios interceptors.
   - *Benefit*: Stateless horizontal scalability with strict route access guards enforcing `Admin`, `Analyst`, and `Viewer` role permissions.

3. **TanStack Query v5 for Asynchronous Server State ([ADR-003](docs/adr/ADR-003-React-Query.md))**:
   - *Rationale*: Replaces ad-hoc `useEffect` data fetching with automatic query caching, request deduplication, and background invalidation.
   - *Benefit*: Drastically reduces redundant network calls and guarantees instant UI rendering from cache.

4. **XGBoost Classifier + TreeSHAP for Explainable Churn Scoring**:
   - *Rationale*: Gradient-boosted decision trees deliver superior performance on tabular engagement features while TreeSHAP provides fast, exact local Shapley attributions.
   - *Benefit*: Transforms opaque risk probabilities into actionable, interpretable feature attributions visible directly in the UI.

5. **SQLAlchemy 2.0 Async Engine + Repository Pattern**:
   - *Rationale*: Abstracting database queries into repository classes decouples database operations from FastAPI endpoint routers.
   - *Benefit*: High-throughput non-blocking I/O using the `asyncmy` driver with connection pooling and clean unit-testing abstractions.

6. **Correlation-Traced Audit Telemetry ([ADR-005](docs/adr/ADR-005-Audit-Logging.md))**:
   - *Rationale*: Starlette middleware automatically generates or propagates a unique correlation ID (`CORR-...`) on every request.
   - *Benefit*: Seamless distributed observability linking client interactions, backend logs, and security audit records.

---

## 🔄 Request & Prediction Flow

```
[ User Interaction in React 19 UI ]
                │
                ▼
[ Axios Client Interceptor (Attaches JWT & Correlation ID) ]
                │
                ▼
[ FastAPI Gateway Router ] ───► [ Pydantic Schema Validation ]
                │                         │
                ▼                         ▼
[ JWT Auth & RBAC Dependency ]    [ Starlette Logging Middleware ]
                │
                ▼
[ AI Inference Service (backend/app/ai/) ]
        │                       │
        ├──► [ Model Artifact Loading (Joblib / PKL) ]
        │                       │
        └──► [ TreeSHAP Feature Attribution Computation ]
                │
                ▼
[ SQLAlchemy Async Engine ──► MySQL Persistence (Telemetry / Records) ]
                │
                ▼
[ JSON Response Payload ] ──► [ TanStack Query Cache Sync ] ──► [ UI Render ]
```

---

## 🧠 AI / ML Workflow

The machine learning workflow separates **offline training and evaluation** from **real-time application inference**:

```
[ Synthetic Subscriber Engagement Dataset ]
                     │
                     ▼
[ Feature Engineering (listening_hours, completion_rate, skip_rate, active_days) ]
                     │
                     ▼
[ Model Training & Tuning (XGBoost Classifier, Random Forest, Logistic Regression) ]
                     │
                     ▼
[ Model Evaluation (ROC-AUC, Precision-Recall, F1) & Artifact Serialization ]
                     │
                     ▼
[ Serialized Model Files: models/churn_model.pkl & backend/app/ml/models/ ]
                     │
                     ▼
[ FastAPI Real-Time Scoring Router: POST /api/v1/ai/predict ]
                     │
                     ▼
[ React 19 Dashboard Visualization & TreeSHAP Feature Explanations ]
```

- **Libraries**: `pandas`, `numpy`, `scikit-learn`, `xgboost`, `shap`, `joblib`.
- **Model Features**: `listening_hours`, `completion_rate`, `skip_rate`, `active_days`, `is_premium`, `subscription_age_days`.
- **Target Variable**: `is_churned` (1 = Canceled/Past-Due, 0 = Active).
- **Artifact Locations**: Serialized model artifacts are stored in `models/` (`churn_model.pkl`, `scaler.pkl`) and `backend/app/ml/models/`.

---

## 🛠️ Technology Stack

| Layer | Technology | Declared Version / Requirement | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React | `^19.2.7` | User interface component library |
| **Frontend Language** | TypeScript | `~6.0.2` | Type-safe application logic |
| **Build Tool** | Vite | `^8.1.0` | Development server and asset bundler |
| **Styling** | Tailwind CSS | `^4.3.1` | Utility-first CSS styling framework |
| **Data Fetching** | TanStack Query | `^5.101.2` | Asynchronous state management and client caching |
| **HTTP Client** | Axios | `^1.18.1` | REST API communication with interceptors |
| **Icons & Charts** | Lucide React / Recharts | `^1.16.0` / `^2.15.1` | UI icons and responsive data visualization |
| **Backend Gateway** | FastAPI | `>=0.100.0` | Asynchronous REST API framework |
| **ASGI Server** | Uvicorn | `>=0.22.0` | High-performance asynchronous ASGI web server |
| **Backend Language** | Python | `3.11` | Backend application runtime |
| **Validation** | Pydantic | `>=2.0` | API request and response data validation schemas |
| **Database ORM** | SQLAlchemy | `>=2.0` | Asynchronous relational ORM |
| **Database Engine** | MySQL | `asyncmy` driver | Persistent relational database storage |
| **Machine Learning** | XGBoost / Scikit-Learn | `>=1.7.0` / `>=1.2.0` | Classification model training and inference |
| **Explainability** | SHAP | `>=0.41.0` | TreeSHAP feature attribution analysis |

---

## 📡 API Highlights

The FastAPI backend exposes a structured REST API surface documented via OpenAPI:

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **System Health** | `GET` | `/api/v1/health` | System availability and database connection status | No |
| **AI Telemetry** | `GET` | `/api/v1/ai/health` | AI inference engine status and model availability | No |
| **ML Inference** | `POST` | `/api/v1/ai/predict` | Real-time subscriber churn risk scoring and SHAP feature drivers | Yes |
| **Model Registry** | `GET` | `/api/v1/ai/models` | Active model catalog, versions, and validation metrics | Yes |
| **Drift Analytics** | `GET` | `/api/v1/ai/drift` | Population Stability Index (PSI) feature drift metrics | Yes |
| **Interventions** | `GET` | `/api/v1/ai/recommendations/{user_id}` | Prescriptive Next Best Action recommendations | Yes |
| **Authentication** | `POST` | `/api/v1/auth/login` | OAuth2 password login issuing access and refresh JWTs | No |
| **Token Refresh** | `POST` | `/api/v1/auth/refresh` | Rotates access token using valid refresh token | No |
| **Authentication** | `POST` | `/api/v1/auth/logout` | Revokes active session tokens | Yes |
| **Retention** | `GET` | `/api/v1/retention/summary` | Aggregated retention KPIs and subscriber risk cohorts | Yes |

---

## 🛡️ Security & Authentication

- **Dual-Token JWT Security**: Implements short-lived access tokens (15 minutes) and long-lived refresh tokens (7 days) using standard HS256 JWT signatures.
- **Automated Token Rotation**: Axios interceptors automatically detect expired access tokens and execute seamless refresh calls via `/api/v1/auth/refresh`.
- **Role-Based Access Control (RBAC)**: Route protection wrappers enforce permissions across `Admin`, `Analyst`, and `Viewer` roles.
- **Password Hashing**: Secure password storage utilizing `bcrypt` algorithms.
- **Correlation Audit Telemetry**: Every API interaction is stamped with a unique correlation identifier (`CORR-...`) for end-to-end request tracing.

---

## 🗄️ Data & Persistence

- **Relational Persistence**: Persistent data storage using MySQL with async engine connectivity via `asyncmy` and `SQLAlchemy 2.0`.
- **Data Abstraction**: Implements the Repository pattern (`backend/app/repositories/`) separating business logic from raw SQL/ORM queries.
- **Pydantic Validation**: All incoming requests and outgoing payloads are strictly validated against Pydantic v2 schemas.
- **Synthetic Dataset**: Utilizes synthetic subscriber engagement records modeling realistic streaming patterns (`listening_hours`, `skip_rate`, `completion_rate`, `device_type`) without containing any real PII or Spotify proprietary data.

---

## 📁 Project Structure

```
spotify-retention-platform/
├── assets/                          # Branding, architecture, and screenshot assets
│   ├── architecture/                # System architecture PNG and Mermaid source
│   ├── banner/                      # GitHub hero banner asset
│   └── screenshots/                 # Verified product showcase screenshots (01 to 08)
├── backend/                         # FastAPI backend application service
│   ├── app/                         # Backend application package
│   │   ├── ai/                      # AI models, feature store, and inference endpoints
│   │   ├── api/                     # REST routers and dependency injection
│   │   ├── core/                    # Configuration, security, and logging
│   │   ├── database/                # SQLAlchemy session creation and async engine
│   │   ├── middleware/              # CORS, logging, and security middleware
│   │   ├── ml/                      # ML pipeline, feature extraction, and models
│   │   ├── models/                  # SQLAlchemy relational models
│   │   ├── repositories/            # Data access abstraction layer
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   └── services/                # Business logic services
│   ├── .env.example                 # Backend environment variable template
│   ├── main.py                      # FastAPI application entry point
│   └── requirements.txt             # Backend Python dependencies
├── docs/                            # Documentation suite
│   ├── adr/                         # Architecture Decision Records (ADR-001 to ADR-006)
│   ├── api/                         # REST API specification
│   ├── architecture/                # Architecture documentation
│   ├── developer/                   # Developer guide and local setup
│   ├── operations/                  # Maintenance runbooks and health probe specs
│   ├── deployment/                  # Deployment configuration guides
│   └── INDEX.md                     # Master documentation hub
├── frontend/                        # React 19 + TypeScript single-page application
│   ├── src/                         # Frontend source code
│   │   ├── app/                     # Layout wrappers (EnterpriseLayout)
│   │   ├── components/              # Reusable UI components & route guards
│   │   ├── config/                  # Centralized route and navigation mapping
│   │   ├── pages/                   # Dashboard pages and views
│   │   ├── providers/               # Context providers (Auth, Query, App)
│   │   ├── services/                # Axios instance & auth REST calls
│   │   ├── types/                   # TypeScript interface declarations
│   │   └── utils/                   # Security, session, and audit helpers
│   ├── .env.example                 # Local frontend environment template
│   ├── package.json                 # Frontend dependencies and scripts
│   └── vite.config.ts               # Vite bundler configuration
├── ml/                              # Experimental ML training & preprocessing scripts
├── models/                          # Serialized model artifacts (churn_model.pkl)
├── scripts/                         # Database seeding and asset generation scripts
├── CONTRIBUTING.md                  # Open-source contribution guidelines
├── LICENSE                          # Apache 2.0 License
├── README.md                        # Master project documentation
└── ROADMAP.md                       # Product release roadmap
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.x or higher
- **Python**: v3.11
- **npm**: v10.x or higher
- **MySQL Database Server**: v8.0 or compatible database service

### 1. Repository Clone
```bash
git clone https://github.com/kalyan-ds/spotify-retention-platform.git
cd spotify-retention-platform
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv

# Windows (PowerShell):
venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create environment configuration file from template
cp .env.example .env

# Start FastAPI server via Uvicorn
uvicorn main:app --reload --port 8000
```
*The FastAPI application will start at `http://127.0.0.1:8000`.*

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Create environment configuration file from template
cp .env.example .env

# Start Vite development server
npm run dev
```
*The React application will start at `http://localhost:5173`.*

---

## 🔑 Environment Configuration

Refer to the environment template files for configuration settings:

- **Backend Settings**: See [`backend/.env.example`](backend/.env.example) for `PROJECT_NAME`, `API_V1_STR`, `MYSQL_SERVER`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`, `MYSQL_PORT`, `SECRET_KEY`, and `JWT_ALGORITHM`.
- **Frontend Development Settings**: See [`frontend/.env.example`](frontend/.env.example) for `VITE_API_BASE_URL`, `VITE_ENABLE_AUDIT_LOGGING`, and `VITE_SESSION_IDLE_TIMEOUT`.
- **Frontend Production Settings**: See [`frontend/.env.production.example`](frontend/.env.production.example).

> *Note: Never commit secret keys, passwords, or production API tokens to version control.*

---

## ⚠️ Known Limitations

To maintain strict factual accuracy, the following boundaries and scope limitations apply:

- **Demonstration Analytics**: Business KPI numbers, financial metrics, and executive summaries shown in dashboard screenshots use synthetic demonstration data for portfolio evaluation.
- **Local Verification Scope**: The application is tested and verified locally; no multi-tenant public cloud deployment or live SLA is currently claimed.
- **Simulated Behavioral Signals**: Subscriber streaming patterns (`listening_hours`, `skip_rate`, `completion_rate`) are synthetically modeled for educational research and do not represent proprietary Spotify data.
- **Offline Model Generalization**: In a live enterprise environment, production deployment would incorporate continuous online feature stores and automated feedback loops.

---

## 🧪 Verification & Quality

The codebase has undergone local verification:

- **Frontend Compilation**: Production build verified via `npm run build` (`tsc -b && vite build`) with zero TypeScript errors.
- **Backend Schema Validation**: Pydantic schemas verified against OpenAPI 3.1.0 specifications.
- **Interactive Documentation**: Swagger UI and ReDoc live documentation verified locally.
- **Subsystem Health Probes**: Verified live `/api/v1/health` and `/api/v1/ai/health` probe endpoints.

---

## 📚 Documentation Suite

Technical specifications and decision records are maintained in `docs/`:

| Document | Path | Description |
| :--- | :--- | :--- |
| **Documentation Index** | [`docs/INDEX.md`](docs/INDEX.md) | Navigation hub for all project documentation |
| **Architecture Overview** | [`docs/architecture/ArchitectureOverview.md`](docs/architecture/ArchitectureOverview.md) | System topology and component flowcharts |
| **API Specification** | [`docs/api/APIDocumentation.md`](docs/api/APIDocumentation.md) | Endpoint specifications for authentication and telemetry |
| **Developer Guide** | [`docs/developer/DeveloperGuide.md`](docs/developer/DeveloperGuide.md) | Local environment setup and folder structure guide |
| **Operations Runbook** | [`docs/operations/OperationsRunbook.md`](docs/operations/OperationsRunbook.md) | Maintenance runbooks and health probe details |
| **Deployment Guide** | [`docs/deployment/DeploymentGuide.md`](docs/deployment/DeploymentGuide.md) | Deployment steps and environment configuration instructions |
| **ADR Index** | [`docs/adr/`](docs/adr/) | Architecture Decision Records (ADR-001 through ADR-006) |

---

## 🗺️ Roadmap

Refer to [`ROADMAP.md`](ROADMAP.md) for the active release roadmap:

- [x] **Version 2.0 (Current Release)**: IAM Authentication, JWT Rotation, RBAC Route Guards, Session Manager, Audit Telemetry, and Full Dashboard Suite.
- [ ] **Version 2.1**: Multi-Factor Authentication (MFA / TOTP) extension and external telemetry sink stream integration.
- [ ] **Version 2.2**: WebAuthn Passkey biometric integration support.

---

## 🤝 Contributing

Contributions, feedback, and issue reports are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines on code formatting and pull request submissions.

---

## 📄 License

This project is licensed under the terms of the **Apache License 2.0**. See the [`LICENSE`](LICENSE) file for details.

---

## ⚠️ Disclaimer

This is an independent educational portfolio project and is not affiliated with, endorsed by, sponsored by, or officially connected to Spotify AB, Spotify Technology S.A., or any of their subsidiaries or affiliates. All brand names and trademarks belong to their respective owners.

---

## 🚀 Explore the Project

- 📖 **Documentation Hub**: [Master Documentation Index](docs/INDEX.md)
- 🏗️ **System Architecture**: [Architecture Overview & Topologies](docs/architecture/ArchitectureOverview.md)
- 📡 **API Specification**: [FastAPI REST API Documentation](docs/api/APIDocumentation.md)
- 🧠 **AI / ML Workflow**: [Machine Learning Pipeline Details](#-ai--ml-workflow)
- 🗺️ **Product Roadmap**: [Release Roadmap & Milestones](ROADMAP.md)
- 💻 **Source Code**: [GitHub Repository](https://github.com/kalyan-ds/spotify-retention-platform)

---

## 👤 Author & Links

- **Author**: Kalyan
- **GitHub**: [@kalyan-ds](https://github.com/kalyan-ds)
- **Repository**: [spotify-retention-platform](https://github.com/kalyan-ds/spotify-retention-platform)
- **Documentation**: [Master Documentation Index](docs/INDEX.md)
- **System Architecture**: [Architecture Specification](docs/architecture/ArchitectureOverview.md)
