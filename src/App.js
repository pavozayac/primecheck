import React from 'react';
import './css/App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import 'axios'

const electron = window.require('electron')

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      msg: "bruh",
      items: [
        {item_name: "kek", orders: [{username: "niggollo", price: 2}, {username: "crack_dealer", price: 90}]},
        {item_name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", orders: [
          {username: "niggollo", price: 2}, 
          {username: "crack_dealer", price: 90},
          {username: "crack_dealer", price: 2},
          {username: "crack_dealer", price: 90},
          {username: "crack_dealer", price: 90},
          {username: "crack_dealer", price: 90}
        ]}
      ],
      query: '',
      suggestions: []
    }
  }
  
  submit = () => {
    electron.ipcRenderer.send('orders', this.state.query)
    this.search.value = ''
    this.setState({
      query: '',
      suggestions: []
    })
  }

  handleInputChange = () =>{
    if (this.search.value.length > 1){
      this.setState({
        query: this.search.value.toLowerCase()
      })
      electron.ipcRenderer.send('getSearch', this.state.query)
    } else {
      this.setState({
        query: '',
        suggestions: []
      })
    }
  }

  chooseSuggetion = (index) => {
    this.setState({
      query: this.state.suggestions[index].item.item_name
    }, ()=>{
      this.submit()
    })
  }

  componentDidMount(){
    electron.ipcRenderer.on('bruh', (ev, arg)=>{
      this.setState({
        msg: arg
      })
    })
    electron.ipcRenderer.on('items', (ev, arg)=>{
      let items = this.state.items
      items.push({
        item_name: arg.item_name,
        orders: arg.orders.slice(0,7)
      })
      this.setState({
        msg: this.state.msg,
        items: items
      })
    })

    electron.ipcRenderer.on('searched', (ev,arg)=>{
      this.setState({
        suggestions: arg
      })
    })
  }

  render(){
    return (
      <div className="App">        
          <div className="section">
              <div className="box" style={{padding: "0.5rem"}}>
                <div className="field">
                  <p className="control has-icons-right">
                    <input ref={input => this.search = input} onChange={this.handleInputChange} onSubmit={this.submit} className="input" type="text" placeholder="Search"/>
                    <span className="icon is-right">
                      <FontAwesomeIcon icon={faSearch} color="grey"/>
                    </span>                  
                  </p>
                </div>
              </div>

              <div className="list">
                {this.state.suggestions.map((value, index)=>(
                  <div key={index} className="list-item capitalLetters" onClick={()=>{this.chooseSuggetion(index)}}>{value.item.item_name}</div>
                ))}
              </div>
              
              <div className="columns is-mobile is-vcentered">
                <div className="column is-4-desktop is-4-mobile is-4-tablet is-4-fullhd is-4-widescreen"><div className="box">Name</div></div>
                <div className="column is-8-desktop is-8-mobile is-8-tablet is-8-fullhd is-8-widescreen"><div className="box">Prices</div></div>
              </div>
              
              {this.state.items.map(value=>(
                <div className="box">
                  <div className="columns is-mobile is-vcentered">
                    <div className="column is-4-desktop is-4-mobile is-4-tablet is-4-fullhd is-4-widescreen is-narrow capitalLetters" key={value.item_name}><abbr title={value.item_name}><p className="text-overflow">{value.item_name}</p></abbr></div>
                    {value.orders.map(order=>(
                      <div className="column is-narrow is-1-desktop is-1-mobile is-1-tablet is-1-fullhd is-1-widescreen has-text-centered" key={order.username}>{order.price}</div>
                    ))}                  
                  </div>
                </div>
              ))}         
              
          </div>       
      </div>
    );
  }
}

export default App;
