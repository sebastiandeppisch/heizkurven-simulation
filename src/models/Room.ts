import type { ThermalConnection } from './ThermalConnection';
export default class Room {
  private name: string;
  private currentTemperature: number;
  private heatCapacity: number; // Wärmekapazität des Raums
  private heatTransferCoefficient: number; // Wärmetransferkoeffizient des Heizkörpers
  private thermalConnections: ThermalConnection[]; // Verbindungen zu Nachbarn und Außenwelt
  private kp: number; // Verstärkungsfaktor des P-Reglers
  private setPoint: number; // Zieltemperatur des Raums

  private heatingPowerFactor: number;

  constructor(name: string, initialTemperature: number, heatCapacity: number, heatTransferCoefficient: number, setPoint: number) {
    this.name = name;
    this.currentTemperature = initialTemperature;
    this.heatCapacity = heatCapacity;
    this.heatTransferCoefficient = heatTransferCoefficient;
    this.thermalConnections = [];
    this.setPoint = setPoint;
    this.kp = 1.0; // Standardwert für den Verstärkungsfaktor, kann angepasst werden
    this.heatingPowerFactor = 0;
  }

  // Methode zum Hinzufügen von Verbindungen
  public addThermalConnection(connection: ThermalConnection): void {
    this.thermalConnections.push(connection);
  }

  // Methode zur Aktualisierung der Raumtemperatur
  public updateTemperature(flowTemperature: number, deltaTime: number): void {
    // Berechne den Heizleistungsanteil basierend auf dem P-Regler
    const error = this.setPoint - this.currentTemperature;
    const heatingPowerFactor = this.kp * error;

    // Begrenze den Faktor, damit er sinnvoll bleibt (0 bis 1)
    let limitedHeatingPowerFactor = Math.max(0, Math.min(1, heatingPowerFactor));

    if (error > 2) {
      limitedHeatingPowerFactor = 1;
    } else if (error < -2) {
      limitedHeatingPowerFactor = 0;
    }
    this.heatingPowerFactor = limitedHeatingPowerFactor;


    // Berechne die Wärmezufuhr durch den Heizkörper
    const heatingPower = this.heatTransferCoefficient * limitedHeatingPowerFactor * (flowTemperature - this.currentTemperature);


    // Berechne Wärmeaustausch über alle Verbindungen (Nachbarn + Außenwelt)
    let totalHeatTransfer = 0;
    this.thermalConnections.forEach(connection => {
      const temperatureDifference = connection.getTemperature() - this.currentTemperature;
      totalHeatTransfer += connection.getTransferCoefficient() * temperatureDifference;
    });

    // Berechne die Änderung der Raumtemperatur
    const deltaTemperature = (heatingPower + totalHeatTransfer) / this.heatCapacity * deltaTime;

    // Update der Raumtemperatur
    this.currentTemperature += deltaTemperature;
  }

  public getCurrentTemperature(): number {
    return this.currentTemperature;
  }

  public getCurrentHeatingPowerFactor(): number {
    return this.heatingPowerFactor;
  }



  public setTargetTemperature(targetTemperature: number): void {
    this.setPoint = targetTemperature;
  }

  public getName(): string {
    return this.name;
  }
}