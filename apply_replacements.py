import os, glob

replacements = {
    '<h3 style="font-family:var(--font-display); font-size:32px; color:var(--white);">': '<h3 class="text-display-lg">',
    '<h3 style="font-family:var(--font-display); font-size:28px; color:var(--gold);">': '<h3 class="text-display-md">',
    '<h3 style="font-family:var(--font-display); font-size:24px; color:var(--white);">': '<h3 class="text-display-sm">',
    '<p style="color:var(--gray); font-size:14px; margin-top:8px;">': '<p class="text-body-sm">',
    '<p style="color:var(--gray); font-size:13px; margin-top:8px;">': '<p class="text-body-xs">',
    '<p style="color:var(--light); font-size:14px; margin-top:8px;">': '<p class="text-body-sm text-light">'
}

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
print('Done!')
