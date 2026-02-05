const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    win.loadFile('index.html')
    win.maximize()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
