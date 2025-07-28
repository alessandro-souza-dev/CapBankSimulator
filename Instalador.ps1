# Instalador com Senha - Diagrama Unifilar v2025.01.28
# Script de instalacao que solicita senha antes de instalar

param(
    [string]$DestinationPath = "$env:USERPROFILE\DiagramaUnifilar"
)

# Configuracoes
$SENHA_CORRETA = "@Data2025"
$APP_NAME = "Diagrama Unifilar - Banco de Capacitores"
$VERSION = "2025.01.28"
$SOURCE_FOLDER = "executavel\DiagramaUnifilar-win32-x64"

# Funcao para solicitar senha
function Request-Password {
    $senha = Read-Host -Prompt "Digite a senha para instalar o $APP_NAME" -AsSecureString
    $senhaTexto = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha))
    return $senhaTexto
}

# Funcao para criar atalhos
function Create-Shortcuts {
    param($InstallPath)

    $WshShell = New-Object -comObject WScript.Shell

    # Atalho no Desktop
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    $Shortcut = $WshShell.CreateShortcut("$DesktopPath\Diagrama Unifilar.lnk")
    $Shortcut.TargetPath = "$InstallPath\DiagramaUnifilar.exe"
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.Description = $APP_NAME
    $Shortcut.Save()

    # Atalho no Menu Iniciar
    $StartMenuPath = [Environment]::GetFolderPath("StartMenu")
    $Shortcut = $WshShell.CreateShortcut("$StartMenuPath\Programs\Diagrama Unifilar.lnk")
    $Shortcut.TargetPath = "$InstallPath\DiagramaUnifilar.exe"
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.Description = $APP_NAME
    $Shortcut.Save()
}

# Inicio do script
Clear-Host
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    INSTALADOR - $APP_NAME" -ForegroundColor Yellow
Write-Host "    Versao: $VERSION" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a pasta fonte existe
if (-not (Test-Path $SOURCE_FOLDER)) {
    Write-Host "ERRO: Pasta '$SOURCE_FOLDER' nao encontrada!" -ForegroundColor Red
    Write-Host "Certifique-se de que este script esta na mesma pasta que '$SOURCE_FOLDER'" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Solicitar senha
$tentativas = 0
$maxTentativas = 3

do {
    $tentativas++
    Write-Host "Tentativa $tentativas de $maxTentativas" -ForegroundColor Yellow
    $senhaDigitada = Request-Password

    if ($senhaDigitada -eq $SENHA_CORRETA) {
        Write-Host "Senha correta! Iniciando instalacao..." -ForegroundColor Green
        break
    } else {
        Write-Host "Senha incorreta!" -ForegroundColor Red
        if ($tentativas -lt $maxTentativas) {
            Write-Host "Tente novamente." -ForegroundColor Yellow
        }
    }
} while ($tentativas -lt $maxTentativas)

if ($tentativas -eq $maxTentativas -and $senhaDigitada -ne $SENHA_CORRETA) {
    Write-Host ""
    Write-Host "INSTALACAO CANCELADA: Numero maximo de tentativas excedido." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Prosseguir com a instalacao
Write-Host ""
Write-Host "Instalando em: $DestinationPath" -ForegroundColor Cyan

try {
    # Criar diretorio de destino
    if (-not (Test-Path $DestinationPath)) {
        New-Item -ItemType Directory -Path $DestinationPath -Force | Out-Null
        Write-Host "Diretorio criado: $DestinationPath" -ForegroundColor Green
    }

    # Copiar arquivos
    Write-Host "Copiando arquivos..." -ForegroundColor Yellow
    Copy-Item -Path "$SOURCE_FOLDER\*" -Destination $DestinationPath -Recurse -Force
    Write-Host "Arquivos copiados com sucesso!" -ForegroundColor Green

    # Criar atalhos
    Write-Host "Criando atalhos..." -ForegroundColor Yellow
    Create-Shortcuts -InstallPath $DestinationPath
    Write-Host "Atalhos criados!" -ForegroundColor Green

    # Registrar no registro (opcional)
    $regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\DiagramaUnifilar"
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
        Set-ItemProperty -Path $regPath -Name "DisplayName" -Value $APP_NAME
        Set-ItemProperty -Path $regPath -Name "DisplayVersion" -Value $VERSION
        Set-ItemProperty -Path $regPath -Name "Publisher" -Value "Alessandro"
        Set-ItemProperty -Path $regPath -Name "InstallLocation" -Value $DestinationPath
        Set-ItemProperty -Path $regPath -Name "UninstallString" -Value "powershell.exe -File `"$DestinationPath\Desinstalar.ps1`""
        Write-Host "Registrado no sistema!" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "    INSTALACAO CONCLUIDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O aplicativo foi instalado em:" -ForegroundColor White
    Write-Host "$DestinationPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Atalhos criados:" -ForegroundColor White
    Write-Host "Desktop: Diagrama Unifilar.lnk" -ForegroundColor Yellow
    Write-Host "Menu Iniciar: Diagrama Unifilar.lnk" -ForegroundColor Yellow
    Write-Host ""

    $resposta = Read-Host "Deseja executar o aplicativo agora? (S/N)"
    if ($resposta -eq "S" -or $resposta -eq "s") {
        Start-Process "$DestinationPath\DiagramaUnifilar.exe"
    }

} catch {
    Write-Host ""
    Write-Host "ERRO durante a instalacao:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Instalacao finalizada. Pressione Enter para sair." -ForegroundColor Green
Read-Host
