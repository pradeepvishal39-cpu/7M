import sys
import re
import os

files = ['programs.html', 'membership.html', 'booking.html', 'dashboard.html', 'admin.html', 'about.html', 'index.html']
base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'

for file_name in files:
    path = os.path.join(base_dir, file_name)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find duplicate class attributes and merge them
    # Example: class="foo" class="bar" -> class="foo bar"
    # We'll run it a few times in case there are 3 classes
    for _ in range(3):
        content = re.sub(r'class="([^"]*)"\s+class="([^"]*)"', r'class="\1 \2"', content)
        # Also handle cases where there might be a style tag left behind, but specifically duplicate classes
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Fixed duplicate classes in: {file_name}')

print('Debug sweep completed!')
