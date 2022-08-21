import React, { useEffect } from "react";
import Ship from "app/utils/game/ship";
import { Coordinates } from "app/utils/types";
import create from "zustand";
import { Grid } from "app/utils/game/grid";
import { Cell } from "app/components/cell";
import cx from "classnames";

interface GridProps {
	grid: Grid;
	clickable?: boolean;
	show?: boolean;
	opponentShots: Coordinates[];
	onMiss?: (coordinates: Coordinates) => void;
	onHit?: (coordinates: Coordinates) => void;
	onShot?: (coordinates: Coordinates) => void;
}

interface KilledShipsState {
	killedShips: Ship[];
	addKilledShip: (ship: Ship) => void;
}

const useKilledShipsStore = create<KilledShipsState>((set) => ({
	killedShips: [],
	addKilledShip: (ship: Ship) => set((state) => ({ killedShips: [...state.killedShips, ship] })),
}));

const Board = ({
	grid,
	clickable = true,
	show = false,
	onMiss,
	onShot,
	onHit,
	opponentShots,
}: GridProps): JSX.Element => {
	const killedShips = useKilledShipsStore((state) => state.killedShips);
	const addKilledShip = useKilledShipsStore((state) => state.addKilledShip);

	const isKilled = (ship: Ship) => {
		return killedShips.includes(ship);
	};

	const handleHit = (coordinates: Coordinates) => {
		if (typeof onHit === "function") {
			onHit(coordinates);
		}
	};

	const handleMiss = (coordinates: Coordinates) => {
		if (typeof onMiss === "function") {
			onMiss(coordinates);
		}
	};

	const handleShot = (coordinates: Coordinates) => {
		if (typeof onShot === "function") {
			onShot(coordinates);
		}
	};

	useEffect(() => {
		const cells = grid.getGrid();
		opponentShots.forEach(({ x, y }) => {
			const currentCell = cells[y][x];
			currentCell.hit();
			const ship = currentCell.getShip();
			if (ship && ship.getIsKilled()) {
				addKilledShip(ship);
			}
		});
	}, []);

	return (
		<>
			{grid.getGrid().map((row, rowIndex) => {
				return (
					<div className="flex flex-nowrap justify-center" key={rowIndex}>
						{row.map((cell) => {
							const { x, y } = cell.getCoordinates();
							const currentShip = cell.getShip();
							const isShip = currentShip != undefined;

							return (
								<Cell
									cell={cell}
									clickable={clickable}
									onShot={handleShot}
									onMiss={handleMiss}
									onHit={handleHit}
									onKill={(c) => {
										console.log(`x: ${c.x}; y: ${c.y} kill`);
										if (isShip) {
											addKilledShip(currentShip);
										}
									}}
									isKilled={isShip && isKilled(currentShip)}
									key={`${x}-${y}`}
									className={cx(isShip && show && "bg-amber-500")}
								/>
							);
						})}
					</div>
				);
			})}
		</>
	);
};

export default Board;
