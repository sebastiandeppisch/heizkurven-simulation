import Simulation from "@/models/Simulation";
import HeatingSystem from "./HeatingSystem";
import House from "./House";
import OutsideTemperatureGenerator from "./OutsideTemperatureGenerator";
import Room from "./Room";
import type { RoomType } from "./Room";
import RoomDimensions from "./RoomDimensions";
import { Outside, ThermalConnection } from "./ThermalConnection";

interface ThermalProperties {
	wall: number;
	ceiling: number;
	floor: number;
	interiorWall: number;
}

function getThermalPropertiesByAge(yearBuilt: number): { uValues: ThermalProperties, cValues: ThermalProperties } {

	const capacityOfBrick = 550 / 3600; // J/(K*m^3)

	const usableCapacity = 50;

	const wallThickness = 0.3; // m
	const ceilingAndFloorThickness = 0.2; // m

	const cWall = capacityOfBrick * wallThickness * usableCapacity
	const cCeilingAndFloor = capacityOfBrick * ceilingAndFloorThickness * usableCapacity

	//as this is not expected to be a quantitive correct model, just assume the cValues are the same for all years
	const cValues = {
		wall: cWall,
		ceiling: cCeilingAndFloor,
		floor: cCeilingAndFloor,
		interiorWall: cWall
	};

	//The u values are guessed by ChatGPT, they are in the right order of magnitude: https://www.bbsr-geg.bund.de/GEGPortal/DE/Praxishilfen/Wirtschaftlichkeit/Tabellen/PDF/UWerte.pdf?__blob=publicationFile&v=1
	//The u values are in W/(m^2*K)
	//the c values are in J/(K*m^2)
	if (yearBuilt >= 2000) {
		return {
			uValues: { wall: 0.20, ceiling: 0.15, floor: 0.22, interiorWall: 0.15 },
			cValues
		};
	} else if (yearBuilt >= 1980) {
		return {
			uValues: { wall: 0.35, ceiling: 0.25, floor: 0.30, interiorWall: 0.35 },
			cValues
		};
	} else {
		return {
			uValues: { wall: 0.70, ceiling: 0.35, floor: 0.45, interiorWall: 0.55 },
			cValues
		};
	}
}

function randomNormal(mean: number, stdDev: number) {
	let u1 = Math.random();
	let u2 = Math.random();
	let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
	return mean + z0 * stdDev;
};

class ThermalRoomGenerator {

	public rooms: Room[] = [];

	private roomTemperatures = {
		'kitchen': 20,
		'bedroom': 18,
		'bathroom': 24,
		'livingroom': 22
	};

	constructor(private cValues: ThermalProperties, private uValues: ThermalProperties, private dimensions: RoomDimensions, private outside: Outside, private types: RoomType[]) {
		this.generateRooms();
	}

	private generateHeatingCoefficient(thermalResistance: number, setPoint: number) {

		const outsideTemperature = -20;
		const heaterTemperature = 60;
		const deltaToOutside = setPoint - outsideTemperature;
		const deltaToHeater = heaterTemperature - setPoint;

		const coefficient = deltaToOutside * thermalResistance / deltaToHeater;
		return coefficient * 2;
	}

	private generateRooms() {
		this.rooms = this.types.map((type, index) => {

			let temperature = randomNormal(this.roomTemperatures[type], 1);

			temperature = Math.round(temperature * 10) / 10;

			let cValue = this.cValue(index);
			const uValueOutside = this.thermalResistanceOutside(index);

			const heatingCoefficient = this.generateHeatingCoefficient(uValueOutside, temperature) * 2;

			console.log("heat: " + heatingCoefficient, "cValue: " + cValue, "uValue: " + uValueOutside);

			cValue *= 10; //TODO fine tuning

			const room = new Room(type, temperature, cValue, heatingCoefficient, temperature);
			room.addThermalConnection(new ThermalConnection(this.outside, uValueOutside));
			return room;
		});
		this.addNeighbors();
	}

	private addNeighbors() {
		this.rooms.forEach((room, a) => {
			const neighbors = this.rooms.filter((_, i) => i !== a);
			neighbors.forEach((neighbor, b) => {
				const uValueInside = this.uValueInside(a, b);
				room.addThermalConnection(new ThermalConnection(neighbor, uValueInside));
			});
		});
	}

	private thermalResistanceOutside(index: number): number {
		const wallLength = this.dimensions.getWidth(index) + this.dimensions.getHeight(index);
		const wall = wallLength * this.uValues.wall * 2.5;

		const ceiling = this.dimensions.getWidth(index) * this.dimensions.getHeight(index) * this.uValues.ceiling;

		const floor = this.dimensions.getWidth(index) * this.dimensions.getHeight(index) * this.uValues.floor;

		return wall + ceiling + floor;
	}

	private uValueInside(a: number, b: number): number {
		const wallLength = this.dimensions.getSharingWith(a, b);
		return wallLength * this.uValues.interiorWall * 2.5;
	}

	private cValue(index: number): number {
		let cValue = 0;

		const area = this.dimensions.getArea(index);
		const halfWalls = this.dimensions.getHeight(index) + this.dimensions.getWidth(index) * 2.5;

		cValue += area * this.cValues.floor;
		cValue += area * this.cValues.ceiling;
		cValue += halfWalls * this.cValues.interiorWall
		cValue += halfWalls * this.uValues.wall;
		return cValue;
	}
}

export default class RandomLevel {

	public month: number;

	public dimensions: number[];

	public slope: number;

	public offset: number;

	public outside: Outside;

	public heatingSystem: HeatingSystem;

	public rooms: Room[] = [];

	public house: House;

	public constructor() {
		this.dimensions = [this.randomDimension(), this.randomDimension(), this.randomDimension()];

		this.month = Math.floor(Math.random() * 12);

		this.slope = Math.min(Math.max(randomNormal(1, 0.5), 0.2), 3.5);
		this.offset = Math.min(Math.max(randomNormal(0, 5), -5), 5);

		this.slope = Math.round(this.slope * 10) / 10;
		this.offset = Math.round(this.offset);

		this.outside = new Outside((new OutsideTemperatureGenerator()).forMonth(this.month));

		this.house = new House();
		this.buildRooms();

		this.heatingSystem = new HeatingSystem(this.slope, this.offset, this.outside);
	}

	get outsideTemperature() {
		return this.outside.getTemperature();
	}

	private randomDimension(): number {
		return Math.min(Math.max(randomNormal(1 / 2, 1 / 8), 1 / 3), 2 / 3);
	}

	private buildRooms() {
		const roomTypes = ['kitchen', 'bedroom', 'bathroom', 'livingroom'] as RoomType[];
		const roomOrder = roomTypes.sort(() => Math.random() - 0.5);

		const ages = [1980, 2000, 1960];
		let age = ages[Math.floor(Math.random() * ages.length)];
		console.log("Age: " + age);
		age = 2000; //TODO finetune, use random age
		const thermalProperties = getThermalPropertiesByAge(age);
		console.log(thermalProperties);
		const roomDimensions = new RoomDimensions(10, 10, this.dimensions);

		const generator = new ThermalRoomGenerator(thermalProperties.cValues, thermalProperties.uValues, roomDimensions, this.outside, roomOrder);
		this.rooms = generator.rooms;
		console.log(this.rooms);
		this.rooms.forEach(room => this.house.addRoom(room));
	}

	public getSimulation() {
		return new Simulation(this.heatingSystem, this.house, this.outside);
	}
}
