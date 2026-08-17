import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    width = 1200
    height = 400

    # Create dark obsidian background #090A0F
    img = Image.new('RGBA', (width, height), (9, 10, 15, 255))
    draw = ImageDraw.Draw(img)

    # 1. Ambient Gradient Spotlights
    # Emerald green ambient glow top-right
    spotlight = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    sp_draw = ImageDraw.Draw(spotlight)
    sp_draw.ellipse([700, -100, 1300, 500], fill=(16, 185, 129, 35))
    sp_draw.ellipse([850, 50, 1250, 350], fill=(0, 242, 254, 25))
    sp_draw.ellipse([100, 200, 500, 500], fill=(127, 0, 255, 15))
    spotlight = spotlight.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img, spotlight)
    draw = ImageDraw.Draw(img)

    # 2. Subtle Matrix Grid Overlay
    grid_color = (24, 27, 40, 180)
    for x in range(0, width, 30):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 30):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # Fonts loading with fallbacks
    try:
        font_badge = ImageFont.truetype("arialbd.ttf", 12)
        font_title = ImageFont.truetype("arialbd.ttf", 32)
        font_sub = ImageFont.truetype("arial.ttf", 14)
        font_chip = ImageFont.truetype("arialbd.ttf", 11)
        font_footer = ImageFont.truetype("arial.ttf", 10)
        font_card_title = ImageFont.truetype("arialbd.ttf", 13)
        font_card_sub = ImageFont.truetype("arial.ttf", 11)
    except Exception:
        font_badge = font_title = font_sub = font_chip = font_footer = font_card_title = font_card_sub = ImageFont.load_default()

    # LEFT COLUMN (X: 55 to 640)

    # Pill Badge: [AI • PREDICTIVE ANALYTICS • FULL STACK]
    badge_x, badge_y = 55, 45
    badge_text = "AI  •  PREDICTIVE ANALYTICS  •  FULL STACK"
    badge_w, badge_h = 310, 26

    # Badge background
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=13,
        fill=(16, 185, 129, 30),
        outline=(16, 185, 129, 90),
        width=1
    )
    # Green LED dot
    draw.ellipse([badge_x + 14, badge_y + 9, badge_x + 22, badge_y + 17], fill=(16, 185, 129, 255))
    draw.text((badge_x + 30, badge_y + 6), badge_text, fill=(16, 185, 129, 255), font=font_badge)

    # Main Headline Line 1 & Line 2
    title_line1 = "Spotify Premium"
    title_line2 = "Retention Intelligence Platform"

    draw.text((55, 88), title_line1, fill=(255, 255, 255, 255), font=font_title)
    draw.text((55, 126), title_line2, fill=(226, 232, 240, 255), font=font_title)

    # Subtitle
    sub1 = "AI-powered customer retention analytics and churn prediction platform"
    sub2 = "built with React, FastAPI, Python, and machine learning."
    draw.text((55, 180), sub1, fill=(148, 163, 184, 255), font=font_sub)
    draw.text((55, 200), sub2, fill=(148, 163, 184, 255), font=font_sub)

    # Technology Chips
    chips = ["React", "TypeScript", "Vite", "FastAPI", "Python", "Scikit-Learn", "XGBoost", "Tailwind CSS", "MySQL"]
    chip_x, chip_y = 55, 245
    row_height = 26

    for chip in chips:
        # Measure text
        bbox = draw.textbbox((0, 0), chip, font=font_chip)
        chip_w = (bbox[2] - bbox[0]) + 20
        if chip_x + chip_w > 640:
            chip_x = 55
            chip_y += row_height + 8

        draw.rounded_rectangle(
            [chip_x, chip_y, chip_x + chip_w, chip_y + row_height],
            radius=6,
            fill=(26, 29, 45, 220),
            outline=(255, 255, 255, 35),
            width=1
        )
        draw.text((chip_x + 10, chip_y + 6), chip, fill=(226, 232, 240, 255), font=font_chip)
        chip_x += chip_w + 8

    # RIGHT COLUMN: VISUAL DASHBOARD & GLASS CARDS (X: 680 to 1145)

    # Card 1: Churn Risk & Retention Analytics (Top Card)
    c1_x, c1_y, c1_w, c1_h = 680, 45, 465, 150
    card1 = Image.new('RGBA', (c1_w, c1_h), (18, 19, 28, 220))
    c1_draw = ImageDraw.Draw(card1)

    # Outer border
    c1_draw.rounded_rectangle([0, 0, c1_w-1, c1_h-1], radius=14, fill=None, outline=(255, 255, 255, 25), width=1)

    # Header inside card 1
    c1_draw.ellipse([18, 18, 26, 26], fill=(0, 242, 254, 255))
    c1_draw.text((34, 15), "Churn Risk & Retention Analytics", fill=(255, 255, 255, 255), font=font_card_title)
    c1_draw.text((34, 32), "Real-Time Model Inference & Customer Cohorts", fill=(148, 163, 184, 255), font=font_card_sub)

    # Abstract Wave Chart Line
    points = [(20, 115), (70, 95), (120, 105), (170, 75), (220, 85), (270, 55), (320, 65), (370, 45), (420, 50), (445, 40)]
    for i in range(len(points) - 1):
        c1_draw.line([points[i], points[i+1]], fill=(0, 242, 254, 255), width=3)

    # Draw filled gradient area under wave
    poly_points = points + [(445, 130), (20, 130)]
    c1_draw.polygon(poly_points, fill=(0, 242, 254, 20))

    # Highlight nodes on chart
    for pt in [points[3], points[5], points[7], points[9]]:
        c1_draw.ellipse([pt[0]-4, pt[1]-4, pt[0]+4, pt[1]+4], fill=(16, 185, 129, 255), outline=(255, 255, 255, 255), width=1)

    img.paste(card1, (c1_x, c1_y), card1)

    # Card 2: SHAP Feature Importance (Bottom Card)
    c2_x, c2_y, c2_w, c2_h = 680, 210, 465, 135
    card2 = Image.new('RGBA', (c2_w, c2_h), (18, 19, 28, 220))
    c2_draw = ImageDraw.Draw(card2)

    c2_draw.rounded_rectangle([0, 0, c2_w-1, c2_h-1], radius=14, fill=None, outline=(255, 255, 255, 25), width=1)

    c2_draw.ellipse([18, 18, 26, 26], fill=(127, 0, 255, 255))
    c2_draw.text((34, 15), "Feature Importance (SHAP Explainability)", fill=(255, 255, 255, 255), font=font_card_title)

    # Horizontal feature bars
    features = [
        ("Listening Hours", 0.88, (16, 185, 129)),
        ("Subscription Age", 0.72, (0, 242, 254)),
        ("Completion Rate", 0.64, (127, 0, 255)),
        ("Skip Rate Ratio", 0.45, (16, 185, 129))
    ]

    fy = 42
    for label, val, color in features:
        c2_draw.text((20, fy), label, fill=(148, 163, 184, 255), font=font_card_sub)
        bar_max_w = 260
        bar_w = int(bar_max_w * val)
        c2_draw.rounded_rectangle([150, fy+3, 150 + bar_w, fy+11], radius=4, fill=color + (220,))
        fy += 22

    img.paste(card2, (c2_x, c2_y), card2)

    # SUBTLE FOOTER DISCLAIMER
    footer_text = "Independent Educational Portfolio Project  •  Not affiliated with or endorsed by Spotify"
    draw.text((55, 365), footer_text, fill=(100, 116, 139, 255), font=font_footer)

    # Save asset
    output_dir = os.path.join("assets", "banner")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "hero-banner.png")

    img.save(output_path, "PNG")
    print(f"Successfully generated hero banner at: {output_path}")

if __name__ == "__main__":
    create_banner()
