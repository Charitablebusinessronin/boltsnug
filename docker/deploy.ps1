# Snugs & Kisses Healthcare Platform - Windows Deployment Script
# PowerShell script for healthcare platform Docker deployment

param(
    [string]$Environment = "production",
    [switch]$Development,
    [switch]$Build,
    [switch]$Stop
)

# Healthcare platform configuration
$ProjectName = "snugs-healthcare"
$ImageName = "snugs-healthcare-portal"
$ContainerName = "snugs-healthcare-portal"

Write-Host "🏥 Snugs & Kisses Healthcare Platform Deployment" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue

# Stop existing containers if requested
if ($Stop) {
    Write-Host "🛑 Stopping healthcare platform containers..." -ForegroundColor Yellow
    docker-compose down
    docker stop $ContainerName -ErrorAction SilentlyContinue
    docker rm $ContainerName -ErrorAction SilentlyContinue
    Write-Host "✅ Healthcare platform stopped" -ForegroundColor Green
    exit 0
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Please update .env with your healthcare platform configuration" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: .env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Validate required environment variables
Write-Host "🔍 Validating healthcare platform configuration..." -ForegroundColor Blue
$RequiredVars = @("VITE_CATALYST_PROJECT_ID", "VITE_CATALYST_APP_URL")
foreach ($var in $RequiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if ([string]::IsNullOrEmpty($value)) {
        Write-Host "❌ Error: Required environment variable $var is not set" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✓ $var is configured" -ForegroundColor Green
    }
}

# Build Docker image if requested or if image doesn't exist
if ($Build -or -not (docker images $ImageName -q)) {
    Write-Host "🏗️  Building healthcare platform Docker image..." -ForegroundColor Blue
    $buildArgs = @(
        "--build-arg", "VITE_CATALYST_PROJECT_ID=$([Environment]::GetEnvironmentVariable('VITE_CATALYST_PROJECT_ID', 'Process'))",
        "--build-arg", "VITE_ENVIRONMENT=$Environment",
        "--build-arg", "VITE_CATALYST_APP_URL=$([Environment]::GetEnvironmentVariable('VITE_CATALYST_APP_URL', 'Process'))",
        "-t", "$ImageName`:latest",
        "-t", "$ImageName`:$(Get-Date -Format 'yyyyMMddHHmmss')",
        "."
    )
    
    & docker build @buildArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Healthcare platform image built successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to build healthcare platform image" -ForegroundColor Red
        exit 1
    }
}

# Deploy healthcare platform
if ($Development) {
    Write-Host "🚀 Starting healthcare platform in development mode..." -ForegroundColor Blue
    $env:COMPOSE_FILE = "docker-compose.yml:docker-compose.dev.yml"
} else {
    Write-Host "🚀 Deploying healthcare platform in production mode..." -ForegroundColor Blue
}

docker-compose up -d

# Wait for health check
Write-Host "🏥 Waiting for healthcare platform to be healthy..." -ForegroundColor Blue
$maxAttempts = 30
$attempt = 1

do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Healthcare platform is healthy and ready" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "⏳ Waiting for healthcare platform... (attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        $attempt++
    }
} while ($attempt -le $maxAttempts)

# Check final deployment status
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "🎉 Healthcare platform deployed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Healthcare Portal URL: http://localhost" -ForegroundColor Cyan
        Write-Host "Health Check: http://localhost/health" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To view logs: docker-compose logs -f healthcare-portal" -ForegroundColor Yellow
        Write-Host "To stop: docker-compose down" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Healthcare platform deployment failed" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs healthcare-portal" -ForegroundColor Yellow
    exit 1
}