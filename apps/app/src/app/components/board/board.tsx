import React, { useEffect, useState } from "react";
import Ship from "app/utils/game/ship";
import { Coordinates } from "app/utils/types";
import { Grid } from "app/utils/game/grid";
import { Cell as GridCell } from "app/utils/game/cell";
import { Cell } from "app/components/cell";
import cx from "classnames";
import { Typography } from "@mui/material";

interface GridProps {
	grid: Grid;
	clickable?: boolean;
	isOpponentComputer?: boolean;
	show?: boolean;
	showHints?: boolean;
	opponentShots: Coordinates[];
	onMiss?: (coordinates: Coordinates) => void;
	onHit?: (coordinates: Coordinates) => void;
	onShot?: (coordinates: Coordinates) => void;
	onLose?: () => void;
	triggerComputerShot?: () => void;
}

const useKilledShips = () => {
	const [killedShips, setKilledShips] = useState<Ship[]>([]);

	const addKilledShip = (ship: Ship) => {
		setKilledShips([...killedShips, ship]);
	};

	return [killedShips, addKilledShip] as const;
};

const Board = ({
	grid,
	clickable = true,
	show = false,
	showHints = false,
	isOpponentComputer = false,
	onMiss,
	onShot,
	onHit,
	onLose,
	opponentShots,
}: GridProps): JSX.Element => {
	const [killedShips, addKilledShip] = useKilledShips();
	const [cells, setCells] = useState<GridCell[][]>([]);

	const isKilled = (ship: Ship) => {
		return killedShips.includes(ship);
	};

	const handleHit = (coordinates: Coordinates) => {
		cells[coordinates.y][coordinates.x].hit();
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
		if (grid.getAvailableShips().length === 0) {
			if (typeof onLose === "function") {
				onLose();
			}
		}
	}, [grid.getAvailableShips()]);

	useEffect(() => {
		const cells = grid.getGrid();
		opponentShots.forEach(({ x, y }) => {
			const currentCell = cells[y][x];
			currentCell.hit();
			const ship = currentCell.getShip();
			if (ship && ship.getIsKilled()) {
				addKilledShip(ship);
				grid.killShip(ship);
			}
		});
		setCells(cells);
	}, [opponentShots]);

	const processColumnDecks = () => {
		const columns = [];
		for (let i = 0; i < grid.getGrid().length; i++) {
			let columnDecks = 0;
			for (let j = 0; j < grid.getGrid().length; j++) {
				columnDecks += grid.getGrid()[j][i].getShip() ? 1 : 0;
			}
			columns.push(columnDecks);
		}
		return columns.map((sum, index) => {
			return (
				<Typography variant="body2" className="h-10 w-10 text-center" key={`${sum}-${index}`}>
					{sum}
				</Typography>
			);
		});
	};

	return (
		<>
			{cells.map((row, rowIndex) => {
				const numberOfDecks = row.map((cell) => cell.getShip()).filter(Boolean).length;
				return (
					<div className="flex flex-nowrap justify-center" key={rowIndex}>
						{row.map((cell) => {
							const { x, y } = cell.getCoordinates();
							const currentShip = cell.getShip();
							const isShip = currentShip != undefined;

							return (
								<Cell
									isOpponentComputer={isOpponentComputer}
									ref={(el) => {
										if (el) {
											cell.setRef(el);
										}
									}}
									cell={cell}
									clickable={clickable}
									onShot={handleShot}
									onMiss={handleMiss}
									onHit={handleHit}
									onKill={(c) => {
										if (isShip) {
											grid.killShip(currentShip);
											addKilledShip(currentShip);
										}
									}}
									isKilled={isShip && isKilled(currentShip)}
									key={`${x}-${y}`}
									className={cx(isShip && show && "bg-amber-500")}
								/>
							);
						})}
						<div className="flex h-10 w-10 items-center">
							{showHints && (
								<Typography variant="body2" className="flex-1 text-center">
									{numberOfDecks}
								</Typography>
							)}
						</div>
					</div>
				);
			})}
			<div className="flex items-center justify-center">
				{showHints && (
					<>
						{processColumnDecks()}
						<div className="h-10 w-10" />
					</>
				)}
			</div>
		</>
	);
};

export default Board;
