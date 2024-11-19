export class ThermalConnection {
  constructor(private other: ThermalEntity, private transferCoefficient: number) {
  }

  public getTransferCoefficient(): number {
    return this.transferCoefficient;
  }

  public transferEnergy(main: ThermalEntity, deltaTime: number): void {
    const temperatureDifference = main.getTemperature() - this.other.getTemperature();
    const energy = this.transferCoefficient * temperatureDifference * deltaTime;
    this.other.addEnergy(energy);
    main.addEnergy(-energy);
  }
}

export interface ThermalEntity {
  getTemperature(): number;
  addEnergy(amount: number): void;
}


export class Outside implements ThermalEntity {
  private temperature: number;

  constructor(temperature: number) {
    this.temperature = temperature;
  }

  getTemperature(): number {
    return this.temperature;
  }

  setTemperature(temperature: number): void {
    this.temperature = temperature;
  }

  addEnergy(amount: number): void {
    //infinitely large heat capacity
  }
}