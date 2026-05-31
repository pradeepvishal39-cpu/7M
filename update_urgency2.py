import os
import re

base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'
files = [f for f in os.listdir(base_dir) if f.endswith('.html')]

for file_name in files:
    path = os.path.join(base_dir, file_name)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The user wants: "🏆 JOIN URAPAKKAM'S TOP-RATED GYM — FREE TRIAL ENDS THIS WEEK →"
    # We will format it so the link contains "FREE TRIAL ENDS THIS WEEK →"
    
    # We find the urgency bar and replace its contents.
    # The existing href might be 'membership.html#payment-section' or 'booking.html#book-trial' depending on the page.
    # Let's preserve the existing href.
    
    def replace_urgency(match):
        href = 'booking.html#book-trial' # Default
        href_match = re.search(r'href="([^"]+)"', match.group(0))
        if href_match:
            href = href_match.group(1)
            
        new_inner = f'\n  <span class="pulse-dot"></span>\n  🏆 JOIN URAPAKKAM\'S TOP-RATED GYM — <a href="{href}" style="color:#fff;text-decoration:underline;font-weight:700">FREE TRIAL ENDS THIS WEEK →</a>\n'
        return f'<div class="urgency-bar">{new_inner}</div>'

    new_content = re.sub(
        r'<div class="urgency-bar">.*?</div>',
        replace_urgency,
        content,
        flags=re.DOTALL
    )
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_name}")

print("Urgency bar text updated to the new prompt!")
