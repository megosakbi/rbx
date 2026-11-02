const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  const src = fs.readFileSync(path.join(process.cwd(), 'public', 'a.txt'), 'utf8');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(Buffer.from(src, 'utf8').toString('base64'));
};
