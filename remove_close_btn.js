const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  c = c.replace(/<button class="mobile-nav-close">[\s\S]*?<\/button>\s*/g, '');
  if (c !== before) {
    fs.writeFileSync(f, c);
    console.log('Removed cancel btn from ' + f);
  }
});
