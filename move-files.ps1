# Move files to their new locations
$moves = @(
    # Move UI components
    @{
        From = "src\components\ui.tsx"
        To = "src\components\ui\index.tsx"
    },
    
    # Move server files
    @{
        From = "src\server\routers\chat.ts"
        To = "src\server\api\chat.router.ts"
    },
    
    # Move types
    @{
        From = "src\types\index.ts"
        To = "src\features\chat\types\index.ts"
    },
    
    # Move constants
    @{
        From = "src\constants\config.ts"
        To = "src\lib\constants\config.ts"
    },
    
    # Move utils
    @{
        From = "src\utils\*.ts"
        To = "src\lib\utils\"
    }
)

# Process each move
foreach ($move in $moves) {
    $from = $move.From
    $to = $move.To
    
    if (Test-Path $from) {
        # Create parent directory if it doesn't exist
        $parentDir = Split-Path $to -Parent
        if (!(Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        
        Move-Item -Path $from -Destination $to -Force
        Write-Host "Moved: $from -> $to"
    } else {
        Write-Host "Source not found: $from" -ForegroundColor Yellow
    }
}

Write-Host "\nFile reorganization completed!" -ForegroundColor Green
