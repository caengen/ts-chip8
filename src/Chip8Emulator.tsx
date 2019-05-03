import React, { Ref } from 'react';
import PropTypes from "prop-types";
import Chip8 from './Chip8';
import "./Chip8Emulator.css";
import History from './History';

export interface IChip8EmulatorProps {
  chip8File: number[];
}

export interface IChip8EmulatorState {
  fps: number;
  fpsCount: number;
  fpsTimer: number;
  gfx?: Uint8Array;
  updateTimestamp: number;
  lastInstruction?: string;
  instructionHistory: string[];
  paused?: boolean;
}

export default class Chip8Emulator extends React.Component<IChip8EmulatorProps, IChip8EmulatorState> {
  private chip8: Chip8;
  private canvasRef: any;
  static contextTypes = {
    loop: PropTypes.object,
  };

  private static MaxFps = 10;


  constructor(props: IChip8EmulatorProps) {
    super(props);

    this.chip8 = new Chip8({
      updateGfx: this.updateGfx,
      updateLastInstruction: this.updateLastInstruction
    });
    this.chip8.debug = false;
    this.chip8.loadGame(props.chip8File);
    this.state = {
      updateTimestamp: Date.now(),
      fps: 0,
      fpsTimer: 1000,
      fpsCount: 0,
      gfx: undefined,
      instructionHistory: []
    }
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    if (this.state.paused) {
      return;
    }

    const now = Date.now();

    if ((now - this.state.updateTimestamp) > (1000 / Chip8Emulator.MaxFps)) {
      let fpsCount = this.state.fpsCount + 1;
      let fps = this.state.fps;
      let fpsTimer = this.state.fpsTimer;
      if (now - this.state.fpsTimer >= 1000) {
        fps = this.state.fpsCount;
        fpsTimer = now;
        fpsCount = 0;
      }

      this.chip8.emulateCycle();
      this.setState({
        updateTimestamp: now,
        fpsTimer,
        fpsCount,
        fps
      });      
    }

  }

  updateGfx = (gfx: Uint8Array) => this.setState({ gfx });
  updateFps = (fps: number) => this.setState({ fps });
  updateLastInstruction = (lastInstruction: string) => {
    if (this.state.lastInstruction) {
      this.setState({ instructionHistory: this.state.instructionHistory.concat(this.state.lastInstruction) });
    }
    this.setState({ lastInstruction });
  }
  pauseEmulation = () => this.setState({ paused: !this.state.paused })

  componentDidUpdate() {
    console.log("Component did update!")
    if (this.chip8.drawFlag && this.state.gfx && this.state.gfx.length) {
      const ctx = this.canvasRef.getContext('2d');
      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          if (this.state.gfx[x + (y * 64)] === 1) {
            ctx.fillRect(x, y, 1, 1);
            console.log("filling rect");
          }
        }
      }
      this.chip8.drawFlag = false;
    }
  }

  render() {
    return (
      <div className="emulator">
        Chip 8 emulator | Fps/max: {this.state.fps} / {Chip8Emulator.MaxFps}
        <div>
          <button onClick={this.pauseEmulation}>{this.state.paused ? "Resume emulation" : "Pause emulation"}</button>
        </div>
        <canvas className="emulator-canvas" ref={canvas => this.canvasRef = canvas} width={64} height={32} />
        {this.chip8.debug && <>
          Last executed instruction: <code>{this.state.lastInstruction}</code>
          <History history={this.state.instructionHistory} />
        </>}
      </div>
    );
  }
}
