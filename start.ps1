# Solveria Math Solver Startup Script

Write-Host "🚀 Starting Solveria Math Solver..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
$nodeVersion = & node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check if MongoDB is running (optional)
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not detected. Database features may not work." -ForegroundColor Yellow
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating default .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit .env file with your API keys" -ForegroundColor Cyan
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
}

Write-Host ""
Write-Host "🌐 Starting server..." -ForegroundColor Blue
Write-Host "Landing Page: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Math Solver: http://localhost:3000/solve" -ForegroundColor Cyan
Write-Host "Signup: http://localhost:3000/signup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
node server.js
