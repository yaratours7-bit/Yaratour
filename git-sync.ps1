param(
    [string]$Message = "Auto commit"
)

$changes = git status --porcelain
if (-not $changes) {
    Write-Host "No changes to commit."
    exit 0
}

git add .
git commit -m $Message
git push
