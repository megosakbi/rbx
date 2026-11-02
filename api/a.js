const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  const src = fs.readFileSync(path.join(process.cwd(), 'public', 'a.txt'), 'utf8');
  const buf = Buffer.from(src, 'utf8');
  for (let i = 0; i < buf.length; i++) buf[i] ^= 37;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(buf.toString('base64'));
};
