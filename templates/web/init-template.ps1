# Project Template Initializer - PowerShell Wrapper
# 
# Usage:
#   .\init-template.ps1 <target-folder>
#   .\init-template.ps1 <target-folder> -Git
#
# Examples:
#   .\init-template.ps1 ..\my-new-project
#   .\init-template.ps1 C:\projects\new-project -Git

param(
    [Parameter(Mandatory=$true, Position=0, HelpMessage="Target folder path")]
    [string]$TargetFolder,
    
    [Parameter(HelpMessage="Initialize git repository")]
    [switch]$Git
)

# Build arguments
$nodeArgs = @($TargetFolder)
if ($Git) {
    $nodeArgs += '--git'
}

# Run Node.js script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
node "$scriptDir\init-template.js" @nodeArgs
