param(
  [string]$JmeterHome = "$env:USERPROFILE\Tools\apache-jmeter-5.6.3",
  [int]$Repeticiones = 3,
  [int]$UsuariosA = 2,
  [int]$UsuariosB = 2,
  [int]$Iteraciones = 5
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($env:E2E_OPERATOR_USER) -or
    [string]::IsNullOrWhiteSpace($env:E2E_OPERATOR_PASSWORD)) {
  throw 'Define E2E_OPERATOR_USER y E2E_OPERATOR_PASSWORD antes de ejecutar la prueba.'
}

$jmeter = Join-Path $JmeterHome 'bin\jmeter.bat'
if (-not (Test-Path -LiteralPath $jmeter)) {
  throw "No se encontró JMeter en: $jmeter"
}

$directorioScript = Split-Path -Parent $MyInvocation.MyCommand.Path
$plan = Join-Path $directorioScript 'coexistencia-despachos.jmx'
if (-not (Test-Path -LiteralPath $plan)) {
  throw "No se encontró el plan: $plan"
}

$raizProyecto = (Resolve-Path (Join-Path $directorioScript '..\..')).Path
$marcaTiempo = Get-Date -Format 'yyyyMMdd-HHmmss'
$directorioEjecucion = Join-Path $raizProyecto "performance\results\coexistencia-$marcaTiempo"
New-Item -ItemType Directory -Path $directorioEjecucion -Force | Out-Null

function Invoke-Escenario {
  param(
    [Parameter(Mandatory)]
    [string]$Nombre,
    [Parameter(Mandatory)]
    [int]$Ronda,
    [Parameter(Mandatory)]
    [int]$HilosA,
    [Parameter(Mandatory)]
    [int]$BuclesA,
    [Parameter(Mandatory)]
    [int]$HilosB,
    [Parameter(Mandatory)]
    [int]$BuclesB
  )

  $identificador = '{0}-ronda-{1}' -f $Nombre, $Ronda
  $archivoJtl = Join-Path $directorioEjecucion "$identificador.jtl"
  $reporteHtml = Join-Path $directorioEjecucion "$identificador-html"
  $archivoLog = Join-Path $directorioEjecucion "$identificador-jmeter.log"

  Write-Host "Ejecutando $identificador..." -ForegroundColor Cyan

  & $jmeter `
    -n `
    -t $plan `
    "-JthreadsA=$HilosA" `
    "-JloopsA=$BuclesA" `
    "-JthreadsB=$HilosB" `
    "-JloopsB=$BuclesB" `
    "-JrunId=$identificador" `
    -l $archivoJtl `
    -j $archivoLog `
    -e `
    -o $reporteHtml

  if ($LASTEXITCODE -ne 0) {
    throw "JMeter terminó con código $LASTEXITCODE en $identificador. Revisa $archivoLog"
  }
}

for ($ronda = 1; $ronda -le $Repeticiones; $ronda++) {
  Invoke-Escenario `
    -Nombre 'a-base' `
    -Ronda $ronda `
    -HilosA $UsuariosA `
    -BuclesA $Iteraciones `
    -HilosB $UsuariosB `
    -BuclesB 0

  Invoke-Escenario `
    -Nombre 'b-base' `
    -Ronda $ronda `
    -HilosA $UsuariosA `
    -BuclesA 0 `
    -HilosB $UsuariosB `
    -BuclesB $Iteraciones

  Invoke-Escenario `
    -Nombre 'coexistencia' `
    -Ronda $ronda `
    -HilosA $UsuariosA `
    -BuclesA $Iteraciones `
    -HilosB $UsuariosB `
    -BuclesB $Iteraciones
}

Write-Host 'Pruebas terminadas correctamente.' -ForegroundColor Green
Write-Host "Resultados: $directorioEjecucion"

