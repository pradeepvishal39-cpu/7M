import sys
import re
import os

files = ['programs.html', 'membership.html', 'booking.html', 'dashboard.html', 'admin.html']
base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'

# 1. Fetch index footer
with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
    index_content = f.read()

match_index = re.search(r'<!-- LUXURY FOOTER -->\s*(<footer.*?</footer>)', index_content, re.DOTALL)
index_footer = match_index.group(0) if match_index else None

for file_name in files:
    path = os.path.join(base_dir, file_name)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content

    # Add luxury.css if missing
    if 'luxury.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="css/loader.css?v=20260519a">',
            '<link rel="stylesheet" href="css/loader.css?v=20260519a">\n  <link rel="stylesheet" href="css/luxury.css?v=1">'
        )
        content = content.replace(
            '<link rel="stylesheet" href="css/graphics.css?v=20260519a">',
            '<link rel="stylesheet" href="css/graphics.css?v=20260519a">\n  <link rel="stylesheet" href="css/luxury.css?v=1">'
        )
        # If loader and graphics not there, try styles.css
        if 'luxury.css' not in content:
            content = content.replace(
                '<link rel="stylesheet" href="css/styles.css?v=20260519a">',
                '<link rel="stylesheet" href="css/styles.css?v=20260519a">\n  <link rel="stylesheet" href="css/luxury.css?v=1">'
            )
            
    # Update urgency bar
    old_urgency_1 = '⚡ LIMITED OFFER: Get 1st Month FREE with Annual Plan — Only <strong>7 Slots Left!</strong>\n    <a href="membership.html#payment-section" style="color:#fff;text-decoration:underline;margin-left:8px;font-weight:700;white-space:nowrap">Claim Now →</a>'
    old_urgency_2 = '⚡ Limited Slots Available This Month — <a href="booking.html#book-trial" style="color:#fff;text-decoration:underline;font-weight:700">Book Your Free Trial Now →</a>'
    new_urgency = 'Elevate Your Fitness. 2024 Premium Memberships Now Open. — <a href="membership.html#payment-section" style="color:#fff;text-decoration:underline;font-weight:700">Discover More →</a>'
    
    content = content.replace(old_urgency_1, new_urgency)
    content = content.replace(old_urgency_2, new_urgency)

    # Replace old footer with LUXURY FOOTER
    if index_footer and '<!-- LUXURY FOOTER -->' not in content:
        content = re.sub(r'<footer.*?</footer>', index_footer, content, flags=re.DOTALL)

    # Replace inline styles for typography
    content = content.replace('style="font-family:var(--font-display); font-size:32px; color:var(--white);"', 'class="text-display-lg"')
    content = content.replace('style="font-family:var(--font-display); font-size:28px; color:var(--gold);"', 'class="text-display-md"')
    content = content.replace('style="font-family:var(--font-display); font-size:24px; color:var(--white);"', 'class="text-display-sm"')
    content = content.replace('style="font-family:var(--font-display); font-size:22px; color:var(--white); margin-bottom:8px; letter-spacing:0.05em;"', 'class="text-display-xs"')
    
    # Common layout styles
    content = content.replace('style="margin-top:60px;"', 'class="mt-xl"')
    content = content.replace('style="margin-top:60px"', 'class="mt-xl"')
    content = content.replace('style="margin-top:40px"', 'class="mt-md"')
    content = content.replace('style="margin-top:48px; display:flex; flex-direction:column; gap:32px;"', 'class="mt-lg flex-column-gap"')
    content = content.replace('style="display:flex; align-items:flex-start; gap:20px; padding:24px;"', 'class="glass-panel p-md" style="display:flex; align-items:flex-start; gap:20px;"')
    
    content = content.replace('style="color:var(--gray); font-size:16px; max-width:600px; margin:0 auto;"', 'class="text-body-lg max-w-600 mx-auto"')
    content = content.replace('style="color:var(--gray); font-size:15px; line-height:1.6;"', 'class="text-body-md"')
    content = content.replace('style="color:var(--gray); font-size:14px; margin-top:8px;"', 'class="text-body-sm"')
    content = content.replace('style="color:var(--gray); font-size:13px; margin-top:8px;"', 'class="text-body-xs"')

    content = content.replace('style="margin:0 auto"', 'class="mx-auto"')
    content = content.replace('style="padding:40px 0;"', 'class="py-lg"')
    
    # Other minor cleanups
    content = content.replace('<div class="feature-card" style="text-align:center">', '<div class="glass-panel p-md" style="text-align:center;">')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Processed: {file_name}')

print('All sweeps completed!')
