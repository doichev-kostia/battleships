import { Grid } from "app/utils/game/grid";
import { GAME_CONFIG } from "app/constants/game-config";
import { Cell } from "app/utils/game/cell";
import _ from "lodash";

type Ship = {
	size: number;
};

type Position = {
	isHorizontal: boolean;
	coordinates: {
		x: number;
		y: number;
	};
};

const generatePosition = () => {
	const isHorizontal = Math.random() > 0.5;
	const coordinates = {
		x: Math.floor(Math.random() * (GAME_CONFIG.size - 1)),
		y: Math.floor(Math.random() * (GAME_CONFIG.size - 1)),
	};
	return {
		isHorizontal,
		coordinates,
	};
};

const isValidPosition = (grid: Cell[][], position: Position, shipSize: number) => {
	const { isHorizontal, coordinates } = position;
	const { x, y } = coordinates;
	const isValid = isHorizontal
		? x + shipSize <= GAME_CONFIG.size
		: y + shipSize <= GAME_CONFIG.size;
	if (!isValid) {
		return false;
	}
	for (let i = 0; i < shipSize; i++) {
		const cell = isHorizontal ? grid[x + i][y] : grid[x][y + i];
		if (cell.getHasShip()) {
			return false;
		}
	}
	return true;
};

export const generateShips = (grid: Grid) => {
	let { ships } = GAME_CONFIG;
	const gridCells = _.cloneDeep(grid.getGrid());
	/**
	 * Sort from largest to smallest
	 */
	ships = ships.sort((a, b) => b.size - a.size);
	const allShips = ships.reduce<Ship[]>((acc, ship) => {
		const total: Ship[] = [];
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
		} while (!isValidPosition(gridCells, position, shipLength));

		const { isHorizontal, coordinates } = position;

		const shipCells = [];
		for (let i = 0; i < shipLength; i++) {
			const { x, y } = coordinates;
			if (isHorizontal) {
				shipCells.push({ x: x + i, y });
			} else {
				shipCells.push({ x, y: y + i });
			}
		}

		shipCells.forEach(({ x, y }) => {
			gridCells[x][y].setHasShip(true);
		});
	});
	return gridCells;
};
