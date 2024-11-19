import { Outside, ThermalConnection } from './ThermalConnection';
import Room from './Room';
export default class House {
  private rooms: Array<Room>;


  constructor() {
    this.rooms = [];
  }

  public addRoom(room: Room): void {
    this.rooms.push(room);
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public addOutsideConnection(roomName: string, insulationCoefficient: number, outside: Outside): void {
    const room = this.rooms.find(room => room.getName() === roomName);
    if (room) {
      room.addThermalConnection(new ThermalConnection(outside, insulationCoefficient));
    } else {
      throw new Error(`Room not found: ${roomName}`);
    }
  }

  public setNeighbors(roomName1: string, roomName2: string, wallTransferCoefficient: number): void {
    const room1 = this.rooms.find(room => room.getName() === roomName1);
    const room2 = this.rooms.find(room => room.getName() === roomName2);

    if (room1 && room2) {
      room1.addThermalConnection(new ThermalConnection(room2, wallTransferCoefficient));
    } else {
      throw new Error(`One or both rooms not found: ${roomName1}, ${roomName2}`);
    }
  }

  public updateRooms(flowTemperature: number, deltaTime: number): void {
    this.rooms.forEach(room => room.updateTemperature(flowTemperature, deltaTime));
  }

  public getRoomTemperatures(): number[] {
    return this.rooms.map(room => {
      return room.getTemperature();
    });
  }
}