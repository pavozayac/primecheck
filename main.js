const { app, BrowserWindow, screen, globalShortcut, ipcMain } = require('electron')

function createWindow () {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize
  let shown = false
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    alwaysOnTop: true,
    thickFrame: false,
    x: 0,
    y: height/2,
    show: false,
    transparent: true
  })
  
  let selection = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true
    },
    parent: win,
    show: false,
    fullscreen: true,
    opacity: 1,
    backgroundColor: '#ffffff'
  })

  globalShortcut.register('Ctrl+Alt+`', ()=>{
    if (shown){
      win.hide()
      selection.hide()
      shown = false
    } else {
      win.show()
      selection.show()
      shown = true
    }
  })

  win.loadFile('index.html')
  selection.loadFile('selection.html')

  ipcMain.on('bruvva', (ev, arg)=>{
    console.log(`${ev}, ${arg}`)
  })
}

app.whenReady().then(createWindow)


