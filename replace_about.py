import sys

with open('d:/New folder/DATA SCIENCE/7musclefitness7/about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add luxury.css
if 'luxury.css' not in content:
    content = content.replace(
        '<link rel="stylesheet" href="css/loader.css?v=20260519a">',
        '<link rel="stylesheet" href="css/loader.css?v=20260519a">\n  <link rel="stylesheet" href="css/luxury.css?v=1">'
    )

# Urgency bar
content = content.replace(
    '⚡ Limited Slots Available This Month — <a href="booking.html#book-trial" style="color:#fff;text-decoration:underline;font-weight:700">Book Your Free Trial Now →</a>',
    'Elevate Your Fitness. 2024 Premium Memberships Now Open. — <a href="booking.html#book-trial" style="color:#fff;text-decoration:underline;font-weight:700">Book Your Free Trial Now →</a>'
)

# Page Hero
content = content.replace(
    '<h1 class="section-title" style="margin-bottom:16px">',
    '<h1 class="section-title" style="margin-bottom: 24px;">'
)
content = content.replace(
    '<p class="section-sub" style="margin:0 auto;max-width:600px">',
    '<p class="section-sub mx-auto max-w-600">'
)

# Mission
content = content.replace(
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center">',
    '<div class="two-col-grid" style="gap:64px; align-items:center;">'
)
content = content.replace(
    '<p style="color:var(--gray);font-size:15px;line-height:1.8;margin-bottom:24px">',
    '<p class="text-body-md mb-lg">'
)
content = content.replace(
    '<p style="color:var(--gray);font-size:15px;line-height:1.8;margin-bottom:32px">',
    '<p class="text-body-md mb-lg">'
)

# Grid stats in mission
content = content.replace(
    '<div class="fade-in-up" style="display:grid;grid-template-columns:1fr 1fr;gap:20px">',
    '<div class="fade-in-up" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:24px;">'
)
content = content.replace(
    '<div class="feature-card" style="text-align:center">',
    '<div class="glass-panel p-md" style="text-align:center;">'
)

# Values and Facilities
content = content.replace(
    '<div class="features-grid" style="margin-top:50px">',
    '<div class="features-grid mt-lg">'
)

# Trainers
content = content.replace(
    '<p class="section-sub" style="margin:0 auto">',
    '<p class="section-sub mx-auto">'
)
content = content.replace(
    '<h2 class="section-title">The Experts Behind<br>Your <span class="text-gold">Success</span></h2>',
    '<h2 class="section-title mb-lg">The Experts Behind<br>Your <span class="text-gold">Success</span></h2>'
)

# CTA
content = content.replace(
    '<p class="section-sub" style="margin:0 auto 40px">',
    '<p class="section-sub mx-auto mt-md mb-lg">'
)

# Footer fixes (already handled in index.html, but let's see if we need to fix about.html footer)
# Testimonials stars and things not in about.html.

with open('d:/New folder/DATA SCIENCE/7musclefitness7/about.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
