import { GAME_CONFIG } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";
import Ship from "./ship";
import { ShipGenerator } from "./ship-generator";

export class Grid {
	private grid: Cell[][] = [];
	private ships: Ship[] = [];
	private availableShips: Ship[] = [];
	private shipGenerator: ShipGenerator;

	constructor() {
		this.initializeGrid();
		this.shipGenerator = new ShipGenerator(this);
	}

	private initializeGrid(): void {
		const { size } = GAME_CONFIG;
		for (let row = 0; row < size; row++) {
			this.grid[row] = [];
			for (let col = 0; col < size; col++) {
				this.grid[row][col] = new Cell(col, row);
			}
		}
	}

	public generateShips(): void {
		// To prevent some caching issues, we need to generate new ships every time
		this.ships = [];
		this.availableShips = [];
		this.setShips(this.shipGenerator.generateShips());
	}

	public getGrid(): Cell[][] {
		return this.grid;
	}

	public setShips(ships: Ship[]): void {
		this.ships = ships;
		this.availableShips = ships;
	}

	public getShips(): Ship[] {
		return this.ships;
	}

	public killShip(ship: Ship): void {
		this.availableShips = this.availableShips.filter((s) => s !== ship);
	}

	public getAvailableShips(): Ship[] {
		return this.availableShips;
	}

	public fillWithShips(): void {
		this.ships.forEach((ship) => {
			const { xStart, yStart, xEnd, yEnd } = ship.getCoordinates();
			for (let row = yStart; row <= yEnd; row++) {
				for (let col = xStart; col <= xEnd; col++) {
					this.grid[row][col].setShip(ship);
				}
			}
		});
	}
}
