const fs = require('fs')

function getConfig(cb){
    fs.readFile('./config.json', (err, fd)=>{
        if (err) return cb(err, null)
        return cb(null, JSON.parse(fd))
    })
}

module.exports = {
    getConfig: getConfig
}