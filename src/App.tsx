import React from 'react';
import { Loop } from "react-game-kit";
import './App.css';
//import pong from "./roms/Pong.ch8";
import { Pong } from "./roms/Pong";
import Chip8Emulator from './Chip8Emulator';

function App() {
  return (
    <div className="App">
      <Loop>
        <Chip8Emulator chip8File={Pong} />
      </Loop>
    </div>
  );
}

export default App;
