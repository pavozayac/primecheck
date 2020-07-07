const axios = require('axios')
const fs = require('fs')
const Fuse = require('fuse.js');
const { get } = require('http');

function update(){
    let list = [];
    axios.get('https://api.warframe.market/v1/items').then(res=>{
      res.data.payload.items.forEach(element => {
        list.push({item_name: element.item_name.toLowerCase(), url_name: element.url_name, id: element.id});
      });
      let data = JSON.stringify(list);
      fs.writeFileSync('./all_items.json', data)
    });
}

function readAll(){
    return JSON.parse(fs.readFileSync('./all_items.json'))
}

function getOne(searchStr){
    const options = {
        includeScore: true,
        keys: ['item_name']
    }
    const fuse = new Fuse(readAll(), options)
    return fuse.search(searchStr)[0]
}

module.exports = {
    update: update,
    readAll: readAll,
    getOne: getOne
}