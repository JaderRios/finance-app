const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('disable-http-cache');

function createWindow() {
  const win = new BrowserWindow({
    width: 1480,
    height: 920,
    minWidth: 1280,
    minHeight: 800,
    backgroundColor: '#f5f7fb',
    title: 'FinanzasApp',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.removeMenu();

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    win.loadURL(devServerUrl);
    return;
  }

  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
