const fs = require('fs');

['app', 'supabase', 'payment'].forEach(f => {
  if (fs.existsSync('js/' + f + '.js')) {
    fs.renameSync('js/' + f + '.js', 'js/' + f + '_v2.js');
  }
});

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/src="js\/app\.js\?.*?"/g, 'src="js/app_v2.js"').replace(/src="js\/app\.js"/g, 'src="js/app_v2.js"');
  content = content.replace(/src="js\/supabase\.js\?.*?"/g, 'src="js/supabase_v2.js"').replace(/src="js\/supabase\.js"/g, 'src="js/supabase_v2.js"');
  content = content.replace(/src="js\/payment\.js\?.*?"/g, 'src="js/payment_v2.js"').replace(/src="js\/payment\.js"/g, 'src="js/payment_v2.js"');
  fs.writeFileSync(f, content);
  console.log('Renamed references in ' + f);
});
