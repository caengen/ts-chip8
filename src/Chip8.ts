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

  constructor() {
    this.opcode = 0x0;
    this.I = 0x0;
    this.pc = 0x0;
    this.delayTimer = 0x0;
    this.soundTimer = 0x0;
    this.sp = 0x0;
  }
}