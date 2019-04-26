import font from "./Chip8Font";

export default class Chip8 {
  public opcode: number;
  // 4K memory
  public memory: Uint8Array;
  // registers V0...VE
  public V: Uint8Array;
  // index register
  public I: number;
  // program counter
  public pc: number;
  // pixel graphics. 2048 pixels total
  public gfx: Uint8Array;
  // timer registers
  // 60 Hz timer registers
  public delayTimer: number;
  public soundTimer: number;
  // stack
  public stack: Uint16Array;
  public sp: number;

  // key state
  public key: Uint8Array;

  /**
   * The system does not draw each cycle. This flag is set when the system
   * should draw. These opcodes sets the flag:
   * 0x00E0 - Clear screen
   * 0xDXYN - Draw a sprite on the screen
   */
  public drawFlag: boolean;

  public constructor() {
    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;

    this.memory = new Uint8Array(4096);  
    this.gfx = new Uint8Array(64 * 32);
    this.V = new Uint8Array(16);
    this.stack = new Uint16Array(16);
    this.key = new Uint8Array(16);
    
    this.loadFont();
    
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.drawFlag = false;
  }

  /**
   * Copies program into memory
   */
  public loadGame(file: string) {
    for (let i = 0; i < file.length; i++) {
      this.memory[i + 512] = file.charCodeAt(i);
    }
  }

  public dissassemble() {
    for (let i = 512; i < this.memory.length; i += 2) {
      let opcode = this.memory[i] << 8 | this.memory[i + 1];
      this.execute(opcode);
    }
  }

  public emulateCycle() {
    // Fetch Opcode
    // opcode are two bytes so must be merged OR
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    // Decode and execute Opcode
    this.execute(this.opcode);
    // Update timers
    this.pc += 2;
  }

  public setKeys() {

  }

  private loadFont() {
    for (let i = 0; i < font.length; i++) {
      for (let j = 0; j < font[i].length; j++) {
        this.memory[i + j] = font[i][j];
      }
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
    switch (opc & 0xF000) {
      case 0:
        switch (opc & 0x00FF) {
          case 0x00E0:
            console.log("0x00E0 Clear screen")
            this.gfx = new Uint8Array(64 * 32);
            break;
          case 0x00EE:
            console.log("0x00EE Return from subroutine")
            break;
          default:
            console.log(`${opc.toString(16)} call RCA 1802 program at NNN`)
        }
      case 1:
        console.log(`${opc.toString(16)} jump to address NNN`)
        break;
      case 2:
        console.log(`${opc.toString(16)} call subroutine at address NNN`)
        break;
      case 3:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
        break;
      case 4:
        console.log(`${opc.toString(16)} Skips the next instruction if VX doesn't equal NN. `)
        break;
      case 5:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals VY. `)
        break;
      case 6:
        console.log(`${opc.toString(16)} Sets VX to NN.`)
        break;
      case 7:
        console.log(`${opc.toString(16)} Adds NN to VX. (Carry flag is not changed)`)
        break;
      case 8:
        switch (opc & 0x000F) {
          case 0:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 1:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 2:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 3:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 4:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 5:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 6:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 7:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 0xE:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
        }
        break;
      case 0xA:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
        break;
      case 0xB:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
        break;
      case 0xC:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
        break;
      case 0xD:
        console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
        break;
      case 0xE:
        switch (opc & 0x000F) {
          case 0xE:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 1:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
        }
        break;
      case 0xF:
        switch (opc & 0x00FF) {
          case 7:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 0xA:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 15:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 18:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 0x1E:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 29:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 33:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 55:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
          case 65:
            console.log(`${opc.toString(16)} Skips the next instruction if VX equals NN.`)
            break;
        }
        break;
      default:
        console.log(`${opc.toString(16)} Unknow opcode`);
    }
  }
}