const axios = require('axios')
const fs = require('fs')
const Fuse = require('fuse.js')

function update(){
    let list = [];
    axios.get('https://api.warframe.market/v1/items').then(res=>{
      res.data.payload.items.forEach(element => {
        list.push({item_name: element.item_name.toLowerCase(), url_name: element.url_name, id: element.id});
      });
      let data = JSON.stringify(list)
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

function getOrders(itemName){
    let {item} = getOne(itemName)
    if (item === undefined || item.url_name === undefined){
        return new Promise((resolve, reject)=>{
            reject('Could not scan item name.')
        })
    }
    let list = {
        item_name: itemName,
        url_name: item.url_name,
        orders: []
    }
    return new Promise((resolve, reject)=>{        
        axios.get(`https://api.warframe.market/v1/items/${item.url_name}/orders?include=item`).then(res=>{
            res.data.payload.orders.forEach(order=>{
                if (order.user.status == 'ingame' && order.order_type == 'sell' && order.visible == true){
                    //console.log(order.user.ingame_name + ': ' + order.platinum)
                    list.orders.push({
                        username: order.user.ingame_name,
                        price: order.platinum,
                        quantity: order.quantity
                    })
                }
            })
            list.orders.sort((a, b)=>{
                return a.price - b.price    
            })        //console.log(list)   
            return resolve(list)

        }).catch(err=>{
            console.log(err)
            return reject(err)
        })
    })
}

module.exports = {
    update: update,
    readAll: readAll,
    getOne: getOne,
    getOrders: getOrders
}