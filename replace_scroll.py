import os
import glob

html_files = glob.glob("*.html")

old_html = """<!-- SCROLL TO TOP -->
<a href="#" class="scroll-top-btn" id="scrollTopBtn" title="Scroll to Top" aria-label="Scroll to top">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
</a>"""

new_html = """<!-- SCROLL TO TOP -->
<a href="#" class="scroll-top-btn" id="scrollTopBtn" title="Scroll to Top" aria-label="Scroll to top">
  <div class="scroll-top-inner">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </div>
</a>"""

for file in html_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_html in content:
        content = content.replace(old_html, new_html)
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file}")
