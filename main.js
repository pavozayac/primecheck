const { app, BrowserWindow, screen, globalShortcut } = require('electron')


function createWindow () {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize
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
    y: height/2-300,
    show: false,
    shown: false
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  globalShortcut.register('Ctrl+Alt+`', ()=>{
    if (win.shown){
      win.hide()
      win.shown = false
    } else {
      win.show()
      win.shown = true
    }
  })
}

app.whenReady().then(createWindow)
