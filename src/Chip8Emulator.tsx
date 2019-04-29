import React, { Ref } from 'react';
import PropTypes from "prop-types";
import Chip8 from './Chip8';
import "./Chip8Emulator.css";

export interface IChip8EmulatorProps {
  chip8File: string;
}

export interface IChip8EmulatorState {
  fps: number;
  fpsCount: number;
  fpsTimer: number;
  gfx?: Uint8Array;
  updateTimestamp: number;
}

export default class Chip8Emulator extends React.Component<IChip8EmulatorProps, IChip8EmulatorState> {
  private chip8: Chip8;
  private canvasRef: any;
  static contextTypes = {
    loop: PropTypes.object,
  };

  constructor(props: IChip8EmulatorProps) {
    super(props);

    this.chip8 = new Chip8(this.updateGfx, this.updateFps);
    this.chip8.debug = true;
    this.chip8.loadGame(props.chip8File);
    this.state = {
      updateTimestamp: Date.now(),
      fps: 0,
      fpsTimer: 1000,
      fpsCount: 0,
      gfx: undefined
    }
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const now = Date.now();

    console.log(`(${now - this.state.updateTimestamp}) > (${1000 / 15})`)
    if ((now - this.state.updateTimestamp) > (1000 / 15)) {
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

  componentDidUpdate() {    
    if (this.chip8.drawFlag && this.state.gfx) {
      const ctx = this.canvasRef.getContext('2d');
      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          if (this.state.gfx[x + (y * 64)] === 1) {
            ctx.fillRect(x, y, 1, 1);
            console.log("filling rect");
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="emulator">
        Chip 8 emulator | Fps: {this.state.fps}
        <canvas className="emulator-canvas" ref={canvas => this.canvasRef = canvas} width={64} height={32} />
      </div>
    );
  }
}
