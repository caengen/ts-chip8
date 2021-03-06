import font from "./Chip8Font";
export default class Chip8 {
  public opcode: number;
  // 4K memory
  public memory: Uint8Array;
  private rom: Uint8Array;
  // registers V0...VE
  public V: Uint8Array;
  // index register
  public I: number;
  // program counter
  public pc: number;
  // pixel graphics. 64x34, 2048 pixels total
  public gfx: Uint8Array;
  // timer registers
  // 60 Hz timer registers
  public delayTimer: number;
  public soundTimer: number;
  private timerTimestamp: number;
  private updateLastInstruction?: (lastInstruction: string) => void;
  private updateGfx: (gfx: Uint8Array) => void;
  // stack
  public stack: Uint16Array;
  public sp: number;

  // key state
  public key: Uint8Array;

  public debug?: boolean;

  /**
   * The system does not draw each cycle. This flag is set when the system
   * should draw. These opcodes sets the flag:
   * 0x00E0 - Clear screen
   * 0xDXYN - Draw a sprite on the screen
   */
  public drawFlag: boolean;

  public constructor(config: {
    updateGfx: (gfx: Uint8Array) => void, 
    updateLastInstruction?: (lastInstruction: string) => void
  }) {
    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;

    this.memory = new Uint8Array(4096);  
    this.rom = new Uint8Array(4096 - 0x200);  
    this.gfx = new Uint8Array(64 * 32);
    this.V = new Uint8Array(16);
    this.stack = new Uint16Array(16);
    this.key = new Uint8Array(16);
    
    this.loadFont();
    
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.timerTimestamp = 0;
    this.updateLastInstruction = config.updateLastInstruction;
    this.updateGfx = config.updateGfx;
    this.drawFlag = false;
  }

  /**
   * Copies program into memory
   */
  public loadGame(file: number[]) {
    for (let i = 0; i < file.length; i++) {  
      this.rom[i] = this.memory[i + 512] = file[i];
    }
    this.romdump();
  }

  public dissassemble() {
    for (let i = 512; i < this.memory.length; i += 2) {
      let opcode = this.memory[i] << 8 | this.memory[i + 1];
      this.execute(opcode);
    }
  }

  public romdump() {
    let arr = [];
    for (let i = 0; i < this.rom.length; i += 2) {
      let opcode = this.rom[i] << 8 | this.rom[i + 1];
      arr.push(opcode);
      if (arr.length === 8) {
        console.log(`${arr[0].toString(16)} ${arr[1].toString(16)} ${arr[2].toString(16)} ${arr[3].toString(16)} ${arr[4].toString(16)} ${arr[5].toString(16)} ${arr[6].toString(16)} ${arr[7].toString(16)}`);
        arr = [];
      }
    }
  }

  public emulateCycle() {
    // opcode are two bytes so must be merged OR
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    this.execute(this.opcode);
    this.updateTimers();

    if (this.drawFlag) {
      console.log(`Updating gfx`)
      this.updateGfx(this.gfx);
      //this.drawFlag = false;
    }
  }

  public setKeys() {

  }

  private loadFont() {
    for (let i = 0; i < font.length; i++) {
      this.memory[i] = font[i];
    }
  }

  private updateTimers() {
    const newTimestamp = Date.now();
    if (newTimestamp - this.timerTimestamp > (1000 / 60)) {
      if (this.soundTimer > 0) {
        this.soundTimer--;
        if (this.soundTimer > 0) {
          // TODO: Buzz!
        }
      }
      
      if (this.delayTimer > 0) {
        this.delayTimer--;
      }
      
      this.timerTimestamp = newTimestamp;
    }
  }

