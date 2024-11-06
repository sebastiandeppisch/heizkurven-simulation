export default class OutsideTemperatureGenerator {
	private monthTemperatures = [
		3.9,
		6.2,
		6.7,
		11.7,
		13.0,
		17.6,
		19.4,
		21.0,
		15.7,
		10.9,
		6.1,
		3.9
	];

	constructor() {

	}

	public forMonth(month: number): number {
		return this.randomNormal(this.monthTemperatures[month], 3);
	}

	private randomNormal(mean: number, stdDev: number) {
		let u1 = Math.random();
		let u2 = Math.random();
		let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
		return mean + z0 * stdDev;
	};
}