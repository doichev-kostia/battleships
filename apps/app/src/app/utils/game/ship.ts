import { Coordinates } from "app/utils/types";

export interface Position {
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
}

class Ship {
	private readonly id?: string;
	private readonly size: number;
	private xStart: number;
	private yStart: number;
	private xEnd: number;
	private yEnd: number;
	private isKilled = false;
	private hits: Coordinates[] = [];

	constructor({ xStart, yStart, xEnd, yEnd }: Position, id?: string) {
		this.id = id;
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

	public getCoordinates(): Position {
		return {
			xStart: this.xStart,
			yStart: this.yStart,
			xEnd: this.xEnd,
			yEnd: this.yEnd,
		};
	}

	public getIsKilled() {
		return this.isKilled;
	}

	public getHits() {
		return this.hits;
	}

	public hit(coordinates: Coordinates) {
		const isUnique = this.hits.every((hit) => hit.x !== coordinates.x || hit.y !== coordinates.y);
		if (!isUnique) {
			return;
		}
		this.hits.push(coordinates);
		if (this.hits.length === this.size) {
			this.isKilled = true;
		}
	}

	public isAt(coordinates: Coordinates) {
		return (
			this.xStart <= coordinates.x &&
			this.xEnd >= coordinates.x &&
			this.yStart <= coordinates.y &&
			this.yEnd >= coordinates.y
		);
	}
}

export default Ship;
