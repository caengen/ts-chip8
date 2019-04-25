import React from 'react';
import { Loop } from "react-game-kit";
import logo from "./logo.svg";
import './App.css';
import pong from "./roms/Pong.ch8";
import Chip8Emulator from './Chip8Emulator';

function App() {
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
      <Loop>
        <Chip8Emulator chip8File={pong} />
      </Loop>
    </div>
  );
}

export default App;
