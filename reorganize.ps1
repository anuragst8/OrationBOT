# Create all necessary directories
$directories = @(
    # Feature directories
    "src\features\chat\api",
    "src\features\chat\components",
    "src\features\chat\hooks",
    "src\features\chat\types",
    
    # Component directories
    "src\components\ui",
    "src\components\layout",
    "src\components\shared",
    
    # Lib directories
    "src\lib\api",
    "src\lib\utils",
    "src\lib\constants",
    
    # Server directories
    "src\server\api",
    "src\server\middleware",
    "src\server\services",
    
    # Other directories
    "src\styles",
    "src\types"
)

# Create directories
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    } else {
        Write-Host "Directory already exists: $dir"
    }
}

Write-Host "\nDirectory structure created successfully!"
