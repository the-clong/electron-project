'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import '../renderer/store'
import pkg from '../../package.json'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const productName = pkg.build.productName
console.log('productName----', productName)

// eslint-disable-next-line standard/object-curly-even-spacing
global.common = { SAppName: null, mainWindow }
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: true, // 无边框
    resizable: false,
    transparent: false,
    webPreferences: {
      webSecurity: false,
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: `${__static}/icon.ico`
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 加载好html再呈现window，避免白屏-->最好将程序背景色设置为html背景色
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

// 单实例启动
const singleApp = app.requestSingleInstanceLock()
if (!singleApp) {
  app.quit()
} else {
  app.on('second-instance', (event, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })
  app.on('ready', createWindow)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
let isQuitOrClose
ipcMain.on('close', (e) => {
  if (isQuitOrClose) {
    mainWindow.close()
  } else {
    mainWindow.hide()
  }
  e.preventDefault()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('quit', (e) => {
  mainWindow.close()
  e.preventDefault()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
