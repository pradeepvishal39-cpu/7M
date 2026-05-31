const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const targetRegex = /<div class="footer-heading">Contact<\/div>\s*<ul class="footer-links">([\s\S]*?)<\/ul>/g;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let updated = false;

  // Add Email to contact list if it doesn't have an email
  content = content.replace(targetRegex, (match, innerList) => {
    if (!innerList.includes('pradeepvishal007@gmail.com')) {
      const emailLi = '<li><a href="mailto:pradeepvishal007@gmail.com">✉️ pradeepvishal007@gmail.com</a></li>';
      // Insert right after the telephone number
      const newInnerList = innerList.replace(/<li><a href="tel:[^"]*">[^<]*<\/a><\/li>/, `$&${emailLi}`);
      updated = true;
      return `<div class="footer-heading">Contact</div><ul class="footer-links">${newInnerList}</ul>`;
    }
    return match;
  });

  if (updated) {
    fs.writeFileSync(f, content);
    console.log(`Updated email in ${f}`);
  }
});
