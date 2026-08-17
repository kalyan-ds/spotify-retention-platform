import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_architecture_diagram():
    width = 1600
    height = 1000

    # 1. Dark Obsidian Background #090A0F
    img = Image.new('RGBA', (width, height), (9, 10, 15, 255))
    draw = ImageDraw.Draw(img)

    # Ambient Light Spotlights (Glow effects)
    spotlight = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    sp_draw = ImageDraw.Draw(spotlight)
    sp_draw.ellipse([100, -100, 700, 500], fill=(0, 242, 254, 18))    # Cyan top-left
    sp_draw.ellipse([900, 100, 1500, 700], fill=(127, 0, 255, 18))   # Indigo center-right
    sp_draw.ellipse([400, 600, 1200, 1100], fill=(16, 185, 129, 18)) # Emerald bottom
    spotlight = spotlight.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, spotlight)
    draw = ImageDraw.Draw(img)

    # Subtle Matrix Grid Lines
    grid_color = (24, 27, 40, 160)
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # Font setup
    try:
        font_header = ImageFont.truetype("arialbd.ttf", 26)
        font_sub = ImageFont.truetype("arial.ttf", 13)
        font_layer_title = ImageFont.truetype("arialbd.ttf", 15)
        font_node_title = ImageFont.truetype("arialbd.ttf", 13)
        font_node_desc = ImageFont.truetype("arial.ttf", 11)
        font_label = ImageFont.truetype("arialbd.ttf", 11)
        font_legend = ImageFont.truetype("arial.ttf", 11)
    except Exception:
        font_header = font_sub = font_layer_title = font_node_title = font_node_desc = font_label = font_legend = ImageFont.load_default()

    # HEADER BAR (Top Margin 40px)
    draw.text((60, 35), "Spotify Premium Retention Intelligence Platform", fill=(255, 255, 255, 255), font=font_header)
    draw.text((60, 70), "Enterprise System Architecture  •  Layered Decoupled Topology  •  Fact-Verified Specification", fill=(148, 163, 184, 255), font=font_sub)
    draw.line([(60, 95), (width - 60, 95)], fill=(38, 41, 59, 255), width=1)

    # LAYERS COMPUTATION
    # Container Helper
    def draw_container(box, title, accent_color, badge_text=""):
        x1, y1, x2, y2 = box
        # Card body fill
        draw.rounded_rectangle([x1, y1, x2, y2], radius=12, fill=(18, 19, 28, 220), outline=(38, 41, 59, 255), width=1)
        # Header banner fill
        draw.rounded_rectangle([x1, y1, x2, y1 + 32], radius=12, fill=(26, 29, 45, 240), outline=None)
        draw.rectangle([x1, y1 + 16, x2, y1 + 32], fill=(26, 29, 45, 240))
        # Top color strip
        draw.rounded_rectangle([x1, y1, x2, y1 + 3], radius=1, fill=accent_color)
        # Title text
        draw.text((x1 + 16, y1 + 8), title.upper(), fill=accent_color, font=font_layer_title)
        if badge_text:
            bbox = draw.textbbox((0, 0), badge_text, font=font_legend)
            bw = (bbox[2] - bbox[0]) + 14
            draw.rounded_rectangle([x2 - bw - 12, y1 + 6, x2 - 12, y1 + 24], radius=4, fill=(38, 41, 59, 200))
            draw.text((x2 - bw - 5, y1 + 8), badge_text, fill=(226, 232, 240, 255), font=font_legend)

    def draw_node(box, title, desc="", border_color=(0, 242, 254)):
        x1, y1, x2, y2 = box
        draw.rounded_rectangle([x1, y1, x2, y2], radius=8, fill=(26, 29, 45, 230), outline=border_color + (180,), width=1)
        draw.text((x1 + 12, y1 + 10), title, fill=(255, 255, 255, 255), font=font_node_title)
        if desc:
            draw.text((x1 + 12, y1 + 28), desc, fill=(148, 163, 184, 255), font=font_node_desc)

    # 1. CLIENT LAYER (Y: 115 to 195)
    draw_container([60, 115, 1540, 195], "1. User & Client Layer", (0, 242, 254), "HTTP / Client Browser")
    draw_node([80, 140, 520, 185], "👥 Business Executive / Analyst", "Strategic Retention & LTV Risk Viewers", (0, 242, 254))
    draw_node([540, 140, 1020, 185], "🤖 AI / MLOps Operator", "Model Health & Drift Alert Auditors", (0, 242, 254))
    draw_node([1040, 140, 1520, 185], "🛡️ Administrator & Security Auditor", "Correlation Audit Telemetry & Governance", (0, 242, 254))

    # 2. FRONTEND SPA LAYER (Y: 220 to 395)
    draw_container([60, 220, 1540, 395], "2. Frontend Application Layer (React 19 + TypeScript 5 + Vite)", (0, 242, 254), "SPA Client Engine")
    draw_node([80, 260, 350, 310], "AuthProvider & Context", "JWT Token Storage & Mutex", (0, 242, 254))
    draw_node([370, 260, 640, 310], "ProtectedRoute Guards", "RBAC Role Access Checks", (0, 242, 254))
    draw_node([660, 260, 940, 310], "TanStack Query v5", "Client State & 60s Cache", (0, 242, 254))
    draw_node([960, 260, 1240, 310], "Axios HTTP Client", "JWT Authorization Headers", (0, 242, 254))
    draw_node([1260, 260, 1520, 310], "SessionManager", "Cross-Tab BroadcastChannel", (0, 242, 254))

    draw_node([80, 325, 520, 380], "Dashboard Pages (/dashboard, /executive)", "AI Command Center & Retention Metrics", (0, 242, 254))
    draw_node([540, 325, 1020, 380], "Analytics Views (/predictions, /audit)", "Risk Explanations & Telemetry Inspector", (0, 242, 254))
    draw_node([1040, 325, 1520, 380], "Governance Views (/security, /release)", "OWASP Compliance & Gate Validation", (0, 242, 254))

    # 3. BACKEND API GATEWAY (Y: 420 to 570)
    draw_container([60, 420, 1540, 570], "3. Backend API Gateway Layer (FastAPI + Python 3.11)", (127, 0, 255), "ASGI REST Gateway")
    draw_node([80, 460, 420, 510], "Security & CORS Middleware", "Headers & Trusted Origins", (127, 0, 255))
    draw_node([440, 460, 780, 510], "RequestLogging & Correlation Middleware", "JSON Telemetry Stream (CORR-...)", (127, 0, 255))
    draw_node([800, 460, 1140, 510], "OAuth2 & JWT Authentication Service", "15-min Access / 7-day Refresh", (127, 0, 255))
    draw_node([1160, 460, 1520, 510], "Pydantic Schema Validation", "Request & Response Verification", (127, 0, 255))

    draw_node([80, 520, 520, 558], "Core Routers (/api/v1/auth, /api/v1/predictions)", "Authentication & Risk Endpoint Group", (127, 0, 255))
    draw_node([540, 520, 1020, 558], "Analytics Routers (/api/v1/analytics, /retention)", "Cohort & Revenue Risk Group", (127, 0, 255))
    draw_node([1040, 520, 1520, 558], "AI Routers (/api/v1/ai, /api/v1/dashboard)", "Model Inference Router Group", (127, 0, 255))

    # 4. BUSINESS LOGIC & AI/ML LAYER (Y: 595 to 795)
    draw_container([60, 595, 1540, 795], "4. Business Logic & MLOps Engine", (16, 185, 129), "Core Domain & Intelligence")

    # Sub-box 4A: Application Inference (Real-Time Service)
    draw.rounded_rectangle([80, 635, 790, 780], radius=8, fill=(20, 22, 34, 200), outline=(16, 185, 129, 120), width=1)
    draw.text((95, 642), "APPLICATION INFERENCE COMPONENTS (REAL-TIME SERVICE)", fill=(16, 185, 129, 255), font=font_legend)
    draw_node([95, 665, 420, 715], "FastAPI Prediction Endpoint", "Inference Request Handler", (16, 185, 129))
    draw_node([440, 665, 775, 715], "SHAP Feature Explainer", "Model Feature Importance", (16, 185, 129))
    draw_node([95, 725, 775, 770], "Serialized Model Artifacts (app/ml/models/*.joblib & models/churn_model.pkl)", "XGBoost, Random Forest & Scaler Weights", (16, 185, 129))

    # Sub-box 4B: Offline Training Pipeline
    draw.rounded_rectangle([810, 635, 1520, 780], radius=8, fill=(20, 22, 34, 200), outline=(148, 163, 184, 100), width=1)
    draw.text((825, 642), "TRAINING & OFFLINE PIPELINE COMPONENTS", fill=(148, 163, 184, 255), font=font_legend)
    draw_node([825, 665, 1155, 715], "Feature Extraction & Scaling", "listening_hours, skip_rate, etc.", (148, 163, 184))
    draw_node([1175, 665, 1505, 715], "Model Training Engine", "Scikit-Learn & XGBoost fit()", (148, 163, 184))
    draw_node([825, 725, 1505, 770], "DB Model Registry (ModelVersion)", "Version Tracker & Metadata Logging", (148, 163, 184))

    # 5. PERSISTENCE LAYER (Y: 820 to 910)
    draw_container([60, 820, 1540, 910], "5. Persistence Layer (MySQL Database)", (16, 185, 129), "Relational Database Engine")
    draw_node([80, 855, 420, 898], "SQLAlchemy Async Engine", "mysql+asyncmy Connection Pool", (16, 185, 129))
    draw_node([440, 855, 820, 898], "Users & Subscriptions Tables", "User Accounts, Roles & Statuses", (16, 185, 129))
    draw_node([840, 855, 1180, 898], "Listening History & Sessions Tables", "Playback Telemetry & Skip Aggregations", (16, 185, 129))
    draw_node([1200, 855, 1520, 898], "Audit Logs & Model Versions", "Correlation Tracing & Model Metadata", (16, 185, 129))

    # LEGEND & FOOTER BAR (Y: 930 to 975)
    draw.rounded_rectangle([60, 930, 1540, 975], radius=8, fill=(18, 19, 28, 240), outline=(38, 41, 59, 255), width=1)
    draw.text((80, 946), "LEGEND:", fill=(255, 255, 255, 255), font=font_legend)

    # Legend color pills
    draw.rounded_rectangle([140, 944, 260, 962], radius=4, fill=(0, 242, 254, 40), outline=(0, 242, 254, 200))
    draw.text((150, 946), "Frontend / Client", fill=(0, 242, 254, 255), font=font_legend)

    draw.rounded_rectangle([275, 944, 410, 962], radius=4, fill=(127, 0, 255, 40), outline=(127, 0, 255, 200))
    draw.text((285, 946), "Backend Gateway", fill=(127, 0, 255, 255), font=font_legend)

    draw.rounded_rectangle([425, 944, 570, 962], radius=4, fill=(16, 185, 129, 40), outline=(16, 185, 129, 200))
    draw.text((435, 946), "AI / ML & Persistence", fill=(16, 185, 129, 255), font=font_legend)

    draw.text((950, 946), "Independent Educational Portfolio Project  •  Not affiliated with Spotify", fill=(100, 116, 139, 255), font=font_legend)

    # Save output PNG image
    out_dir = os.path.join("assets", "architecture")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "system-architecture.png")

    img.save(out_path, "PNG")
    print(f"Successfully generated architecture diagram PNG at: {out_path}")

if __name__ == "__main__":
    create_architecture_diagram()
