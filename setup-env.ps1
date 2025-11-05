$envContent = @"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gammaprep
JWT_SECRET=gammaprep_secret_key_2024_change_this_in_production
NODE_ENV=development
"@

$envPath = Join-Path $PSScriptRoot "backend\.env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline

Write-Host "✅ Created backend/.env file successfully!"
Write-Host ""
Write-Host "Environment variables set:"
Write-Host "  PORT=5000"
Write-Host "  MONGODB_URI=mongodb://localhost:27017/gammaprep"
Write-Host "  JWT_SECRET=gammaprep_secret_key_2024_change_this_in_production"
Write-Host "  NODE_ENV=development"
Write-Host ""
Write-Host "You can now start the backend server!"

