import sys

with open('d:/New folder/DATA SCIENCE/7musclefitness7/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Urgency Bar
content = content.replace(
    '⚡ LIMITED OFFER: Get 1st Month FREE with Annual Plan — Only <strong>7 Slots Left!</strong>\n    <a href="membership.html#payment-section" style="color:#fff;text-decoration:underline;margin-left:8px;font-weight:700;white-space:nowrap">Claim Now →</a>',
    'Elevate Your Fitness. 2024 Premium Memberships Now Open.\n    <a href="membership.html#payment-section" style="color:#fff;text-decoration:underline;margin-left:8px;font-weight:700;white-space:nowrap">Discover More →</a>'
)

# Hero Stats
content = content.replace(
    '<div class="glass-panel glass-floating-card" style="margin-left: 40px; margin-top: -10px;">',
    '<div class="glass-panel glass-floating-card">'
)
content = content.replace(
    '<div class="glass-panel glass-floating-card" style="margin-left: 80px; margin-top: -10px;">',
    '<div class="glass-panel glass-floating-card">'
)

# Section subs
content = content.replace('style="margin:0 auto"', 'class="mx-auto"')
content = content.replace('style="margin-top:60px;"', 'class="mt-xl"')
content = content.replace('style="margin-top:60px"', 'class="mt-xl"')
content = content.replace('style="margin-top:40px"', 'class="mt-md"')
content = content.replace('style="margin-top:40px; max-width:800px; margin-inline:auto;"', 'class="mt-md max-w-600 mx-auto"')
content = content.replace('style="margin-top:60px; max-width:800px; margin-inline:auto;"', 'class="mt-xl max-w-600 mx-auto"')

# Bento Grid Typography
content = content.replace(
    '<h3 style="font-family:var(--font-display); font-size:32px; color:var(--white);">',
    '<h3 class="text-display-lg">'
)
content = content.replace(
    '<p style="color:var(--gray); font-size:14px; margin-top:8px;">',
    '<p class="text-body-sm">'
)
content = content.replace(
    '<h3 style="font-family:var(--font-display); font-size:24px; color:var(--white);">',
    '<h3 class="text-display-sm">'
)
content = content.replace(
    '<p style="color:var(--gray); font-size:13px; margin-top:8px;">',
    '<p class="text-body-xs">'
)
content = content.replace(
    '<h3 style="font-family:var(--font-display); font-size:28px; color:var(--gold);">',
    '<h3 class="text-display-md">'
)
content = content.replace(
    '<p style="color:var(--light); font-size:14px; margin-top:8px;">',
    '<p class="text-body-sm text-light">'
)

# Trainers typography
content = content.replace(
    '<h3 style="font-family:var(--font-display); font-size:28px; color:var(--gold); margin-bottom:4px;">',
    '<h3 class="text-display-md">'
)
content = content.replace(
    '<p style="color:var(--white); font-weight:600; font-size:14px; margin-bottom:12px;">',
    '<p class="text-white-bold">'
)
content = content.replace(
    '<p style="color:var(--gray); font-size:13px;">',
    '<p class="text-body-xs" style="margin-top:0;">'
)

# Testimonials Typography
content = content.replace(
    '<h3 style="color:var(--gold); font-family:var(--font-display); font-size:32px; margin-bottom:16px;">',
    '<h3 class="text-display-lg" style="color:var(--gold);">'
)
content = content.replace(
    '<p style="color:var(--gray); font-size:16px; max-width:600px; margin:0 auto;">',
    '<p class="text-body-lg max-w-600 mx-auto">'
)

# Contact section
content = content.replace('style="padding:40px 0;"', 'class="py-lg"')
content = content.replace('style="margin-top:48px; display:flex; flex-direction:column; gap:32px;"', 'class="mt-lg flex-column-gap"')
content = content.replace('style="display:flex; align-items:flex-start; gap:20px; padding:24px;"', 'class="glass-panel p-md" style="display:flex; align-items:flex-start; gap:20px;"')
content = content.replace('<h4 style="font-family:var(--font-display); font-size:22px; color:var(--white); margin-bottom:8px; letter-spacing:0.05em;">', '<h4 class="text-display-xs">')
content = content.replace('<p style="color:var(--gray); font-size:15px; line-height:1.6;">', '<p class="text-body-md">')
content = content.replace('style="align-items:stretch;"', 'class="align-stretch"')

# Stars
content = content.replace(
    '<div style="color:var(--gold); font-size:18px; margin-bottom:8px;">★★★★★</div>',
    '<div style="color:var(--gold); margin-bottom:12px; display:flex; gap:4px;">' + ('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' * 5) + '</div>'
)


with open('d:/New folder/DATA SCIENCE/7musclefitness7/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
