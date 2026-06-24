import os

snippet = '''
<!-- SCROLL TO TOP -->
<div id="scrollTopWrapper" class="scroll-top-wrapper">
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
</div>
'''

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="scrollTopWrapper"' not in content:
        # try to find sticky-cta first
        idx = content.find('<div class="sticky-cta">')
        if idx != -1:
            content = content[:idx] + snippet + '\n' + content[idx:]
        else:
            # try to find script tags near the end
            idx = content.find('<script src="js/')
            if idx != -1:
                content = content[:idx] + snippet + '\n' + content[idx:]
            else:
                idx = content.find('</body>')
                if idx != -1:
                    content = content[:idx] + snippet + '\n' + content[idx:]
                else:
                    content += snippet

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Added to {file}')
