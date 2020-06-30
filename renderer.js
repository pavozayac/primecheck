const {ipcRenderer} = require('electron')

h1 = document.getElementById('text')

h1.addEventListener('mousedown' , ev=>{    
    let x = ev.screenX
    let y = ev.screenY
    document.addEventListener('mouseup', ev2=>{
        let x2 = ev2.screenX
        let y2 = ev2.screenY
        ipcRenderer.send('bruvva', [x, y, x2, y2])
    })
    document.removeEventListener('mouseup')
})