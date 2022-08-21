import { Grid } from "./grid";
import { Coordinates } from "../types";
import { getRandomInt } from "../helpers";
import { GAME_CONFIG } from "../../constants/game-config";

export class Computer {
	private grid: Grid;
	private prevShot: Coordinates | null = null;
	private isShotSuccessful = false;
	private neighbourCoords: Coordinates[] = [];

	constructor(grid: Grid) {
		this.grid = grid;
	}

	public shoot() {
		let coordinates: Coordinates;
		do {
			coordinates = this.generateRandomShotCoordinates();
		} while (!this.isValidShot(coordinates));
		this.prevShot = coordinates;
		const cell = this.grid.getGrid()[coordinates.y][coordinates.x];
		const ref = cell.getRef();
		ref?.click();
	}

	public setShotSuccessful(isSuccessful: boolean) {
		this.isShotSuccessful = isSuccessful;
		this.neighbourCoords = [];
	}

	private generateRandomShotCoordinates(): Coordinates {
		if (this.isShotSuccessful && this.prevShot) {
			this.neighbourCoords = [
				{
					x: this.prevShot.x - 1,
					y: this.prevShot.y,
				},
				{
					x: this.prevShot.x + 1,
					y: this.prevShot.y,
				},
				{
					x: this.prevShot.x,
					y: this.prevShot.y - 1,
				},
				{
					x: this.prevShot.x,
					y: this.prevShot.y + 1,
				},
			];
		}

		if (this.neighbourCoords.length > 0) {
			return this.neighbourCoords.pop() as Coordinates;
		}

		const x = getRandomInt(0, GAME_CONFIG.size + 1);
		const y = getRandomInt(0, GAME_CONFIG.size + 1);

		return { x, y };
	}

	private isValidShot(coordinates: Coordinates): boolean {
		const { x, y } = coordinates;
		const isInRange = x >= 0 && x < GAME_CONFIG.size && y >= 0 && y < GAME_CONFIG.size;
		if (!isInRange) {
			return false;
		}
		const cell = this.grid.getGrid()[y][x];

		return !cell.getIsHit();
	}
}
