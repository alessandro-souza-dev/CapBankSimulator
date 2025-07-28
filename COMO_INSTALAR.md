# 🔐 INSTALAÇÃO COM SENHA - Diagrama Unifilar v2025.01.28

## 📋 Instruções de Instalação

### ✅ **Método 1: Instalação Automática com Senha**

1. **Execute o instalador**:
   ```
   Clique com botão direito em "Instalador.ps1" → "Executar com PowerShell"
   ```

2. **Digite a senha quando solicitado**:
   ```
   Senha: Solicite ao admin
   ```

3. **Aguarde a instalação**:
   - O aplicativo será instalado em `C:\Program Files\DiagramaUnifilar`
   - Atalhos serão criados no Desktop e Menu Iniciar
   - Será registrado no Painel de Controle

### ✅ **Método 2: Execução Direta (Sem Instalação)**

1. **Navegue até a pasta**:
   ```
   executavel\DiagramaUnifilar-win32-x64\
   ```

2. **Execute diretamente**:
   ```
   DiagramaUnifilar.exe
   ```

## 🔒 **Recursos de Segurança Implementados**

### ✅ **Proteção do Código**
- **DevTools desabilitado**: F12, Ctrl+Shift+I bloqueados
- **Menu de contexto bloqueado**: Botão direito desabilitado
- **Menu da aplicação removido**: Sem acesso às ferramentas de desenvolvedor
- **Atalhos de desenvolvedor bloqueados**: Ctrl+U, Ctrl+Shift+J bloqueados

### ✅ **Controle de Acesso**
- **Senha de instalação**: ` `
- **Máximo 3 tentativas**: Instalação cancelada após 3 tentativas incorretas
- **Instalação protegida**: Apenas usuários autorizados podem instalar

## 📁 **Estrutura dos Arquivos**

```
CapBankView/
├── executavel/
│   └── DiagramaUnifilar-win32-x64/
│       ├── DiagramaUnifilar.exe          ← Executável principal
│       ├── Desinstalar.ps1               ← Script de desinstalação
│       ├── resources/                    ← Recursos da aplicação
│       └── [outros arquivos do Electron]
├── Instalador.ps1                        ← Script de instalação com senha
└── COMO_INSTALAR.md                      ← Este arquivo
```

## 🚀 **Distribuição**

### **Para distribuir a aplicação:**

1. **Comprima a pasta completa**:
   ```
   Criar ZIP com:
   - executavel/DiagramaUnifilar-win32-x64/
   - Instalador.ps1
   - COMO_INSTALAR.md
   ```

2. **Instrua o usuário final**:
   - Extrair o ZIP
   - Executar `Instalador.ps1`
   - Digitar a senha: ` `

## ⚙️ **Desinstalação**

### **Método 1: Pelo Painel de Controle**
1. Painel de Controle → Programas → Desinstalar um programa
2. Localizar "Diagrama Unifilar - Banco de Capacitores"
3. Clicar em "Desinstalar"

### **Método 2: Script de Desinstalação**
1. Navegar até a pasta de instalação
2. Executar `Desinstalar.ps1`

## 🔧 **Solução de Problemas**

### **Erro: "Execução de scripts está desabilitada"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Erro: "Senha incorreta"**
- Verificar se está digitando: ` `
- Atenção para maiúsculas/minúsculas
- Verificar se não há espaços extras

### **Aplicação não abre**
- Verificar se todos os arquivos estão na pasta
- Executar como Administrador
- Verificar antivírus (pode estar bloqueando)

## 📞 **Suporte**

- **Versão**: 2025.01.28
- **Desenvolvedor**: Alessandro
- **Tipo**: Aplicação Electron standalone

---

## 🎯 **Resumo Rápido**

1. **Execute**: `Instalador.ps1`
2. **Digite**: ` `
3. **Aguarde**: Instalação automática
4. **Use**: Atalho no Desktop ou Menu Iniciar

**✅ Aplicação protegida e pronta para uso!**
