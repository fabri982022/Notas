$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$envFile = Join-Path $root '.env'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
        }
    }
} else {
    Write-Warning 'No se encontró .env. Se usarán los valores por defecto de Spring Boot.'
}

$backend = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'mvnw.cmd spring-boot:run' -WorkingDirectory (Join-Path $root 'backend') -PassThru
$frontend = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npm install && npm run dev -- --host 0.0.0.0' -WorkingDirectory (Join-Path $root 'frontend') -PassThru

try {
    Write-Host 'Backend: http://localhost:8080'
    Write-Host 'Frontend: http://localhost:5173'
    Wait-Process -Id $backend.Id, $frontend.Id
} finally {
    Stop-Process -Id $backend.Id, $frontend.Id -Force -ErrorAction SilentlyContinue
}
