param(
  [Parameter(Mandatory = $true)][int]$ParentPid,
  [Parameter(Mandatory = $true)][int]$ChildPid,
  [int]$X = 0,
  [int]$Y = 0,
  [int]$W = 1280,
  [int]$H = 720,
  [long]$ChildHwnd = 0,
  [ValidateSet('embed', 'move', 'hide', 'show')][string]$Mode = 'embed'
)

$ErrorActionPreference = 'Stop'

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class TvWin {
  [DllImport("user32.dll", SetLastError = true)]
  public static extern IntPtr SetParent(IntPtr child, IntPtr parent);
  [DllImport("user32.dll", SetLastError = true)]
  public static extern bool MoveWindow(IntPtr hWnd, int x, int y, int width, int height, bool repaint);
  [DllImport("user32.dll", SetLastError = true)]
  public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int index);
  [DllImport("user32.dll", SetLastError = true)]
  public static extern IntPtr SetWindowLongPtr(IntPtr hWnd, int index, IntPtr value);
  [DllImport("user32.dll")]
  public static extern bool ShowWindow(IntPtr hWnd, int command);
  [DllImport("user32.dll")]
  public static extern bool IsWindow(IntPtr hWnd);
  [DllImport("user32.dll")]
  public static extern bool SetProcessDpiAwarenessContext(IntPtr context);
  [DllImport("user32.dll")]
  public static extern bool SetWindowPos(IntPtr hWnd, IntPtr after, int x, int y, int cx, int cy, uint flags);
}
"@

[void][TvWin]::SetProcessDpiAwarenessContext([IntPtr](-4))

$GWL_STYLE = -16
$WS_CHILD = 0x40000000
$WS_POPUP = 0x80000000
$WS_CAPTION = 0x00C00000
$WS_THICKFRAME = 0x00040000
$SWP_SHOWWINDOW = 0x0040
$SWP_NOACTIVATE = 0x0010

function Get-MainWindow([int]$ProcessId, [int]$TimeoutMs) {
  $deadline = [DateTime]::Now.AddMilliseconds($TimeoutMs)
  while ([DateTime]::Now -lt $deadline) {
    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if ($process) {
      $process.Refresh()
      if ($process.MainWindowHandle -ne [IntPtr]::Zero) {
        return $process.MainWindowHandle
      }
    }
    Start-Sleep -Milliseconds 150
  }
  return [IntPtr]::Zero
}

$child = [IntPtr]::Zero
if ($ChildHwnd -ne 0 -and [TvWin]::IsWindow([IntPtr]$ChildHwnd)) {
  $child = [IntPtr]$ChildHwnd
}
else {
  $child = Get-MainWindow -ProcessId $ChildPid -TimeoutMs 20000
}
if ($child -eq [IntPtr]::Zero) {
  Write-Output '{"mode":"failed","error":"scrcpy window not found"}'
  exit 1
}

if ($Mode -eq 'embed') {
  $parent = Get-MainWindow -ProcessId $ParentPid -TimeoutMs 5000
  if ($parent -eq [IntPtr]::Zero) {
    [void][TvWin]::MoveWindow($child, 120, 120, 1280, 720, $true)
    Write-Output '{"mode":"floating","error":"app window not found"}'
    exit 0
  }

  $style = [int64]([TvWin]::GetWindowLongPtr($child, $GWL_STYLE).ToInt64())
  $style = $style -band 0xFFFFFFFF
  $style = ($style -band (-bnot ($WS_POPUP -bor $WS_CAPTION -bor $WS_THICKFRAME))) -bor $WS_CHILD
  [void][TvWin]::SetWindowLongPtr($child, $GWL_STYLE, [IntPtr]$style)
  [void][TvWin]::SetParent($child, $parent)
  [void][TvWin]::SetWindowPos($child, [IntPtr]::Zero, $X, $Y, $W, $H,
    ($SWP_SHOWWINDOW -bor $SWP_NOACTIVATE))
  [void][TvWin]::ShowWindow($child, 5)
  Write-Output ('{"mode":"embed","child":' + $child.ToInt64() + '}')
}
elseif ($Mode -eq 'move') {
  [void][TvWin]::MoveWindow($child, $X, $Y, $W, $H, $true)
  Write-Output ('{"mode":"move","child":' + $child.ToInt64() + '}')
}
else {
  [void][TvWin]::ShowWindow($child, $(if ($Mode -eq 'show') { 5 } else { 0 }))
  Write-Output ('{"mode":"' + $Mode + '","child":' + $child.ToInt64() + '}')
}
