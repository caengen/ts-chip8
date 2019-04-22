import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chip8 from './Chip8';
const pong = require("./roms/Pong.ch8");

class App extends Component {
  render() {
    const chip8 = new Chip8();
    chip8.loadGame(pong);
    chip8.dissassemble();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
