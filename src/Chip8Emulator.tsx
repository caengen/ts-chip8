import React from 'react';
import PropTypes from "prop-types";
import Chip8 from './Chip8';

export interface IChip8EmulatorProps {
  chip8File: string;
}

export default class Chip8Emulator extends React.Component<IChip8EmulatorProps, any> {
  private chip8 = new Chip8();
  static contextTypes = {
    loop: PropTypes.object,
  };

  constructor(props: IChip8EmulatorProps) {
    super(props);

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

  render() {
    return (
      <div>
        Chip 8 emulator
      </div>
    );
  }
}
