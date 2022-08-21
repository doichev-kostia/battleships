import Ship from "./ship";
import { Coordinates } from "../types";

export class Cell {
	private readonly x: number;
	private readonly y: number;
	private isHit = false;
	private ship: Ship | null = null;

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

	public getCoordinates(): Coordinates {
		return { x: this.x, y: this.y };
	}

	public getHasShip(): boolean {
		return !!this.ship;
	}

	public getShip(): Ship | null {
		return this.ship;
	}

	public setShip(ship: Ship): void {
		this.ship = ship;
	}

	public getIsHit(): boolean {
		return this.isHit;
	}

	public hit(): void {
		this.isHit = true;
		if (this.ship) {
			this.ship.hit({ x: this.x, y: this.y });
		}
	}
}
