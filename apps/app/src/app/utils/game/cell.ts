export class Cell {
	private readonly x: number;
	private readonly y: number;
	private hasShip = false;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	public getHasShip(): boolean {
		return this.hasShip;
	}

	public setHasShip(hasShip: boolean): void {
		this.hasShip = hasShip;
	}
}
