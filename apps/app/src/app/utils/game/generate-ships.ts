import { Grid } from "app/utils/game/grid";
import { GAME_CONFIG } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";
import _ from "lodash";
import Ship, { Position as ShipPosition } from "app/utils/game/ship";

type TShip = {
	size: number;
};

type Position = {
	isHorizontal: boolean;
	coordinates: {
		x: number;
		y: number;
	};
};
let counter = 0;
const generatePosition = () => {
	counter++;
	const isHorizontal = Math.random() > 0.5;
	const coordinates = {
		x: Math.floor(Math.random() * GAME_CONFIG.size),
		y: Math.floor(Math.random() * GAME_CONFIG.size),
	};
	return {
		isHorizontal,
		coordinates,
	};
};

const isValidPosition = (grid: Cell[][], position: Position, shipSize: number) => {
	const { isHorizontal, coordinates } = position;
	const { x, y } = coordinates;
	const isInGridRange = isHorizontal
		? x + shipSize <= GAME_CONFIG.size - 1
		: y + shipSize <= GAME_CONFIG.size - 1;

	if (!isInGridRange) {
		return false;
	}

	/* Check whether there is a ship in the current position and the neighbouring cells*/
	for (let i = 0; i < shipSize + 1; i++) {
		if (isHorizontal) {
			const currentRow = grid[y];
			const prevRow = grid[y - 1];
			const nextRow = grid[y + 1];
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
				const prevRow = grid[y - 1];
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

			const currentRow = grid[y + i];
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
};

export const generateShips = (grid: Grid) => {
	const placedShips: Ship[] = [];
	let { ships } = GAME_CONFIG;
	const gridCells = _.cloneDeep(grid.getGrid());
	/**
	 * Sort from largest to smallest
	 */
	ships = ships.sort((a, b) => b.size - a.size);

	const allShips = ships.reduce<TShip[]>((acc, ship) => {
		const total: TShip[] = [];
		for (let i = 0; i < ship.quantity; i++) {
			total.push({ size: ship.size });
		}

		return [...acc, ...total];
	}, []);

	allShips.forEach((ship) => {
		const shipLength = ship.size;
		let position: Position;
		do {
			position = generatePosition();
			if (counter > 5000) {
				break;
				return;
			}
		} while (!isValidPosition(gridCells, position, shipLength));

		const { isHorizontal, coordinates } = position;

		const shipCells = [];

		const shipPosition: Partial<ShipPosition> = {
			xStart: coordinates.x,
			yStart: coordinates.y,
		};

		if (isHorizontal) {
			shipPosition.xEnd = coordinates.x + shipLength - 1;
			shipPosition.yEnd = coordinates.y;
		} else {
			shipPosition.xEnd = coordinates.x;
			shipPosition.yEnd = coordinates.y + shipLength - 1;
		}

		placedShips.push(new Ship(shipPosition as ShipPosition));
		for (let i = 0; i < shipLength; i++) {
			const { x, y } = coordinates;
			if (isHorizontal) {
				shipCells.push({ x: x + i, y });
			} else {
				shipCells.push({ x, y: y + i });
			}
		}
		shipCells.forEach(({ x, y }) => {
			gridCells[y][x].setShip(new Ship(shipPosition as ShipPosition));
		});
	});
	return placedShips;
};
