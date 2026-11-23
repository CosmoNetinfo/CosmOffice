$ErrorActionPreference = 'Stop'
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_OS -ne 'Windows') { throw 'Installazione e disinstallazione consentite soltanto nel runner Windows di GitHub Actions.' }
$package = Get-Content -LiteralPath package.json -Raw | ConvertFrom-Json
if ($package.version -notmatch '^\d+\.\d+\.\d+$') { throw 'Versione non valida.' }
$runnerRoot = [System.IO.Path]::TrimEndingDirectorySeparator([System.IO.Path]::GetFullPath($env:RUNNER_TEMP))
$installRoot = [System.IO.Path]::GetFullPath((Join-Path $runnerRoot "CosmOffice-$($package.version)-installazione"))
if (-not $installRoot.StartsWith($runnerRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Destinazione fuori dal runner temporaneo.' }
if (Test-Path -LiteralPath $installRoot) { throw 'La destinazione deve essere nuova, non sovrascrivo installazioni esistenti.' }
$installer = (Resolve-Path -LiteralPath "release/CosmOffice-$($package.version)-win-x64-Setup.exe").Path
$appExe = Join-Path $installRoot 'CosmOffice.exe'
$uninstaller = Join-Path $installRoot 'Uninstall CosmOffice.exe'
New-Item -ItemType Directory -Path test-results -Force | Out-Null
try {
  $process = Start-Process -FilePath $installer -ArgumentList @('/S', '/currentuser', "/D=$installRoot") -WindowStyle Hidden -Wait -PassThru
  $installExit = $process.ExitCode
  Write-Output "Installer NSIS reale: exit $($process.ExitCode)"
  if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $appExe)) { throw 'Installazione reale non riuscita.' }
  $env:COSMO_INSTALLED_EXE = $appExe
  node scripts/windows-installed-ui.mjs
  $uiExit = $LASTEXITCODE
  if ($LASTEXITCODE -ne 0) { throw 'Prova del programma installato fallita.' }
} finally {
  if (Test-Path -LiteralPath $uninstaller) {
    $process = Start-Process -FilePath $uninstaller -ArgumentList '/S' -WindowStyle Hidden -Wait -PassThru
    $uninstallExit = $process.ExitCode
    Write-Output "Disinstallazione NSIS reale: exit $($process.ExitCode)"
    if ($process.ExitCode -ne 0) { throw 'Disinstallazione non riuscita.' }
    $deadline = [DateTime]::UtcNow.AddSeconds(60)
    while ((Test-Path -LiteralPath $appExe) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 500 }
    foreach ($relative in @('CosmOffice.exe','resources/LICENSE','resources/THIRD_PARTY_NOTICES.txt')) {
      if (Test-Path -LiteralPath (Join-Path $installRoot $relative)) { throw "File rimasto dopo la disinstallazione: $relative" }
    }
    Write-Output 'PASS: disinstallazione reale completata, eseguibile e testi locali rimossi.'
  } else { throw 'Uninstaller mancante: disinstallazione non provata.' }
}
Write-Output 'PASS runner Windows: installazione NSIS non interattiva, avvio visibile, Home, DOCX/XLSX/PDF, risorse di licenza e disinstallazione. Non equivale a un PC reale.'
@(
  '# Prova reale NSIS nel runner Windows',
  "Versione: $($package.version)",
  "Installazione reale non interattiva: exit $installExit",
  "App installata, finestra visibile, Home, DOCX/XLSX/PDF e licenze: exit $uiExit",
  "Disinstallazione reale: exit $uninstallExit; eseguibile e testi locali rimossi",
  'Selezione dei file automatizzata; lettura IPC e rendering reali.',
  'Non sostituisce un PC fisico pulito: SmartScreen, UAC con antivirus, utente normale e dialogo file OS non provati.'
) | Set-Content -LiteralPath test-results/WINDOWS-INSTALLAZIONE.md
