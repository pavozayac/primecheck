const { app, BrowserWindow, screen, globalShortcut, ipcMain } = require('electron')
const netapi = require('./netapi')
require('v8-compile-cache')

function createWindow () {
  const {sWidth, sHeight} = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  let win = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: true,
    movable: false,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    alwaysOnTop: true,
    thickFrame: false,
    show: false,
    transparent: true,
    skipTaskbar: true,
    center: false,

    
    //focusable: false
  })
  
  let selection = new BrowserWindow({
    focusable: false,
    width: 0,
    height: 0,
    webPreferences:{
      nodeIntegration: true
    },
    parent: win,
    show: false,
    fullscreen: true,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true
  })

  
  globalShortcut.register('Ctrl+Alt+`', ()=>{
    if (win.isVisible() && win.isFocused()){
      win.hide()
    } else {
      win.show()
    }
  })
  

  win.on('show', ()=>{
    globalShortcut.register('4', ()=>{
      selection.webContents.send('scan', 'any')
      win.webContents.send('bruh', 'one')
    })    
  })

  win.on('hide', ()=>{
    globalShortcut.unregister('4', ()=>{
      selection.webContents.send('scan', 'any')
      win.webContents.send('bruh', 'one')
    })    
  })
  

  /*globalShortcut.register('5', ()=>{
    netapi.getOrders('acid').then(res=>{
      win.webContents.send('items', res)
    })

  })*/

  /*Mousetrap.bind('ctrl+alt+`', ()=>{
    netapi.getOrders('acid').then(res=>{
      win.webContents.send('items', res)
    })
  }, 'keyup')*/

  win.loadURL('http://localhost:3000')
  selection.loadFile('selection.html')

  ipcMain.on('errors', (ev, arg)=>{
    console.log(`Error: ${arg}`)
  })  

  ipcMain.on('orders', (ev, arg)=>{
    netapi.getOrders(arg).then(list=>{
      console.log(list)
      win.webContents.send('items', list)
    }).catch(err=>{
      console.log(err)
    })
  })

  ipcMain.on('getSearch', (ev, arg)=>{
    console.log(arg)
    win.webContents.send('searched', netapi.getMany(arg)) 
  })

  win.setPosition(0, 0, false)

  //getAll()
}

app.whenReady().then(createWindow)


