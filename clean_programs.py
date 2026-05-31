import os
import re

path = 'd:/New folder/DATA SCIENCE/7musclefitness7/programs.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace image inline styles with the new luxury class
content = re.sub(
    r'style="width:100%; height:600px; object-fit:cover; border-radius:var\(--radius-lg\); filter:grayscale\([^)]*\) contrast\([^)]*\); box-shadow:0 30px 60px rgba\(0,0,0,0\.5\);"',
    'class="program-image-luxury"',
    content
)

# Replace the messy feature list inline styles
content = content.replace(
    'style="list-style:none; padding:0; margin:0 0 40px; display:flex; flex-direction:column; gap:16px; color:var(--light);"',
    'class="feature-list-luxury"'
)
content = content.replace(
    '<li style="display:flex; align-items:center; gap:12px;">',
    '<li>'
)

# Fix the CTA spacing at the bottom
content = content.replace(
    '<p class="section-sub mx-auto">Book a free consultation and our trainers will recommend the perfect program for your goals.</p>',
    '<p class="section-sub mx-auto mt-md mb-lg max-w-600">Book a free consultation and our trainers will recommend the perfect program for your goals.</p>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("programs.html debug cleanup complete!")
