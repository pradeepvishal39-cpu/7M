import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# The exact regex to find the WhatsApp button
wa_regex = re.compile(
    r'(<a[^>]*class="[^"]*whatsapp-btn[^"]*"[^>]*>.*?</a>)',
    re.DOTALL | re.IGNORECASE
)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file has nav-cta and sticky-cta
    if 'class="nav-cta"' in content and 'class="sticky-cta"' in content:
        # Find the whatsapp button in sticky-cta
        # To be safe, we will just find the first whatsapp-btn since there should only be one main one
        match = wa_regex.search(content)
        if match:
            wa_html = match.group(1)
            
            # Remove it from its current position
            content = content.replace(wa_html, '', 1)
            
            # Clean up empty lines left behind (optional but nice)
            
            # Now insert it into nav-cta before the first button
            # Find <div class="nav-cta">
            nav_cta_start = content.find('<div class="nav-cta">')
            if nav_cta_start != -1:
                # Find the end of this tag
                insert_pos = content.find('>', nav_cta_start) + 1
                
                # Insert
                content = content[:insert_pos] + '\n        ' + wa_html + content[insert_pos:]
                
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Moved WA button in {file}')
        else:
            print(f'No WhatsApp button found in {file}')
