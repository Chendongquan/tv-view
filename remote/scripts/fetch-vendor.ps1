param(
  [string]$FromPath = '',
  [string]$Version = '5.0.1'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$vendor = Join-Path $root 'vendor'
$target = Join-Path $vendor 'scrcpy'

if (Test-Path $target) {
  Remove-Item -Recurse -Force $target
}
New-Item -ItemType Directory -Force $vendor | Out-Null

if ($FromPath) {
  if (-not (Test-Path (Join-Path $FromPath 'scrcpy.exe'))) {
    throw "FromPath does not look like an extracted scrcpy folder: $FromPath"
  }
  New-Item -ItemType Directory -Force $target | Out-Null
  Copy-Item -Path (Join-Path $FromPath '*') -Destination $target -Recurse -Force
  Write-Host "Copied scrcpy from $FromPath"
}
else {
  $zip = Join-Path $env:TEMP "scrcpy-win64-v$Version.zip"
  $url = "https://github.com/Genymobile/scrcpy/releases/download/v$Version/scrcpy-win64-v$Version.zip"
  Write-Host "Downloading $url"
  Invoke-WebRequest -Uri $url -OutFile $zip

  $tmp = Join-Path $env:TEMP ("scrcpy-vendor-" + [guid]::NewGuid().ToString('N'))
  Expand-Archive -Path $zip -DestinationPath $tmp -Force
  $inner = Get-ChildItem -Path $tmp -Directory | Select-Object -First 1
  if (-not $inner) {
    throw 'scrcpy archive layout not recognized'
  }
  Move-Item -Path $inner.FullName -Destination $target
  Remove-Item -Recurse -Force $tmp
  Remove-Item -Force $zip
}

$required = @(
  'scrcpy.exe',
  'scrcpy-server',
  'adb.exe',
  'AdbWinApi.dll',
  'AdbWinUsbApi.dll',
  'LICENSE.txt'
)
foreach ($file in $required) {
  if (-not (Test-Path (Join-Path $target $file))) {
    throw "vendored scrcpy is missing $file"
  }
}

Write-Host "scrcpy $Version ready at $target"
