import React, { Ref } from 'react';
import PropTypes from "prop-types";
import Chip8 from './Chip8';

export interface IChip8EmulatorProps {
  chip8File: string;
}

export interface IChip8EmulatorState {
  fps: number;
  gfx: Uint8Array;
}

export default class Chip8Emulator extends React.Component<IChip8EmulatorProps, IChip8EmulatorState> {
  private chip8: Chip8;
  private canvasRef: any;
  static contextTypes = {
    loop: PropTypes.object,
  };

  constructor(props: IChip8EmulatorProps) {
    super(props);

    this.canvasRef = React.createRef();
    this.chip8 = new Chip8(this.updateGfx, this.updateFps);
    this.chip8.loadGame(props.chip8File);
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    this.chip8.emulateCycle();
  }

  updateGfx = (gfx: Uint8Array) => null;
  updateFps = (fps: number) => this.setState({ fps });

  componentDidUpdate() {
    const ctx = this.canvasRef.getContext('2d');
    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 32; y++) {
        if (this.state.gfx[x + (y * 64)] === 1) {
          ctx.fillRect(x, y, 1, 1);
          console.log("filling rect")
        }
      }
    }
  }

  render() {
    return (
      <div>
        Chip 8 emulator
        <canvas ref={this.canvasRef} width={64} height={32} />
      </div>
    );
  }
}
