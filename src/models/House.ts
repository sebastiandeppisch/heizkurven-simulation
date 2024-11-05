import Room from './Room';
import { OutsideConnection, NeighborRoomConnection } from './ThermalConnection';
export default class House {
  private rooms: Array<Room>;
  private outsideConnections: OutsideConnection[];

  constructor() {
    this.rooms = [];
    this.outsideConnections = [];
  }

  public addRoom(room: Room): void {
    this.rooms.push(room);
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public addOutsideConnection(roomName: string, insulationCoefficient: number, initialOutsideTemperature: number): void {
    const room = this.rooms.find(room => room.getName() === roomName);
    if (room) {
      const outsideConnection = new OutsideConnection(initialOutsideTemperature, insulationCoefficient);
      room.addThermalConnection(outsideConnection);
      this.outsideConnections.push(outsideConnection);
    } else {
      throw new Error(`Room not found: ${roomName}`);
    }
  }

  public setNeighbors(roomName1: string, roomName2: string, wallTransferCoefficient: number): void {
    const room1 = this.rooms.find(room => room.getName() === roomName1);
    const room2 = this.rooms.find(room => room.getName() === roomName2);

    if (room1 && room2) {
      room1.addThermalConnection(new NeighborRoomConnection(room2, wallTransferCoefficient));
      room2.addThermalConnection(new NeighborRoomConnection(room1, wallTransferCoefficient));
    } else {
      throw new Error(`One or both rooms not found: ${roomName1}, ${roomName2}`);
    }
  }

  public setOutsideTemperature(temperature: number): void {
    this.outsideConnections.forEach(connection => connection.setOutsideTemperature(temperature));
  }

  public updateRooms(flowTemperature: number, deltaTime: number): void {
    this.rooms.forEach(room => room.updateTemperature(flowTemperature, deltaTime));
  }

  public getRoomTemperatures(): number[] {
    return this.rooms.map(room => {
      return room.getCurrentTemperature();
    });
  }
}