  /**
   * Execute opcode
   * Bit explanations:
   * NNN: address
   * NN: 8-bit constant
   * N: 4-bit constant
   * X and Y: 4-bit register identifier
   * PC : Program Counter
   * I : 16bit register (For memory address) (Similar to void pointer)
   * @param opc opcode
   */
  private execute(opc: number) {
    let executedInstruction = "";
    switch (opc & 0xF000) {
      case 0x0000:
        switch (opc & 0x000F) {
          case 0x0000:
            executedInstruction = "0x00E0 Clear screen";
            this.gfx = new Uint8Array(64 * 32);
            this.pc += 2;
            break;
          case 0x000E:
            executedInstruction = "0x00EE Return from subroutine";
            this.sp--;
            this.pc = this.stack[this.sp];
            break;
          default:
            executedInstruction = `${opc.toString(16)} call RCA 1802 program at NNN`;
            this.pc += 2;
            break;
        }
      case 0x1000:
        executedInstruction = `${opc.toString(16)} jump to address NNN`;
        this.pc = opc & 0x0FFF;
        break;
      case 0x2000:
        executedInstruction = `${opc.toString(16)} call subroutine at address NNN`;
        this.stack[this.sp] = this.pc;
        this.sp++;
        this.pc = opc & 0x0FFF;
        break;
      case 0x3000:
        executedInstruction = `${opc.toString(16)} Skips the next instruction if VX equals NN.`;
        if (this.V[(opc & 0x0F00) >>> 8] === (opc & 0x00FF)) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        break;
      case 0x4000:
        executedInstruction = `${opc.toString(16)} Skips the next instruction if VX doesn't equal NN.`;
        if (this.V[(opc & 0x0F00) >>> 8] !== (opc & 0x00FF)) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        break;
      case 0x5000:
        executedInstruction = `${opc.toString(16)} Skips the next instruction if VX equals VY.`;
        if (this.V[(opc & 0x0F00) >>> 8] === this.V[(opc & 0x00F0) >>> 4]) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        break;
      case 0x6000:
        executedInstruction = `${opc.toString(16)} Sets VX to NN.`;
        this.V[(opc & 0x0F00) >>> 8] = opc & 0x00FF;
        this.pc += 2;
        break;
      case 0x7000:
        executedInstruction = `${opc.toString(16)} Adds NN to VX. (Carry flag is not changed)`;
        this.V[(opc & 0x0F00) >>> 8] += opc & 0x00FF;
        this.pc += 2;
        break;
      case 0x8000:
        switch (opc & 0x000F) {
          case 0x0000:
            executedInstruction = `${opc.toString(16)} Sets VX to the value of VY.`;
            this.V[(opc & 0x0F00) >>> 8] = this.V[(opc & 0x00F0) >>> 4];
            this.pc += 2;
            break;
          case 0x0001:
            executedInstruction = `${opc.toString(16)} Sets VX to VX OR VY. (Bitwise OR operation)`;
            this.V[(opc & 0x0F00) >>> 8] = this.V[(opc & 0x0F00) >>> 8] | this.V[(opc & 0x00F0) >>> 4];
            this.pc += 2;
            break;
          case 0x0002:
            executedInstruction = `${opc.toString(16)} Sets VX to VX AND VY. (Bitwise AND operation)`;
            this.V[(opc & 0x0F00) >>> 8] = this.V[(opc & 0x0F00) >>> 8] & this.V[(opc & 0x00F0) >>> 4];
            this.pc += 2;
            break;
          case 0x0003:
            executedInstruction = `${opc.toString(16)} Sets VX to VX XOR VY.`;
            this.V[(opc & 0x0F00) >>> 8] = this.V[(opc & 0x0F00) >>> 8] ^ this.V[(opc & 0x00F0) >>> 4];
            this.pc += 2;
            break;
          case 0x0004:
            executedInstruction = `${opc.toString(16)} Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.`;
            const result = this.V[(opc & 0x0F00) >>> 8] + this.V[(opc & 0x00F0) >>> 4];
            if (result > 0xFF) {
              this.V[0xF] = 1;
            } else {
              this.V[0xF] = 0;
            }
            this.V[(opc & 0x0F00) >>> 8] = result % 0xFF;
            this.pc += 2;
            break;
          case 0x0005:
            executedInstruction = `${opc.toString(16)} VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.`;
            if (this.V[(opc & 0x0F00) >>> 8] > this.V[(opc & 0x00F0) >>> 4]) {
              this.V[0xF] = 1;
              this.V[(opc & 0x0F00) >>> 8] -= this.V[(opc & 0x00F0) >>> 4];
            } else { // subtraction should wrap around byte
              this.V[0xF] = 0;
              this.V[(opc & 0x0F00) >>> 8] = 0xFF + this.V[(opc & 0x0F00) >>> 8] - this.V[(opc & 0x00F0) >>> 4];
            }

            this.pc += 2;
            // TODO
            break;
          case 0x0006:
            executedInstruction = `${opc.toString(16)} Stores the least significant bit of VX in VF and then shifts VX to the right by 1.`;
            this.V[0xF] = this.V[(opc & 0x0F00)] & 0b00000001;
            this.V[(opc & 0x0F00)] >>>= 1;
            this.pc += 2;
            break;
          case 0x0007:
            executedInstruction = `${opc.toString(16)} Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.`;
            if (this.V[(opc & 0x0F00) >>> 8] < this.V[(opc & 0x00F0) >>> 4]) {
              this.V[0xF] = 0;
              this.V[(opc & 0x0F00) >>> 8] = this.V[(opc & 0x00F0) >>> 4] - this.V[(opc & 0x0F00) >>> 8];
            } else {
              this.V[0xF] = 1;
              this.V[(opc & 0x0F00) >>> 8] = 0xFF + this.V[(opc & 0x00F0) >>> 4] - this.V[(opc & 0x0F00) >>> 8];
            }
            this.pc += 2;
            break;
          case 0x000E:
            executedInstruction = `${opc.toString(16)} Stores the most significant bit of VX in VF and then shifts VX to the left by 1.`;
            this.V[0xF] = this.V[(opc & 0x0F00) >>> 8] >>> 7;
            this.V[(opc & 0x0F00) >>> 8] <<= 1;
            this.pc += 2;
            break;
          default:
            executedInstruction = `${opc.toString(16)} Unknown opcode`;
            this.pc += 2;
            break;
        }
        break;
      case 0x9000:
        executedInstruction = `${opc.toString(16)} Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)`;
        if (this.V[(opc & 0x0F00) >>> 8] !== this.V[(opc & 0x00F0) >>> 4]) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        break;
      case 0xA000:
        executedInstruction = `${opc.toString(16)} Sets I to the address NNN.`;
        this.I = opc & 0x0FFF;
        this.pc += 2;
        break;
      case 0xB000:
        executedInstruction = `${opc.toString(16)} Jumps to the address NNN plus V0`;
        this.pc = (opc & 0x0FFF) + this.V[0];
        break;
      case 0xC000:
        executedInstruction = `${opc.toString(16)} Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.`;
        this.V[(opc & 0x0F00)] = Math.floor(Math.random() * 0xFF) & (opc & 0x00FF);
        this.pc += 2;
        break;
      case 0xD000:
        /**
         * Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and
         * a height of N pixels. Each row of 8 pixels is read as bit-coded 
         * starting from memory location I; I value doesn’t change after the 
         * execution of this instruction. As described above, VF is set to 1 if 
         * any screen pixels are flipped from set to unset when the sprite is 
         * drawn, and to 0 if that doesn’t happen
         */
        executedInstruction = `${opc.toString(16)} Draws a sprite at coordinate (VX, VY)`;
        const x = this.V[(opc & 0x0F00) >>> 8];
        const y = this.V[(opc & 0x00F0) >>> 4];
        const height = this.V[(opc & 0x000F)];

        this.V[0xF] = 0;
        for (let yline = 0; yline < height; yline++) {
          const pixels = this.memory[this.I + yline];
          for (let xline = 0; xline < 8; xline++) {
            // start on the leftmost bit and check if any bits in the line are 1
            if ((pixels & (0x80 >>> xline)) === 1) {
              // check if pixel to be fliped is set and set VF (collision) accordingly
              if (this.gfx[x + xline + ((y + yline) * 64)] === 1) {
                this.V[0xF] = 1;
              }
              this.gfx[x + xline + ((y + yline) * 64)] ^= 1;
            }
          }
        }
        this.drawFlag = true;
        this.pc += 2;
        break;
      case 0xE000:
        switch (opc & 0x000F) {
          case 0x000E:
            executedInstruction = `${opc.toString(16)} Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block).`;
            // TODO instruction
            this.pc += 2;
            break;
          case 0x0001:
            executedInstruction = `${opc.toString(16)} Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block).`;
            // TODO instruction
            this.pc += 2;
            break;
          default:
            executedInstruction = `${opc.toString(16)} Unknown opcode`;
            this.pc += 2;
            break;
        }
        break;
      case 0xF000:
        switch (opc & 0x00FF) {
          case 0x0007:
            executedInstruction = `${opc.toString(16)} Sets VX to the value of the delay timer.`;
            this.V[(opc & 0x0F00) >>> 8] = this.delayTimer;
            this.pc += 2;
            break;
          case 0x000A:
            executedInstruction = `${opc.toString(16)} A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)`;
            // TODO instruction
            this.pc += 2;
            break;
          case 0x0015:
            executedInstruction = `${opc.toString(16)} Sets the delay timer to VX.`;
            this.delayTimer = this.V[(opc & 0x0F00) >>> 8];
            this.pc += 2;
            break;
          case 0x0018:
            executedInstruction = `${opc.toString(16)} Sets the sound timer to VX.`;
            this.soundTimer = this.V[(opc & 0x0F00) >>> 8];
            this.pc += 2;
            break;
          case 0x001E:
            executedInstruction = `${opc.toString(16)} Adds VX to I.`;
            this.I = (this.I + this.V[(opc & 0x0F00) >>> 8]) % 0xFFFF;
            this.pc += 2;
            break;
          case 0x0029:
            executedInstruction = `${opc.toString(16)} Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.`;
            this.pc += 2;
            break;
          case 0x0033:
          /**
           * Stores the binary-coded decimal representation of VX, with the 
           * most significant of three digits at the address in I, the 
           * middle digit at I plus 1, and the least significant digit at 
           * I plus 2. (In other words, take the decimal representation of 
           * VX, place the hundreds digit in memory at location in I, the 
           * tens digit at location I+1, and the ones digit at location I+2.)
           * Implementation source: http://www.multigesture.net/wp-content/uploads/mirror/goldroad/chip8.shtml
           */
            executedInstruction = `${opc.toString(16)} Store binary-coded decimal representation of VX`;
            this.memory[this.I]     = this.V[(opc & 0x0F00) >>> 8] / 100;
            this.memory[this.I + 1] = this.V[(opc & 0x0F00) >>> 8 ] / 10;
            this.memory[this.I + 2] = this.V[(opc & 0x0F00) >>> 8 ] % 10;
            this.pc += 2;
            break;
          case 0x0055:
            executedInstruction = `${opc.toString(16)} Stores V0 to VX (including VX) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.`;
            for (let i = 0; i < (opc & 0x0F00) >>> 8; i++) {
              this.memory[this.I + i] = this.V[i];
            }
            this.pc += 2;
            break;
          case 0x0065:
            executedInstruction = `${opc.toString(16)} Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.`;
            for (let i = 0; i < (opc & 0x0F00) >>> 8; i++) {
              this.V[i] = this.memory[this.I + i];
            }
            this.pc += 2;
            break;
          default:
            executedInstruction = `${opc.toString(16)} Unknown opcode`;
            this.pc += 2;
            break;
        }
        break;
      default:
        executedInstruction = `${opc.toString(16)} Unknow opcode`;
        this.pc += 2;
        break;
    }

    this.debug && console.log(executedInstruction);
    this.updateLastInstruction && this.updateLastInstruction(executedInstruction);
  }
}