import { Outside } from './ThermalConnection';
import House from './House';
import HeatingSystem from './HeatingSystem';
import RandomLevel from './RandomLevel';
export default class Simulation {
  private heatingSystem: HeatingSystem;
  private house: House;

  private outside: Outside;

  constructor(heatingSystem: HeatingSystem, house: House, outside: Outside) {
    this.heatingSystem = heatingSystem;
    this.house = house;
    this.outside = outside;
    this.heatingSystem.outside = outside;
  }

  public setOutsideTemperature(temperature: number): void {
    this.outside.setTemperature(temperature);
  }

  public run(simulationTime: number, deltaTime: number): void {
    const iterations = Math.ceil(simulationTime / deltaTime);

    this.house.getRoomTemperatures();

    for (let i = 0; i < iterations; i++) {
      const flowTemperature = this.heatingSystem.getFlowTemperature();
      this.house.updateRooms(flowTemperature, deltaTime);
    }
  }
}