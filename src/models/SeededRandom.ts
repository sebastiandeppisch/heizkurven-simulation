export default class SeededRandom {
  private seed: number;
  private state: number;

  constructor(seed: number) {
    this.seed = seed;
    this.state = seed;
  }

  public next(): number {
    const m = 0x80000000;
    const a = 1103515245;
    const c = 12345;

    this.state = (a * this.state + c) % m;
    return this.state / (m - 1);
  }
}
