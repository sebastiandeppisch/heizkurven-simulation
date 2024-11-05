import Room from "./Room";
export class NeighborRoomConnection implements ThermalConnection {
  private neighborRoom: Room;
  private wallTransferCoefficient: number;

  constructor(neighborRoom: Room, wallTransferCoefficient: number) {
    this.neighborRoom = neighborRoom;
    this.wallTransferCoefficient = wallTransferCoefficient;
  }

  public getTemperature(): number {
    return this.neighborRoom.getCurrentTemperature();
  }

  public getTransferCoefficient(): number {
    return this.wallTransferCoefficient;
  }
}

export class OutsideConnection implements ThermalConnection {
  private outsideTemperature: number;
  private insulationCoefficient: number;

  constructor(outsideTemperature: number, insulationCoefficient: number) {
    this.outsideTemperature = outsideTemperature;
    this.insulationCoefficient = insulationCoefficient;
  }

  public setOutsideTemperature(temperature: number): void {
    this.outsideTemperature = temperature;
  }

  public getTemperature(): number {
    return this.outsideTemperature;
  }

  public getTransferCoefficient(): number {
    return this.insulationCoefficient;
  }
}
export interface ThermalConnection {
  getTemperature(): number;
  getTransferCoefficient(): number;
}