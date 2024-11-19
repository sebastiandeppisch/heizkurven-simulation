import { Outside } from './ThermalConnection';
export default class HeatingSystem {
  private slope: number;  // Steigung m
  private offset: number; // Parallelverschiebung c

  public outside: Outside | null = null;

  constructor(slope: number, offset: number) {
    this.slope = slope;
    this.offset = offset;
  }

  public getFlowTemperature(outsideTemperature: number | null = null): number {
    if (outsideTemperature === null) {
      if (this.outside === null) {
        throw new Error('No outside temperature given');
      }
      outsideTemperature = this.outside.getTemperature();
    }

    const roomDesiredTemperature = 20;

    const error = roomDesiredTemperature - outsideTemperature;


    let flowTemperature = this.slope * error + this.offset;

    flowTemperature = Math.max(outsideTemperature, Math.min(100, flowTemperature));

    flowTemperature = Math.max(20, flowTemperature);

    return flowTemperature;
  }

  public setSlope(slope: number): void {
    this.slope = slope;
  }

  public setOffset(offset: number): void {
    this.offset = offset;
  }

  public getSlope(): number {
    return this.slope;
  }

  public getOffset(): number {
    return this.offset;
  }
}