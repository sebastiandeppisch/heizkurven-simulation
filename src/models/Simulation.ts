import House from './House';
import HeatingSystem from './HeatingSystem';
export default class Simulation {
  private heatingSystem: HeatingSystem;
  private house: House;
  private outsideTemperature: number;

  constructor(heatingSystem: HeatingSystem, house: House, outsideTemperature: number) {
    this.heatingSystem = heatingSystem;
    this.house = house;
    this.outsideTemperature = outsideTemperature;
  }

  public setOutsideTemperature(temperature: number): void {
    this.outsideTemperature = temperature;
    this.house.setOutsideTemperature(temperature);
  }

  // Methode zur Steuerung der gesamten Simulation
  public run(simulationTime: number, deltaTime: number): void {
    // Simulation für die angegebene Zeitspanne durchführen, iterativ mit Zeitschritten `deltaTime`
    const iterations = Math.ceil(simulationTime / deltaTime);

    this.house.getRoomTemperatures();


    for (let i = 0; i < iterations; i++) {
      const flowTemperature = this.heatingSystem.getFlowTemperature(this.outsideTemperature);
      this.house.updateRooms(flowTemperature, deltaTime);

      // Optional: Ausgabe der aktuellen Raumtemperaturen für jeden Schritt
      console.log(`Zeit: ${(i + 1) * deltaTime}s`);
      this.house.getRoomTemperatures();
    }
  }
}