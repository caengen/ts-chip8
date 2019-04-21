export default class Chip8 {
  public opcode: number;
  // 4K memory
  public memory: Int8Array = new Int8Array(4096);
  // registers V0...VE
  public V: Int8Array = new Int8Array(16);
  // index register
  public I: number;
  // program counter
  public pc: number;
  // pixel graphics. 2048 pixels total
  public gfx: Int8Array = new Int8Array(64 * 32);
  // timer registers
  // 60 Hz timer registers
  public delayTimer: number;
  public soundTimer: number;
  // stack
  public stack: Int16Array = new Int16Array(16);
  public sp: number;

  // key state
  public key: Int8Array = new Int8Array(16);

  /**
   * The system does not draw each cycle. This flag is set when the system
   * should draw. These opcodes sets the flag:
   * 0x00E0 - Clear screen
   * 0xDXYN - Draw a sprite on the screen
   */
  public drawFlag: boolean;

  public constructor() {
    this.opcode = 0x0;
    this.I = 0x0;
    this.pc = 0x0;
    this.delayTimer = 0x0;
    this.soundTimer = 0x0;
    this.sp = 0x0;
    this.drawFlag = false;
  }

  /**
   * Clears the memory, registers and screen
   */
  public initialize() {
    // Initialize registers and memory once
  }

  /**
   * Copies program into memory
   */
  public loadGame() {

  }

  public emulateCycle() {
    // Fetch Opcode
    // opcode are two bytes so must be merged OR
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1]
    // Decode Opcode
    // [operation, operand] = decode(opcode)
    // Execute Opcode
    // execute(operation, operand)

    // Update timers
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
    } 
    else if (opc === 0x00EE) {
      // return from subroutine
    }
    // opcode 0x0NNN
    else if ((opc & 0xF000) === 0x0000) {
      // call RCA 1802 program at NNN
    }
    // opcode 0x1NNN
    else if ((opc & 0xF000) === 0x1000) {
      // jump to address NNN
    }
    // opcode 0x2NNN
    else if ((opc & 0xF000) === 0x2000) {
      // call subroutine at address NNN
    }
    // opcode 0x3XNN
    else if ((opc & 0xF000) === 0x3000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x4XNN
    else if ((opc & 0xF000) === 0x4000) {
      // Skips the next instruction if VX doesn't equal NN. 
    }
    // opcode 0x5XYN
    else if ((opc & 0xF000) === 0x5000) {
      // Skips the next instruction if VX equals VY. 
    }
    // opcode 0x6XNN
    else if ((opc & 0xF000) === 0x6000) {
      // Sets VX to NN.
    }
    // opcode 0x7XNN
    else if ((opc & 0xF000) === 0x7000) {
      //Adds NN to VX. (Carry flag is not changed)
    }
    // opcode 0x8XY0
    else if ((opc & 0xF00F) === 0x8000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY1
    else if ((opc & 0xF00F) === 0x8001) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY2
    else if ((opc & 0xF00F) === 0x8002) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY3
    else if ((opc & 0xF00F) === 0x8003) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY4
    else if ((opc & 0xF00F) === 0x8004) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY5
    else if ((opc & 0xF00F) === 0x8005) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY6
    else if ((opc & 0xF00F) === 0x8006) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XY7
    else if ((opc & 0xF00F) === 0x8007) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0x8XYE
    else if ((opc & 0xF00F) === 0x800E) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xANNN
    else if ((opc & 0xF000) === 0xA000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xBNNN
    else if ((opc & 0xF000) === 0xB000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xCXNN
    else if ((opc & 0xF000) === 0xC000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xDXYN
    else if ((opc & 0xF000) === 0xD000) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xEX9E
    else if ((opc & 0xF0FF) === 0xE09E) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xEXA1
    else if ((opc & 0xF0FF) === 0xE0A1) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX07
    else if ((opc & 0xF0FF) === 0xF007) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX0A
    else if ((opc & 0xF0FF) === 0xF00A) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX15
    else if ((opc & 0xF0FF) === 0xF015) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX18
    else if ((opc & 0xF0FF) === 0xF018) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX1E
    else if ((opc & 0xF0FF) === 0xF01E) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX29
    else if ((opc & 0xF0FF) === 0xF029) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX33
    else if ((opc & 0xF0FF) === 0xF033) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX55
    else if ((opc & 0xF0FF) === 0xF055) {
      // Skips the next instruction if VX equals NN.
    }
    // opcode 0xFX65
    else if ((opc & 0xF0FF) === 0xF065) {
      // Skips the next instruction if VX equals NN.
    }
  }
}