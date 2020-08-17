const fs = require('fs')
const path = require('path')

function getConfig(cb){
    fs.readFile(path.join(__dirname, 'config.json'), (err, fd)=>{
        if (err) return cb(err, null)
        return cb(null, JSON.parse(fd))
    })
}

module.exports = {
    getConfig: getConfig
}