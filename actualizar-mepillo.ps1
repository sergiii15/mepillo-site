$ErrorActionPreference = "Stop"

$SitePath = "C:\Users\sergi\Desktop\mepillo-site"
$Downloads = "$env:USERPROFILE\Downloads"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "      MEPILLO - ACTUALIZADOR" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $SitePath)) {
    Write-Host "ERROR: No existe la carpeta:" -ForegroundColor Red
    Write-Host $SitePath -ForegroundColor Yellow
    Read-Host "Pulsa ENTER para cerrar"
    exit 1
}

$zip = Get-ChildItem $Downloads -Filter "mepillo-public*.zip" -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (!$zip) {
    Write-Host "No encuentro ninguna actualizacion en Descargas." -ForegroundColor Yellow
    Write-Host "El archivo debe llamarse algo como:"
    Write-Host "mepillo-public-actualizacion.zip" -ForegroundColor Green
    Write-Host ""
    Write-Host "Descarga primero la actualizacion que te prepare ChatGPT."
    Read-Host "Pulsa ENTER para cerrar"
    exit 1
}

Write-Host "Actualizacion encontrada:" -ForegroundColor Green
Write-Host $zip.FullName
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $SitePath "_backups"
$backup = Join-Path $backupRoot ("public-" + $timestamp)
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

if (Test-Path (Join-Path $SitePath "public")) {
    Write-Host "Creando copia de seguridad..." -ForegroundColor Cyan
    Copy-Item (Join-Path $SitePath "public") $backup -Recurse -Force
}

$temp = Join-Path $env:TEMP ("mepillo-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $temp | Out-Null

try {
    Write-Host "Descomprimiendo actualizacion..." -ForegroundColor Cyan
    Expand-Archive -Path $zip.FullName -DestinationPath $temp -Force

    $publicSource = Get-ChildItem $temp -Directory -Recurse |
        Where-Object { $_.Name -eq "public" } |
        Sort-Object FullName |
        Select-Object -First 1

    if (!$publicSource) {
        throw "No se encontro una carpeta 'public' dentro del ZIP."
    }

    $target = Join-Path $SitePath "public"

    Write-Host "Reemplazando archivos de MePillo..." -ForegroundColor Cyan
    if (Test-Path $target) {
        Remove-Item $target -Recurse -Force
    }
    Copy-Item $publicSource.FullName $target -Recurse -Force

    Write-Host ""
    Write-Host "ACTUALIZACION COMPLETADA." -ForegroundColor Green
    Write-Host "Copia de seguridad: $backup" -ForegroundColor DarkGray
    Write-Host ""

    $answer = Read-Host "Quieres abrir MePillo en modo local ahora? (S/N)"
    if ($answer -match '^[sSyY]') {
        Set-Location $SitePath
        Start-Process powershell -ArgumentList '-NoExit','-Command',"cd '$SitePath'; firebase.cmd serve --only hosting"
        Start-Sleep -Seconds 3
        Start-Process "http://localhost:5000"
        Write-Host "Servidor local iniciado." -ForegroundColor Green
    }
}
catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "No se ha publicado nada en Firebase." -ForegroundColor Yellow
}
finally {
    if (Test-Path $temp) {
        Remove-Item $temp -Recurse -Force
    }
}

Write-Host ""
Read-Host "Pulsa ENTER para cerrar"
