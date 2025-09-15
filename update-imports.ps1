# Update import paths in files
$updates = @(
    # Update imports in chat.router.ts
    @{
        File = "src\server\api\chat.router.ts"
        Old = "from ""../db"""
        New = "from ""../../../prisma"""
    },
    @{
        File = "src\server\api\chat.router.ts"
        Old = "from ""../trpc"""
        New = "from ""../../server/trpc"""
    },
    
    # Update imports in page.tsx
    @{
        File = "src\app\page.tsx"
        Old = "from ""../utils/trpc"""
        New = "from ""../../lib/api/trpc"""
    },
    @{
        File = "src\app\page.tsx"
        Old = "from ""../components/ui"""
        New = "from ""../../components/ui"""
    },
    @{
        File = "src\app\page.tsx"
        Old = "from ""../lib/utils"""
        New = "from ""../../lib/utils"""
    },
    @{
        File = "src\app\page.tsx"
        Old = "from ""../constants/config"""
        New = "from ""../../lib/constants/config"""
    },
    @{
        File = "src\app\page.tsx"
        Old = "from ""../types"""
        New = "from ""../../features/chat/types"""
    }
)

# Process each update
foreach ($update in $updates) {
    $file = $update.File
    $oldText = $update.Old
    $newText = $update.New
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace [regex]::Escape($oldText), $newText
        
        if ($content -ne $newContent) {
            Set-Content -Path $file -Value $newContent
            Write-Host "Updated imports in: $file"
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "\nImport updates completed!" -ForegroundColor Green
