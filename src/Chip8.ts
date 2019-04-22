export default class Chip8 {
  public opcode: number;
  // 4K memory
  public memory: Int8Array;
  // registers V0...VE
  public V: Int8Array;
  // index register
  public I: number;
  // program counter
  public pc: number;
  // pixel graphics. 2048 pixels total
  public gfx: Int8Array;
  // timer registers
  // 60 Hz timer registers
  public delayTimer: number;
  public soundTimer: number;
  // stack
  public stack: Int16Array;
  public sp: number;

  // key state
  public key: Int8Array;

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

    this.memory = new Int8Array(4096);  
    this.gfx = new Int8Array(64 * 32);
    this.V = new Int8Array(16);
    this.stack = new Int16Array(16);
    this.key = new Int8Array(16);
    
    //load font into memory
    
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.drawFlag = false;
  }

  /**
   * Copies program into memory
   */
  public loadGame(file: Blob) {
    // load pong
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrBuff = new Int8Array(fileReader.result as ArrayBuffer);
      for (let i = 0; i < arrBuff.length; i++) {
        this.memory[i + 512] = arrBuff[i];
      }
    }
    fileReader.readAsArrayBuffer(file);
  }

  public dissassemble() {
    for (let i = 0; i < this.memory.length; i++) {
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
    if (opc === 0x00E0) {
      // clear screen
      console.log("0x00E0 Clear screen")
      this.gfx = new Int8Array(64 * 32);
    } 
    else if (opc === 0x00EE) {
      // return from subroutine
      console.log("0x00EE Return from subroutine")
    }
    // opcode 0x0NNN
    else if ((opc & 0xF000) === 0x0000) {
      console.log(`${opc} call RCA 1802 program at NNN`)
    }
    // opcode 0x1NNN
    else if ((opc & 0xF000) === 0x1000) {
      console.log(`${opc} jump to address NNN`)
    }
    // opcode 0x2NNN
    else if ((opc & 0xF000) === 0x2000) {
      console.log(`${opc} call subroutine at address NNN`)
    }
    // opcode 0x3XNN
    else if ((opc & 0xF000) === 0x3000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x4XNN
    else if ((opc & 0xF000) === 0x4000) {
      console.log(`${opc} Skips the next instruction if VX doesn't equal NN. `)
    }
    // opcode 0x5XYN
    else if ((opc & 0xF000) === 0x5000) {
      console.log(`${opc} Skips the next instruction if VX equals VY. `)
    }
    // opcode 0x6XNN
    else if ((opc & 0xF000) === 0x6000) {
      console.log(`${opc} Sets VX to NN.`)
    }
    // opcode 0x7XNN
    else if ((opc & 0xF000) === 0x7000) {
      console.log(`${opc} Adds NN to VX. (Carry flag is not changed)`)
    }
    // opcode 0x8XY0
    else if ((opc & 0xF00F) === 0x8000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY1
    else if ((opc & 0xF00F) === 0x8001) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY2
    else if ((opc & 0xF00F) === 0x8002) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY3
    else if ((opc & 0xF00F) === 0x8003) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY4
    else if ((opc & 0xF00F) === 0x8004) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY5
    else if ((opc & 0xF00F) === 0x8005) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY6
    else if ((opc & 0xF00F) === 0x8006) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XY7
    else if ((opc & 0xF00F) === 0x8007) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0x8XYE
    else if ((opc & 0xF00F) === 0x800E) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xANNN
    else if ((opc & 0xF000) === 0xA000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xBNNN
    else if ((opc & 0xF000) === 0xB000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xCXNN
    else if ((opc & 0xF000) === 0xC000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xDXYN
    else if ((opc & 0xF000) === 0xD000) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xEX9E
    else if ((opc & 0xF0FF) === 0xE09E) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xEXA1
    else if ((opc & 0xF0FF) === 0xE0A1) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX07
    else if ((opc & 0xF0FF) === 0xF007) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX0A
    else if ((opc & 0xF0FF) === 0xF00A) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX15
    else if ((opc & 0xF0FF) === 0xF015) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX18
    else if ((opc & 0xF0FF) === 0xF018) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX1E
    else if ((opc & 0xF0FF) === 0xF01E) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX29
    else if ((opc & 0xF0FF) === 0xF029) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX33
    else if ((opc & 0xF0FF) === 0xF033) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX55
    else if ((opc & 0xF0FF) === 0xF055) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
    // opcode 0xFX65
    else if ((opc & 0xF0FF) === 0xF065) {
      console.log(`${opc} Skips the next instruction if VX equals NN.`)
    }
  }
}