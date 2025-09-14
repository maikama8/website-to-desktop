// WebToDesk v2.1.0
// Olalekan (Zarachtech)
// zarachtech@gmail.com

const {app, BrowserWindow, nativeTheme, ipcMain, Menu, dialog} = require('electron')
const path = require('path')
const MainMenuapp = require('./menu-config')
const RightMenuapp = require('./right-menu-config')
const PrintOptions = require('./print-option.js') // Using your print-option.js
const appConfig = require('./config')

let mainWindow;

// Menu
const mainMenu = Menu.buildFromTemplate(MainMenuapp);
const rightMenu = Menu.buildFromTemplate(RightMenuapp);

function createWindow () {
  mainWindow = new BrowserWindow({
    width: appConfig['width'],
    height: appConfig['height'],
    minWidth: appConfig['minWidth'],
    minHeight: appConfig['minHeight'],
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Secure settings are important
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Set a more common user agent to prevent website compatibility issues
  mainWindow.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36");

  Menu.setApplicationMenu(mainMenu);

  mainWindow.webContents.on('context-menu', e => {
    rightMenu.popup(mainWindow);
  });

  loadWebContent();

  const contents = mainWindow.webContents;

  // --- START: MORE AGGRESSIVE LOADER LOGIC ---
  let loaderTimeout;

  const showLoader = (url) => {
    console.log(`Loader Shown - Navigating to: ${url}`);
    if (contents && !contents.isDestroyed()) contents.send('show-loader');

    // Safety Net: If loading takes more than 10 seconds, hide the loader
    clearTimeout(loaderTimeout); // Clear previous timeout
    loaderTimeout = setTimeout(() => {
        console.warn('Loader timeout reached. Forcing hide.');
        hideLoader('TIMEOUT');
    }, 10000); // Shortened timeout to 10 seconds
  };

  const hideLoader = (reason) => {
    // Check if the timeout is still pending and clear it
    if (loaderTimeout) {
        clearTimeout(loaderTimeout);
        loaderTimeout = null;
    }
    console.log(`Loader Hidden - Reason: ${reason}`);
    if (contents && !contents.isDestroyed()) contents.send('hide-loader');
  };

  // When navigation starts, show the loader
  contents.on('did-start-navigation', (event, url, isInPlace, isMainFrame) => {
    // Only trigger for the main frame, not for iframes etc.
    if (isMainFrame) {
        showLoader(url);
    }
  });

  // HIDE LOADER on any of these events. The first one to fire wins.
  contents.on('dom-ready', () => {
    hideLoader('DOM Ready');
  });

  contents.on('did-finish-load', () => {
    hideLoader('Did Finish Load');
  });
  
  contents.on('page-title-updated', (event, title) => {
    hideLoader(`Page Title Updated: ${title}`);
  });

  contents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) {
        console.error(`Navigation failed: ${errorDescription}`);
        hideLoader(`Failed Load (${errorCode})`);
    }
  });
  // --- END: MORE AGGRESSIVE LOADER LOGIC ---
}


function loadWebContent() {
  mainWindow.loadFile(path.join(__dirname, 'public/loading.html'));

  let wc = mainWindow.webContents;

  wc.once('did-finish-load' , () => {
    mainWindow.loadURL(appConfig['websiteUrl']);
  });

  wc.on('did-fail-provisional-load', (error, code)=> {
    mainWindow.loadFile(path.join(__dirname, 'public/offline.html'));
  });
}

ipcMain.on('online-status-changed', (event, status) => {
  if(status == true) { loadWebContent(); }
});

// Re-instated your original print logic
ipcMain.on('printPage', () => {
  let win = BrowserWindow.getFocusedWindow();
  if (win) {
      win.webContents.print(PrintOptions, (success, failureReason) => {
          if (!success) {
              dialog.showMessageBox(mainWindow, {
                  message: failureReason.charAt(0).toUpperCase() + failureReason.slice(1),
                  type: "error",
                  buttons: ["Cancel"],
                  title: "Print Error",
              });
          }
      });
  }
});

// Handle config requests from preload script
ipcMain.handle('get-config', () => {
    return {
        appName: appConfig.appName,
        hideElementsId: appConfig.hideElementsId,
        hideElementsClass: appConfig.hideElementsClass
    };
});


module.exports = (pageId) => {
  if(pageId === 'home') {
    loadWebContent();
  } else {
    mainWindow.loadFile(path.join(__dirname, `public/${pageId}.html`));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

