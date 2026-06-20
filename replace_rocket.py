import os
import glob
import re

html_files = glob.glob("*.html")

new_html = """<!-- SCROLL TO TOP -->
<div id="scrollTopWrapper" class="scroll-top-wrapper">
  <div class="scroll-status-text">scrolling to top ↑</div>
  <a href="#" class="scroll-top-btn" id="scrollTopBtn" title="Scroll to Top" aria-label="Scroll to top">
    <div class="scroll-top-trail"></div>
    <div class="scroll-top-inner">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </div>
    <div class="scroll-sparks">
      <span style="--i:1"></span><span style="--i:2"></span><span style="--i:3"></span><span style="--i:4"></span><span style="--i:5"></span>
      <span style="--i:6"></span><span style="--i:7"></span><span style="--i:8"></span><span style="--i:9"></span><span style="--i:10"></span>
    </div>
  </a>
  <button id="scrollResetBtn" class="scroll-reset-btn">RESET</button>
</div>"""

for file in html_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace from <!-- SCROLL TO TOP --> up to the closing </a>
    new_content = re.sub(r'<!-- SCROLL TO TOP -->\s*<a href="#" class="scroll-top-btn".*?</a>', new_html, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file}")
