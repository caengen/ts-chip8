import React from 'react';
import { Loop } from "react-game-kit";
import logo from "./logo.svg";
import './App.css';
import pong from "./roms/Pong.ch8";
import Chip8Emulator from './Chip8Emulator';

function App() {
  return (
    <div className="App">
      <Loop>
        <Chip8Emulator chip8File={pong} />
      </Loop>
    </div>
  );
}

export default App;
