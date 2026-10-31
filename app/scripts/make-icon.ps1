param(
  [string]$OutDir = (Join-Path (Split-Path -Parent $PSScriptRoot) 'build')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$size = 256
$png = Join-Path $OutDir 'icon.png'
New-Item -ItemType Directory -Force $OutDir | Out-Null

$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 28, 30))
$g.FillRectangle($bg, 0, 0, $size, $size)

$orange = [System.Drawing.Color]::FromArgb(255, 159, 10)
$pen = New-Object System.Drawing.Pen($orange, 14)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$screen = New-Object System.Drawing.Rectangle(40, 50, 176, 116)
$g.DrawRectangle($pen, $screen)

$g.DrawLine($pen, 104, 166, 104, 186)
$g.DrawLine($pen, 152, 166, 152, 186)
$g.DrawLine($pen, 84, 198, 172, 198)

$dot = New-Object System.Drawing.SolidBrush($orange)
$g.FillEllipse($dot, 120, 98, 16, 16)

$bmp.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Host "Wrote $png"
