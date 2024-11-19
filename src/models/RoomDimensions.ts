type RoomGeometry = {
	x: number;
	y: number;
	width: number;
	height: number;
};


export default class RoomDimensions {
	private roomGeometries: RoomGeometry[];

	constructor(fullWidth: number, fullHeight: number, proportions: number[]) {

		this.roomGeometries = [
			{
				x: 0,
				y: 0,
				width: proportions[0] * fullWidth,
				height: proportions[2] * fullHeight
			},
			{
				x: proportions[0] * fullWidth,
				y: 0,
				width: fullWidth - proportions[0] * fullWidth,
				height: proportions[2] * fullHeight
			},
			{
				x: 0,
				y: proportions[2] * fullHeight,
				width: proportions[1] * fullWidth,
				height: fullHeight - proportions[2] * fullHeight
			},
			{
				x: proportions[1] * fullWidth,
				y: proportions[2] * fullHeight,
				width: fullWidth - proportions[1] * fullWidth,
				height: fullHeight - proportions[2] * fullHeight
			}
		];
	}

	getWidth(index: number): number {
		return this.roomGeometries[index].width;
	}

	getHeight(index: number): number {
		return this.roomGeometries[index].height;
	}

	getArea(index: number): number {
		return this.getWidth(index) * this.getHeight(index);
	}


	getSharingWith(a: number, b: number): number {
		if (a === b || a < 0 || b < 0 || a >= this.roomGeometries.length || b >= this.roomGeometries.length) {
			return 0;
		}

		const roomA = this.roomGeometries[a];
		const roomB = this.roomGeometries[b];

		const startX = Math.max(roomA.x, roomB.x);
		const endX = Math.min(roomA.x + roomA.width, roomB.x + roomB.width);
		const overlapWidth = Math.max(0, endX - startX);

		const startY = Math.max(roomA.y, roomB.y);
		const endY = Math.min(roomA.y + roomA.height, roomB.y + roomB.height);
		const overlapHeight = Math.max(0, endY - startY);

		return overlapWidth + overlapHeight;
	}
}
