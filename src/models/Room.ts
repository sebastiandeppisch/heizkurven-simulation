import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ThermalConnection, ThermalEntity } from './ThermalConnection';

interface RoomInfo {
  name: string;
  currentTemperature: number;
  setPoint: number;
  heatingPowerFactor: number;
}

interface RoomInfoUI extends RoomInfo {
  icon: IconDefinition;
  color: string;
  width: number;
  height: number;
}

type RoomType = 'kitchen' | 'bedroom' | 'bathroom' | 'livingroom';


export type { RoomInfo, RoomInfoUI, RoomType };

export default class Room implements ThermalEntity {
  private name: string;
  private currentTemperature: number;
  private heatCapacity: number; // Wärmekapazität des Raums
  private heatTransferCoefficient: number; // Wärmetransferkoeffizient des Heizkörpers
  private thermalConnections: ThermalConnection[]; // Verbindungen zu Nachbarn und Außenwelt
  private kp: number; // Verstärkungsfaktor des P-Reglers
  private setPoint: number; // Zieltemperatur des Raums
  private ki: number = 0.1;
  private i: number = 0;

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

  public addThermalConnection(connection: ThermalConnection): void {
    this.thermalConnections.push(connection);
  }

  public updateTemperature(flowTemperature: number, deltaTime: number): void {

    this.addEnergy(250 * deltaTime); //Person in the room

    this.addEnergy(this.calculateHeatingPower(flowTemperature) * deltaTime);

    this.thermalConnections.forEach(connection => {
      connection.transferEnergy(this, deltaTime);
    });

    if (this.currentTemperature > this.setPoint) {
      this.addEnergy(-250 * deltaTime); //persons open the window
    }
  }

  private calculateHeatingPower(flowTemperature: number): number {
    const error = this.setPoint - this.currentTemperature;
    const heatingPowerFactor = this.kp * error + this.ki * this.i;
    this.i += error;

    let limitedHeatingPowerFactor = Math.max(0, Math.min(1, heatingPowerFactor));

    if (error > 2) {
      limitedHeatingPowerFactor = 1;
      this.i = 0;
    } else if (error < -2) {
      limitedHeatingPowerFactor = 0;
      this.i = 0;
    }

    this.heatingPowerFactor = limitedHeatingPowerFactor;

    return this.heatTransferCoefficient * limitedHeatingPowerFactor * (flowTemperature - this.currentTemperature);
  }

  public getTemperature(): number {
    return this.currentTemperature;
  }

  public getSetPoint(): number {
    return this.setPoint;
  }

  public addEnergy(energy: number): void {
    const deltaTemperature = energy / this.heatCapacity;
    this.currentTemperature += deltaTemperature;
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

  public getInfo(): RoomInfo {
    return {
      name: this.name,
      currentTemperature: this.currentTemperature,
      setPoint: this.setPoint,
      heatingPowerFactor: this.heatingPowerFactor
    };
  }
}