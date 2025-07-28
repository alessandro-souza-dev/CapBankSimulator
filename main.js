// main.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
  // Cria a janela do navegador.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Opcional, mas boa prática
      nodeIntegration: true, // Necessário se seus scripts JS usarem 'require'
      contextIsolation: false,
      devTools: false // DESABILITA as ferramentas de desenvolvedor
    },
    icon: path.join(__dirname, 'assets/logo.png') // Adiciona o ícone
  });

  // Remove o menu padrão que contém as opções de desenvolvedor
  mainWindow.setMenuBarVisibility(false);

  // Carrega o index.html da sua aplicação.
  mainWindow.loadFile('index.html');

  // BLOQUEIA tentativas de abrir DevTools via atalhos
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Bloqueia F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (input.key === 'F12' ||
        (input.control && input.shift && (input.key === 'I' || input.key === 'J')) ||
        (input.control && input.key === 'U')) {
      event.preventDefault();
    }
  });

  // BLOQUEIA menu de contexto (botão direito)
  mainWindow.webContents.on('context-menu', (event) => {
    event.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Crie um arquivo preload.js vazio por enquanto, é uma boa prática de segurança do Electron
// (Não é estritamente necessário para este caso, mas evita erros)