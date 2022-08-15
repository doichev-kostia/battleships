import { GameConfig } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";
import { Grid } from "app/utils/game/grid";

export class Game {
	private readonly config: GameConfig;
	private playerGrid: Cell[][] = [];
	private opponentGrid: Cell[][] = [];

	constructor(config: GameConfig) {
		this.config = config;
		this.initializeGrid();
	}

	private initializeGrid(): void {
		this.playerGrid = new Grid().getGrid();
		this.opponentGrid = new Grid().getGrid();
	}

	public getPlayerGrid(): Cell[][] {
		return this.playerGrid;
	}

	public getOpponentGrid(): Cell[][] {
		return this.opponentGrid;
	}
}
