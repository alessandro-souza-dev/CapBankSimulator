; installer.nsh

!macro customInstall
  ; Cria uma nova página no instalador
  Page custom PedeSenha "" ": Verificação de Senha"
!macroend

!macro PedeSenha
  ; Exibe a página que pede a senha
  nsDialogs::Create 1018
  Pop $Dialog
  ${If} $Dialog == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 12u "Por favor, insira a senha para continuar a instalação:"
  Pop $0
  
  ${NSD_CreatePassword} 0 13u 100% 12u ""
  Pop $SenhaInput

  nsDialogs::Show
  
  Pop $0
  ${If} $0 == "back"
    Abort
  ${EndIf}

  ${NSD_GetText} $SenhaInput $R0
  
  ; VERIFICA A SENHA AQUI
  ${If} $R0 != "@Data2025"
    MessageBox MB_OK|MB_ICONSTOP "Senha incorreta!"
    ; Volta para a mesma página para tentar de novo
    !insertmacro PedeSenha
  ${EndIf}
!macroend