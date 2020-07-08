'use strict';

const {ipcRenderer, desktopCapturer} = require('electron')
const Jimp = require('jimp')
const tess = require('tesseract.js')

let config
require('./config').getConfig((err,val)=>{
  if (err ) return ipcRenderer.send('errors', err)
  config = val
})

const worker = tess.createWorker()

document.addEventListener('mousedown' , ev=>{   

  desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize:{width: 1920, height: 1080} }).then(sources=>{
    sources.forEach((source) => {
      const sourceName = source.name.toLowerCase()
      if (sourceName === 'entire screen' || sourceName === 'screen 1') {
        let screen = source.thumbnail.toPNG()

        config.rectangles.res1080.four.forEach((rect, ind)=>{
          Jimp.read(screen, (err, val)=>{           
            if (err) ipcRenderer.send('errors', err);
            
            val.crop(rect.initial.x, rect.initial.y, rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).resize(rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).contrast(1).greyscale().write(`./img${ind}.png`, (err)=>{
              if (err) ipcRenderer.send('errors', err);              
            }) 
          })
        })
        rec(0, config.rectangles.res1080.four.length) 
      }
    })
  }).catch(err=>{
    ipcRenderer.send('errors', err)
  })

  
})


async function rec(start, lim){
  if (start < lim){
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm ',
      preserve_interword_spaces: '1'
    })

    worker.recognize(`./img${start}.png`).then(value=>{
      ipcRenderer.send('orders', value.data.text.toLowerCase())
      rec(start+1, lim)
    })
  }
}