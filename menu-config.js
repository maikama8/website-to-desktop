const { ipcMain, BrowserWindow } = require('electron');

module.exports = [
    {
        label: 'Zarachstore',
        submenu: [
            { label: 'Home', click: () => { require('./main')("home") } },
            { label: 'About Us', click: () => { require('./main')("about") } },
            { label: 'Pricing', click: openPricingPage }, // Open pricing in Electron window
            { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            { label: 'Print', click: printPage }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' },
            { role: 'zoom' }
        ]
    }
];

// Function to open Pricing page inside Electron
function openPricingPage() {
    let pricingWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: false
        }
    });

    pricingWindow.loadURL('https://zarachstore.ng/pricing');
}

// Print page method
function printPage() {
    ipcMain.emit('printPage');
}
