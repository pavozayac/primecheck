const {ipcRenderer, desktopCapturer} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { toNamespacedPath } = require('path')

canvas = document.getElementById('mycanvas')
context = canvas.getContext('2d')
context.fillStyle = 'gold'
context.strokeStyle = 'gold'
context.lineWidth = 2
canvas.style.position = 'fixed'
moving = false

canvas.addEventListener('mousedown' , ev=>{    
    let x = ev.clientX
    let y = ev.clientY
    moving = true

    canvas.addEventListener('mousemove', ev1=>{
        if(moving){
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.strokeRect(x, y, ev1.screenX-x, ev1.screenY-y)
        }
    })

    canvas.addEventListener('mouseup', ev2=>{
        moving = false
        let x2 = ev2.screenX
        let y2 = ev2.screenY
        ipcRenderer.send('bruvva', [x, y, x2, y2])
        context.clearRect(0, 0, canvas.width, canvas.height)
        desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize:{width: 1920, height: 1080} }).then(sources=>{
            sources.forEach((source) => {
              const sourceName = source.name.toLowerCase()
              if (sourceName === 'entire screen' || sourceName === 'screen 1') {
                const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
        
                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                  if (error) return console.log(error)
                  shell.openExternal(`file://${screenshotPath}`)
                })
              }
            })
          }).catch(err=>{
            console.log(err)
          })
        })    
})
