import HeatingSystem from "./HeatingSystem";
import House from "./House";
import OutsideTemperatureGenerator from "./OutsideTemperatureGenerator";
import Room from "./Room";
import type { RoomType } from "./Room";


export default class RandomLevel {
	public roomOrder: RoomType[]
	public setTemperatures: number[];

	public currentTemperatures: number[];

	public month: number;

	public dimensions: number[];

	public slope: number;

	public offset: number;

	public outsideTemperature: number;

	private roomTypes = ['kitchen', 'bedroom', 'bathroom', 'livingroom'] as RoomType[];
	private roomTemperatures = {
		'kitchen': 20,
		'bedroom': 18,
		'bathroom': 24,
		'livingroom': 22
	};

	public rooms: Room[] = [];

	public house: House;

	public constructor() {
		const rooms = ['kitchen', 'bedroom', 'bathroom', 'livingroom'] as RoomType[];
		this.roomOrder = [...rooms].sort(() => Math.random() - 0.5);

		this.setTemperatures = this.roomTypes.map(room => {
			return this.randomNormal(this.roomTemperatures[room], 1);
		});

		this.currentTemperatures = this.setTemperatures;

		this.dimensions = [this.randomDimension(), this.randomDimension(), this.randomDimension()];

		this.month = Math.floor(Math.random() * 12);

		this.slope = Math.min(Math.max(this.randomNormal(1, 0.5), 0.2), 3.5);
		this.offset = Math.min(Math.max(this.randomNormal(0, 5), -5), 5);

		this.outsideTemperature = (new OutsideTemperatureGenerator()).forMonth(this.month);


		this.house = new House();
		this.buildRooms();

	}

	private randomDimension(): number {
		return Math.min(Math.max(this.randomNormal(1 / 2, 1 / 8), 1 / 3), 2 / 3);

	}

	private randomNormal(mean: number, stdDev: number) {
		let u1 = Math.random();
		let u2 = Math.random();
		let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
		return mean + z0 * stdDev;
	};

	public getHeatingSystem(): HeatingSystem {
		return new HeatingSystem(this.slope, this.offset);
	}

	private buildRooms() {
		this.roomOrder.forEach((roomType, index) => {

			const current = Math.round(this.currentTemperatures[index]);
			const room = new Room(roomType, current, 600, 100, current);
			this.rooms.push(room);
			this.house.addRoom(room);
			this.house.addOutsideConnection(roomType, 50, this.outsideTemperature);
		});
		//TODO set neighbors
	}


}