import { GAME_CONFIG } from "app/constants/game-config";
import Ship, { Position as ShipPosition } from "./ship";
import { Grid } from "./grid";
import { Coordinates } from "../types";

type ShipGeneratorPosition = {
	isHorizontal: boolean;
	coordinates: Coordinates;
};

export class ShipGenerator {
	private grid: Grid;
	private counter = 0;
	private config = GAME_CONFIG.standard;

	constructor(grid: Grid) {
		this.grid = grid;
		this.config = GAME_CONFIG[grid.getSize()];
	}

	public generateShips() {
		this.counter = 0;

		type TShip = {
			size: number;
		};

		const placedShips: Ship[] = [];

		/**
		 * Sort from largest to smallest
		 */
		const ships = this.config.ships.sort((a, b) => b.size - a.size);

		const allShips = ships.reduce<TShip[]>((acc, ship) => {
			const total: TShip[] = [];
			for (let i = 0; i < ship.quantity; i++) {
				total.push({ size: ship.size });
			}

			return [...acc, ...total];
		}, []);

		allShips.forEach((ship) => {
			let position: ShipGeneratorPosition;
			do {
				position = this.generatePosition();
				if (this.counter > 5000) {
					throw new Error("Could not generate ships");
				}
			} while (!this.isValidPosition(position, ship.size));

			const { isHorizontal, coordinates } = position;

			const shipPosition = (() => {
				const shipPosition: Partial<ShipPosition> = {
					xStart: coordinates.x,
					yStart: coordinates.y,
				};

				if (isHorizontal) {
					shipPosition.xEnd = coordinates.x + ship.size - 1;
					shipPosition.yEnd = coordinates.y;
				} else {
					shipPosition.xEnd = coordinates.x;
					shipPosition.yEnd = coordinates.y + ship.size - 1;
				}

				return shipPosition as ShipPosition;
			})();

			const createdShip = new Ship(shipPosition);

			placedShips.push(createdShip);
			this.grid.getGrid().forEach((row) => {
				row.forEach((cell) => {
					if (createdShip.isAt(cell.getCoordinates())) {
						cell.setShip(createdShip);
					}
				});
			});
		});
		return placedShips;
	}

	private generatePosition() {
		this.counter++;
		const isHorizontal = Math.random() > 0.5;
		const coordinates = {
			x: Math.floor(Math.random() * this.config.size),
			y: Math.floor(Math.random() * this.config.size),
		};

		return {
			isHorizontal,
			coordinates,
		} as ShipGeneratorPosition;
	}

	private isValidPosition(position: ShipGeneratorPosition, shipSize: number) {
		const cells = this.grid.getGrid();

		const { isHorizontal, coordinates } = position;
		const { x, y } = coordinates;
		const isInGridRange = isHorizontal
			? x + shipSize <= this.config.size - 1
			: y + shipSize <= this.config.size - 1;

		if (!isInGridRange) {
			return false;
		}

		/* Check whether there is a ship in the current position and the neighbouring cells*/
		for (let i = 0; i < shipSize + 1; i++) {
			if (isHorizontal) {
				const currentRow = cells[y];
				const prevRow = cells[y - 1];
				const nextRow = cells[y + 1];
				if (currentRow[x + i] && currentRow[x + i].getHasShip()) {
					return false;
				}
				if (prevRow) {
					if (prevRow[x + i] && prevRow[x + i].getHasShip()) {
						return false;
					}
				}

				if (nextRow) {
					if (nextRow[x + i] && nextRow[x + i].getHasShip()) {
						return false;
					}
				}

				if (i === 0) {
					if (currentRow[x - 1] && currentRow[x - 1].getHasShip()) {
						return false;
					}

					if (prevRow) {
						if (prevRow[x - 1] && prevRow[x - 1].getHasShip()) {
							return false;
						}
					}

					if (nextRow) {
						if (nextRow[x - 1] && nextRow[x - 1].getHasShip()) {
							return false;
						}
					}
				}
			}
			if (!isHorizontal) {
				if (i === 0) {
					const prevRow = cells[y - 1];
					if (prevRow) {
						if (prevRow[x].getHasShip()) {
							return false;
						}

						if (prevRow[x - 1] && prevRow[x - 1].getHasShip()) {
							return false;
						}

						if (prevRow[x + 1] && prevRow[x + 1].getHasShip()) {
							return false;
						}
					}
				}

				const currentRow = cells[y + i];
				if (currentRow[x] && currentRow[x].getHasShip()) {
					return false;
				}

				if (currentRow[x - 1] && currentRow[x - 1].getHasShip()) {
					return false;
				}

				if (currentRow[x + 1] && currentRow[x + 1].getHasShip()) {
					return false;
				}
			}
		}
		return true;
	}
}
