const { app, BrowserWindow, screen, globalShortcut, ipcMain } = require('electron')
const netapi = require('./netapi')
const path = require('path')

/*let config
require('./config.js').getConfig((err,val)=>{
  if (err ) return ipcRenderer.send('errors', err)
  config = val
})*/

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
    show: true,
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
    frame: true,
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
      console.log('shown')
      selection.webContents.send('scan', 'any')
      /*selection.webContents.capturePage().then(img=>{
        Jimp.read(screen, (err, val)=>{   
          const rect = config.rectangles.res1080
          if (err) ipcRenderer.send('errors', err);
          
          val.crop(rect.initial.x, rect.initial.y, rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).resize(rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).contrast(1).greyscale().write(`./img.png`, (err)=>{
            if (err) ipcRenderer.send('errors', err);              
          }) 
        })
      })*/
      win.webContents.send('bruh', 'one')
      console.log('working')
    })    
  })

  win.on('hide', ()=>{
    globalShortcut.unregister('4', ()=>{
      selection.webContents.send('scan', 'any')
      win.webContents.send('bruh', 'one')
    })    
  })

  ipcMain.on('scanned', (ev, arg)=>{
    console.log('bruh')
    let tess = require('child_process').spawn('tesseract', ["img.png", "-", "--psm", "11"])
    
    tess.stderr.on('data', data=>win.webContents.send('bruh', data))
    tess.stdout.on('data', (data)=>{
      console.log(data.toString('utf-8'))
      data.toString('utf-8').split(/\r?\n/).forEach(line=>{
        let search = netapi.getOne(line)
        if (search !== undefined && search !== null && search.score < 1e-4){
          netapi.getOrders(search.item.item_name).then(list=>{
            console.log(list)
            win.webContents.send('items', list)
          }).catch(err=>{
            console.log(err)
          })
        }
      })
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

  ipcMain.on('errors', (ev, arg)=>{
    console.log(`Error: ${arg}`)
    win.webContents.send('bruh', arg)
  })  

  ipcMain.on('orders', (ev, arg)=>{
    console.log(arg)
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

  win.loadFile(path.join(__dirname, 'index.html'))
  selection.loadFile(path.join(__dirname, 'selection.html'))

  win.setPosition(0, 0, false)

  //getAll()
}

app.whenReady().then(createWindow)


