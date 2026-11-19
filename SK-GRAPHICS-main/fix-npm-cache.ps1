# fix-npm-cache.ps1 - removes stray npm_config_cache_dir and sets correct npm cache
if ($Env:NPM_CONFIG_CACHE_DIR) {
    Write-Host "Removing unknown npm config 'cache-dir' (NPM_CONFIG_CACHE_DIR)..."
    Remove-Item Env:NPM_CONFIG_CACHE_DIR
}
# Optionally set the correct npm cache location (adjust as needed)
$Env:NPM_CONFIG_CACHE = "$HOME\AppData\Roaming\npm-cache"

