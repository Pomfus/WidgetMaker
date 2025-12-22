
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    title: "IPS Ticker Widget Builder",
    backgroundColor: '#020617',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Necessary for loading local CSV files and Babel scripts
    }
  });

  // Remove the default menu bar for a cleaner "App" feel
  win.setMenuBarVisibility(false);

  // Load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools if needed for debugging
  // win.webContents.openDevTools();
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
