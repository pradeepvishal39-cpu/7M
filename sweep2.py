import sys
import re
import os

files = ['programs.html', 'membership.html', 'booking.html', 'dashboard.html', 'admin.html']
base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'

# Fetch index footer
with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
    index_content = f.read()

match_index = re.search(r'<!-- LUXURY FOOTER -->\s*(<footer.*?</footer>)', index_content, re.DOTALL)
index_footer = match_index.group(0) if match_index else ""

for file_name in files:
    path = os.path.join(base_dir, file_name)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add luxury.css
    if 'luxury.css' not in content:
        # Find the last <link rel="stylesheet"... and insert after it
        content = re.sub(
            r'(<link rel="stylesheet"[^>]*>)(?!.*?<link rel="stylesheet")',
            r'\1\n  <link rel="stylesheet" href="css/luxury.css?v=1">',
            content,
            flags=re.DOTALL
        )
        
    # 2. Update urgency bar
    new_urgency = 'Elevate Your Fitness. 2024 Premium Memberships Now Open. — <a href="membership.html#payment-section" style="color:#fff;text-decoration:underline;font-weight:700">Discover More →</a>'
    content = re.sub(
        r'<div class="urgency-bar">.*?<span class="pulse-dot"></span>.*?(?:</a>|\n)\s*</div>',
        f'<div class="urgency-bar">\n  <span class="pulse-dot"></span>\n  {new_urgency}\n</div>',
        content,
        flags=re.DOTALL
    )

    # 3. Replace footer
    if index_footer and '<!-- LUXURY FOOTER -->' not in content:
        # Some pages might not have <footer> but have <!-- FOOTER --> or something.
        content = re.sub(r'<footer.*?</footer>', index_footer, content, flags=re.DOTALL)

    # 4. Strip common inline styles with regex
    content = re.sub(r'style="[^"]*font-family:\s*var\(--font-display\)[^"]*"', 'class="text-display-md"', content)
    content = re.sub(r'style="[^"]*margin-top:\s*60px[^"]*"', 'class="mt-xl"', content)
    content = re.sub(r'style="[^"]*margin-top:\s*40px[^"]*"', 'class="mt-md"', content)
    content = re.sub(r'style="[^"]*margin:\s*0\s+auto[^"]*"', 'class="mx-auto"', content)
    
    # Write back
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Processed: {file_name}')

print('All sweeps completed!')
