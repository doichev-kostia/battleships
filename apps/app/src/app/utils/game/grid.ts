import { GAME_CONFIG } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";

export class Grid {
	private grid: Cell[][] = [];

	constructor() {
		this.initializeGrid();
	}

	private initializeGrid(): void {
		const { size } = GAME_CONFIG;
		for (let row = 0; row < size; row++) {
			this.grid[row] = [];
			for (let col = 0; col < size; col++) {
				this.grid[row][col] = new Cell(row, col);
			}
		}
	}

	public getGrid(): Cell[][] {
		return this.grid;
	}
}
