import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Tooltip from './tooltip'

class App extends Component {
  state = {
    tipActive: false
  }

  render () {
    console.log('tipActive', this.state.tipActive)
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            ref={c => this.tipRef = c}
            onClick={() => this.setState({ tipActive: !this.state.tipActive })}
            onMouseEnter={() => this.setState({ tipActive: true })}
            onMouseLeave={() => this.setState({ tipActive: false })}
          />
          <Tooltip
            active={this.state.tipActive}
            parent={this.tipRef}
            position='left'
            tipStyle={{color: 'red'}}
          >
            <div>Left!</div>
          </Tooltip>
          <Tooltip
            active={this.state.tipActive}
            parent={this.tipRef}
            position='bottom'
          >
            <div>Bottom!</div>
          </Tooltip>
          <Tooltip
            active={this.state.tipActive}
            parent={this.tipRef}
            position='right'
          >
            <div>Right!</div>
          </Tooltip>
          <Tooltip
            active={this.state.tipActive}
            parent={this.tipRef}
            position='top'
          >
            <div>Top!</div>
          </Tooltip>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
