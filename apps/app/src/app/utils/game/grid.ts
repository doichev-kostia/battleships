import { GAME_CONFIG, GridSize } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";
import Ship from "./ship";
import { ShipGenerator } from "./ship-generator";
import { Coordinates } from "../types";

export class Grid {
	private size: GridSize;
	private grid: Cell[][] = [];
	private ships: Ship[] = [];
	private availableShips: Ship[] = [];
	private shipGenerator: ShipGenerator;

	constructor(size: GridSize = "standard") {
		this.size = size;
		this.initializeGrid();
	}

	public getSize = () => this.size;

	private initializeGrid(): void {
		this.grid = [];
		const { size } = GAME_CONFIG[this.size];
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
		this.initializeGrid();
		this.shipGenerator = new ShipGenerator(this);
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

	public getAvailableCells(): Cell[] {
		return this.grid.flat(2).filter((cell) => !cell.getIsHit());
	}

	public getNeighbours({ x, y }: Coordinates): Cell[] {
		const neighbours: Cell[] = [];
		if (x > 0) {
			neighbours.push(this.grid[y][x - 1]);
		}
		if (x < this.grid[y].length - 1) {
			neighbours.push(this.grid[y][x + 1]);
		}
		if (y > 0) {
			neighbours.push(this.grid[y - 1][x]);
		}
		if (y < this.grid.length - 1) {
			neighbours.push(this.grid[y + 1][x]);
		}
		return neighbours;
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
