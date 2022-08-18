export interface Position {
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
}

class Ship {
	private size: number;
	private xStart: number;
	private yStart: number;
	private xEnd: number;
	private yEnd: number;

	constructor({ xStart, yStart, xEnd, yEnd }: Position) {
		this.xStart = xStart;
		this.yStart = yStart;
		this.xEnd = xEnd;
		this.yEnd = yEnd;
		const isHorizontal = this.yStart === this.yEnd;
		const isVertical = this.xStart === this.xEnd;

		if (!isVertical && !isHorizontal) {
			this.size = 1;
		} else if (isVertical) {
			this.size = Math.abs(this.yEnd - this.yStart) + 1;
		} else if (isHorizontal) {
			this.size = Math.abs(this.xEnd - this.xStart) + 1;
		}
	}

	public move(position: Position) {
		Object.entries(position).forEach(([key, value]) => {
			this[key] = value;
		});
	}
}
