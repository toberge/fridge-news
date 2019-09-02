const fs = require('file-system');
const conf = JSON.parse(fs.readFileSync('db.json', 'utf8'));

console.log(conf);
