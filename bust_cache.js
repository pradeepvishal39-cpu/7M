const fs = require('fs');
const _ = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const d = Date.now();
  
  // Replace old src attributes with versioned ones
  content = content.replace(/src="js\/supabase\.js"/g, `src="js/supabase.js?v=${d}"`);
  content = content.replace(/src="js\/payment\.js"/g, `src="js/payment.js?v=${d}"`);
  content = content.replace(/src="js\/app\.js"/g, `src="js/app.js?v=${d}"`);
  content = content.replace(/src="js\/auth\.js"/g, `src="js/auth.js?v=${d}"`);

  fs.writeFileSync(f, content);
  console.log(`Updated cache busters in ${f}`);
});
