export default class HeatingSystem {
  private slope: number;  // Steigung m
  private offset: number; // Parallelverschiebung c

  constructor(slope: number, offset: number) {
    this.slope = slope;
    this.offset = offset;
  }

  public getFlowTemperature(outsideTemperature: number): number {

    const roomDesiredTemperature = 20;

    const error = roomDesiredTemperature - outsideTemperature;


    let flowTemperature = this.slope * error + this.offset;

    flowTemperature = Math.max(outsideTemperature, Math.min(100, flowTemperature));

    return flowTemperature;
  }

  public setSlope(slope: number): void {
    this.slope = slope;
  }

  public setOffset(offset: number): void {
    this.offset = offset;
  }
}