// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Cria a janela do navegador.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Opcional, mas boa prática
      nodeIntegration: true, // Necessário se seus scripts JS usarem 'require'
      contextIsolation: false
    },
    icon: path.join(__dirname, 'app/assets/logo.png') // Adiciona o ícone
  });

  // Carrega o index.html da sua aplicação.
  mainWindow.loadFile('app/index.html');

  // Opcional: Abre as Ferramentas de Desenvolvedor.
  // mainWindow.webContents.openDevTools();
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