import React from 'react';
import PropTypes from "prop-types";
import Chip8 from './Chip8';

export interface IChip8EmulatorProps {
  chip8File: string;
}

export interface IChip8EmulatorState {
  fps: number;
}

export default class Chip8Emulator extends React.Component<IChip8EmulatorProps, IChip8EmulatorState> {
  private chip8: Chip8;
  static contextTypes = {
    loop: PropTypes.object,
  };

  constructor(props: IChip8EmulatorProps) {
    super(props);

    this.chip8 = new Chip8(this.updateFps);
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

  updateFps = (fps: number) => this.setState({ fps });

  render() {
    return (
      <div>
        Chip 8 emulator
      </div>
    );
  }
}
