# ============================================================
# CAP NHAT DATA -> SUPABASE (Du An 2.0). Chuot phai -> Run with PowerShell.
# Sau khi chay: app tu cap nhat NGAY, KHONG can upload GitHub.
# ============================================================
$ErrorActionPreference="Stop"
$path    = "C:\Users\thuylt\Desktop\DỰ ÁN 2.0 TRAO QUYỀN CỬA HÀNG TRƯỞNG\BÁO CÁO BÁN HÀNG VÀ TỒN KHO DỰ ÁN 2.0.xlsx"
$outPath = "C:\Users\thuylt\Desktop\sakuko-duan2.0\data-hangmoi.js"
$SUPA_URL = "https://zekgipgumutlrvsmlmzk.supabase.co"
$SUPA_KEY = "sb_publishable_Z3zhjaDxtl0fuThb2Rtrhg_9gqoJ5YN"
$updated = (Get-Date).ToString("dd/MM/yyyy")
Get-Process EXCEL -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 400
$excel = New-Object -ComObject Excel.Application
$excel.Visible=$false; $excel.DisplayAlerts=$false
$wb = $excel.Workbooks.Open($path)
function FindSheet($wb,$contains){ foreach($ws in $wb.Worksheets){ if($ws.Name -like "*$contains*"){ return $ws } }; return $null }
$shMa  = FindSheet $wb "Danh sách mã hàng mới"
$shTon = FindSheet $wb "Tồn kho"
$shBan = FindSheet $wb "Báo cáo bán hàng"
$stores = @("Mandarin C1","Thái Hà","Trần Đăng Ninh","Nguyễn Du","Hàng Bông","Hàm Nghi","Nguyễn Tuân","T6 Time City")
function CanonStore($name){ foreach($s in $stores){ if($name -match [regex]::Escape($s)){ return $s } }; return $null }
function SafePrice($v){ if($null -eq $v){return 0}; $d=0.0; if([double]::TryParse((""+$v),[ref]$d)){ if($d -ge 0 -and $d -lt 100000000){ return [int]$d } }; return 0 }
$items=@{}
$v1=$shMa.UsedRange.Value2; $r1=$v1.GetLength(0)
for($i=3;$i -le $r1;$i++){
  $code=$v1[$i,8]; if($null -eq $code){continue}; $code=(""+$code).Trim(); if($code -eq ""){continue}
  if(-not $items.ContainsKey($code)){ $items[$code]=[ordered]@{ code=$code; barcode=(""+$v1[$i,6]); name=((""+$v1[$i,7]).Trim()); nganh=((""+$v1[$i,1]).Trim()); nhom=((""+$v1[$i,2]).Trim()); price=0; sold=0.0; rev=0.0; months=@{}; byStoreSold=@{}; inv=0; byStoreInv=@{} } }
}
$v2=$shTon.UsedRange.Value2; $r2=$v2.GetLength(0)
$invCols=@{ "Mandarin C1"=11;"Thái Hà"=13;"Trần Đăng Ninh"=15;"Nguyễn Du"=17;"Hàng Bông"=19;"Hàm Nghi"=21;"Nguyễn Tuân"=23;"T6 Time City"=25 }
for($i=3;$i -le $r2;$i++){
  $code=$v2[$i,8]; if($null -eq $code){continue}; $code=(""+$code).Trim(); if($code -eq "" -or -not $items.ContainsKey($code)){continue}
  $it=$items[$code]
  if(-not $it.nganh){ $it.nganh=((""+$v2[$i,1]).Trim()) }; if(-not $it.nhom){ $it.nhom=((""+$v2[$i,2]).Trim()) }
  $it.price=SafePrice $v2[$i,10]
  $tot=0; foreach($s in $stores){ $q=$v2[$i,$invCols[$s]]; if($null -eq $q){$q=0}; $qi=[int][double]$q; $it.byStoreInv[$s]=$qi; $tot+=$qi }; $it.inv=$tot
}
$n=$shBan.UsedRange.Rows.Count
$cM =$shBan.Range($shBan.Cells.Item(4,15),$shBan.Cells.Item($n,15)).Value2
$cST=$shBan.Range($shBan.Cells.Item(4,19),$shBan.Cells.Item($n,19)).Value2
$cIT=$shBan.Range($shBan.Cells.Item(4,28),$shBan.Cells.Item($n,28)).Value2
$cSL=$shBan.Range($shBan.Cells.Item(4,32),$shBan.Cells.Item($n,32)).Value2
$cTT=$shBan.Range($shBan.Cells.Item(4,35),$shBan.Cells.Item($n,35)).Value2
for($i=1;$i -le $cM.GetLength(0);$i++){
  $code=$cIT[$i,1]; if($null -eq $code){continue}; $code=(""+$code).Trim(); if(-not $items.ContainsKey($code)){continue}
  $it=$items[$code]; $sl=$cSL[$i,1]; if($null -eq $sl){$sl=0}; $tt=$cTT[$i,1]; if($null -eq $tt){$tt=0}
  $it.sold+=[double]$sl; $it.rev+=[double]$tt
  $mm=$cM[$i,1]; if($null -ne $mm){ $it.months[""+[int]$mm]=$true }
  $cs=CanonStore (""+$cST[$i,1]); if($cs){ if(-not $it.byStoreSold.ContainsKey($cs)){$it.byStoreSold[$cs]=0.0}; $it.byStoreSold[$cs]+=[double]$sl }
}
$out=@()
foreach($k in $items.Keys){
  $it=$items[$k]; $ma=@($it.months.Keys | ForEach-Object {[int]$_} | Sort-Object); $fm=0; if($ma.Count){$fm=[int]$ma[0]}
  $bss=[ordered]@{}; $bsi=[ordered]@{}
  foreach($s in $stores){ $q=0.0; if($it.byStoreSold.ContainsKey($s)){$q=$it.byStoreSold[$s]}; $bss[$s]=[int]$q; $iv=0; if($it.byStoreInv.ContainsKey($s)){$iv=$it.byStoreInv[$s]}; $bsi[$s]=$iv }
  $out+=[ordered]@{ code=$it.code; barcode=$it.barcode; name=$it.name; nganh=$it.nganh; nhom=$it.nhom; price=$it.price; sold=[int]$it.sold; rev=[double]$it.rev; monthsActive=$ma.Count; firstMonth=$fm; inv=$it.inv; byStoreSold=$bss; byStoreInv=$bsi }
}
$mset=@{}; foreach($k in $items.Keys){ foreach($m in $items[$k].months.Keys){ $mset[$m]=$true } }
$months=@($mset.Keys | ForEach-Object {[int]$_} | Sort-Object)
$root=[ordered]@{ updated=$updated; months=$months; stores=$stores; items=$out }
# 1) Ghi file du phong
$json="window.HANGMOI = " + ($root | ConvertTo-Json -Depth 8 -Compress) + ";"
[System.IO.File]::WriteAllText($outPath,$json,[System.Text.Encoding]::UTF8)
$wb.Close($false); $excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
# 2) Day len Supabase (app cap nhat ngay)
$at=[long]([DateTimeOffset]::Now.ToUnixTimeMilliseconds())
$bodyObj=[ordered]@{ id=1; payload=$root; at=$at }
$body=$bodyObj | ConvertTo-Json -Depth 8 -Compress
$headers=@{ apikey=$SUPA_KEY; Authorization="Bearer $SUPA_KEY"; "Content-Type"="application/json"; Prefer="resolution=merge-duplicates,return=minimal" }
try{
  Invoke-RestMethod -Method Post -Uri "$SUPA_URL/rest/v1/hangmoi" -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
  Write-Output ("XONG. Da day len Supabase: {0} | {1} ma. App tu cap nhat NGAY (Ctrl+F5)." -f $updated,$out.Count)
}catch{
  Write-Output ("Da tao file nhung LOI day Supabase: {0}" -f $_.Exception.Message)
  Write-Output "Kiem tra: da chay SQL tao bang 'hangmoi' chua? URL/key con dung khong?"
}