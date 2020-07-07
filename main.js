const { app, BrowserWindow, screen, globalShortcut, ipcMain } = require('electron')
const netapi = require('./netapi')

function createWindow () {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize
  let shown = false
  // Create the browser window.
  let win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    alwaysOnTop: true,
    thickFrame: false,
    x: 0,
    y: height/2,
    show: false,
    transparent: false
  })
  
  let selection = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true
    },
    parent: win,
    show: false,
    fullscreen: true,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true
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

  ipcMain.on('errors', (ev, arg)=>{
    console.log(`Error: ${arg}`)
  })  

  ipcMain.on('logging', (ev, arg)=>{
    console.log(`Log: ${arg}`)
    netapi.getOrders('paris prime lower limb').then(list=>{
      console.log(list)
    }).catch(err=>{
      console.log(err)
    })
  })  

  //getAll()
}

app.whenReady().then(createWindow)


