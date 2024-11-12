export default class HeatingCurve {

	public constructor(
		public offset: number,
		public slope: number,
	) {
	}

	public get(outsideTemperature: number): number {

		const rt_soll = 21;

		const dar = outsideTemperature - rt_soll;
		return this.calculateValue(dar, rt_soll, this.offset, this.slope);
	}

	private calculateValue(DAR: number, rt_soll: number, offset: number, slope: number) {
		let temp = rt_soll + offset - (slope * DAR * (1.4347 + 0.021 * DAR + 247.9 * 0.000001 * DAR * DAR));
		temp = Math.round(temp * 10) / 10;
		temp = Math.min(100, temp);
		return temp;
	}
}