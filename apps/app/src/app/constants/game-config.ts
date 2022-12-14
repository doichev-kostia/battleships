export interface Ship {
	size: number;
}

export enum ITEM_TYPE {
	SHIP = "SHIP",
}

export const SHIPS = new Map<number, string>([
	[5, "Carrier"],
	[4, "Battleship"],
	[3, "Destroyer"],
	[2, "Submarine"],
	[1, "Patrol Boat"],
]);

export const GAME_CONFIG = {
	small: {
		size: 6,
		ships: [
			{ size: 2, quantity: 1 },
			{ size: 3, quantity: 1 },
			{ size: 4, quantity: 1 },
		],
	},
	standard: {
		size: 11,
		ships: [
			{ size: 1, quantity: 5 },
			{ size: 2, quantity: 4 },
			{ size: 3, quantity: 3 },
			{ size: 4, quantity: 2 },
			{ size: 5, quantity: 1 },
		],
	},
};

export type GridSize = keyof typeof GAME_CONFIG;

export type GameConfig = typeof GAME_CONFIG;
