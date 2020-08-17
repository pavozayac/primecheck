const {ipcRenderer, desktopCapturer} = require('electron')
const Jimp = require('jimp')
//const tess = require('tesseract.js')

let config
require('./config').getConfig((err,val)=>{
  if (err ) return ipcRenderer.send('errors', err)
  config = val
})



ipcRenderer.on('scan' , ()=>{   

  desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize:{width: 1920, height: 1080} }).then(sources=>{
    sources.forEach((source) => {
      const sourceName = source.name.toLowerCase()
      if (sourceName === 'entire screen' || sourceName === 'screen 1') {
        let screen = source.thumbnail.toPNG()

        Jimp.read(screen, (err, val)=>{   
          const rect = config.rectangles.res1080
          if (err) ipcRenderer.send('errors', err);
          
          val.crop(rect.initial.x, rect.initial.y, rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).resize(rect.final.x-rect.initial.x, rect.final.y-rect.initial.y).contrast(1).greyscale().write(`./img.png`, (err)=>{
            if (err) ipcRenderer.send('errors', err);              
          }) 
          ipcRenderer.send('scanned', 'bruh')
        })
        //})
        
      }
  })}).catch(err=>{
    ipcRenderer.send('errors', err)
  })
})


/*async function rec(){
    ipcRenderer.send('errors', 'bruh')
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm ',
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT
    })

     value = await worker.recognize(`./img.png`)
     ipcRenderer.send('errors', JSON.stringify(value))
     ipcRenderer.send('errors', value.data.text.toLowerCase())  
}*/