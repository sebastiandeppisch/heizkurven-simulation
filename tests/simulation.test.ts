import { expect, describe, it, test } from 'vitest';
import HeatingSystem from '@/models/HeatingSystem';
import Room from '@/models/Room';
import House from '@/models/House';
import Simulation from '@/models/Simulation';
import RandomLevel from '@/models/RandomLevel';
import { ThermalConnection, Outside } from '@/models/ThermalConnection';

describe('Room', () => {
  it('should increase temperature when heating power is positive', () => {
    const initialTemperature = 18;
    const setPoint = 22;
    const heatCapacity = 5000;
    const heatTransferCoefficient = 200;

    const room = new Room('Wohnzimmer', initialTemperature, heatCapacity, heatTransferCoefficient, setPoint);

    // Simuliere eine Zeitschritt (1 Sekunde)
    room.updateTemperature(50, 1); // Vorlauftemperatur = 50°C, deltaTime = 1 Sekunde

    expect(room.getTemperature()).toBeGreaterThan(initialTemperature);
  });

  it('should decrease temperature when outside temperature is lower and no heating is applied', () => {
    const initialTemperature = 22;
    const setPoint = 18; // Zieltemperatur niedriger, Heizleistung sollte also minimal sein
    const heatCapacity = 5000;
    const heatTransferCoefficient = 200;

    const room = new Room('Schlafzimmer', initialTemperature, heatCapacity, heatTransferCoefficient, setPoint);

    // Füge eine Außenverbindung hinzu (z.B. Außentemperatur = 0°C)
    room.addThermalConnection(new ThermalConnection(new Outside(0), 100));

    // Simuliere eine Zeitschritt (10 Sekunden)
    room.updateTemperature(30, 10); // Vorlauftemperatur = 30°C, deltaTime = 10 Sekunden

    expect(room.getTemperature()).toBeLessThan(initialTemperature);
  });

  it('should not overheat beyond set point', () => {
    const initialTemperature = 20;
    const setPoint = 22;
    const heatCapacity = 5000;
    const heatTransferCoefficient = 200;

    const room = new Room('Küche', initialTemperature, heatCapacity, heatTransferCoefficient, setPoint);

    // Simuliere mehrere Zeitschritte
    for (let i = 0; i < 100; i++) {
      room.updateTemperature(50, 1); // Vorlauftemperatur = 50°C, deltaTime = 1 Sekunde
    }

    expect(room.getTemperature()).toBeLessThanOrEqual(setPoint + 1);
  });
});

describe('Simulation', () => {
  it('should run and update room temperatures accordingly', () => {
    const heatingSystem = new HeatingSystem(1.5, 30);
    const house = new House();

    // Räume initialisieren
    const livingRoom = new Room('Wohnzimmer', 20, 5000, 200, 22);
    const bedroom = new Room('Schlafzimmer', 18, 4000, 150, 20);
    const kitchen = new Room('Küche', 19, 3000, 180, 21);
    const bathroom = new Room('Bad', 22, 3500, 250, 24);

    house.addRoom(livingRoom);
    house.addRoom(bedroom);
    house.addRoom(kitchen);
    house.addRoom(bathroom);

    // Simulation initialisieren
    const simulation = new Simulation(heatingSystem, house, new Outside(5));

    // Außentemperatur setzen
    simulation.setOutsideTemperature(-5);

    // Simulation für 60 Minuten in 60-Sekunden-Schritten laufen lassen
    simulation.run(3600, 60);

    // Testen, ob die Temperaturen der Räume sich entsprechend entwickelt haben
    const roomTemperatures = house.getRoomTemperatures();
    roomTemperatures.forEach(roomTemperature => {
      expect(roomTemperature).toBeGreaterThan(15); // Annahme: alle Räume sollten mindestens 15°C erreichen
    });
  });
});

describe('RandomLevel Constraints', () => {

  test('all rooms have the set point temperature at the beginning of the simulation', () => {
    const level = new RandomLevel();

    level.house.getRooms().forEach((room: Room) => {
      expect(room.getTemperature()).toBeCloseTo(room.getSetPoint(), 0.15)
    });
  });

  test('all rooms have the set point temperatureafter the simulation did run for a little while', () => {
    const level = new RandomLevel();


    level.getSimulation().run(10, 0.01);

    level.house.getRooms().forEach((room: Room) => {
      expect(room.getTemperature()).toBeCloseTo(room.getSetPoint(), 1)
    });
  });
});