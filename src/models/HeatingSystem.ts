import HeatingCurve from './HeatingCurve';
import { Outside } from './ThermalConnection';
export default class HeatingSystem {
  private slope: number;
  private offset: number;

  public outside: Outside;

  constructor(slope: number, offset: number, outside: Outside) {
    this.slope = slope;
    this.offset = offset;
    this.outside = outside;
  }

  public getFlowTemperature(outsideTemperature: number | null = null): number {
    if (outsideTemperature === null) {
      outsideTemperature = this.outside.getTemperature();
    }

    let flowTemperature = this.heatingCurve.get(outsideTemperature);

    flowTemperature = Math.max(outsideTemperature, Math.min(100, flowTemperature));

    return flowTemperature;
  }

  private get heatingCurve(): HeatingCurve {
    return new HeatingCurve(this.offset, this.slope);
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
