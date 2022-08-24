import React, { useEffect, useState } from "react";
import Ship from "../../utils/game/ship";
import { Typography } from "@mui/material";
import { Coordinates } from "../../utils/types";
import { getRandomInt } from "../../utils/helpers";
import { Grid } from "../../utils/game/grid";
import { Cell } from "../../utils/game/cell";
import cx from "classnames";
import { useAtom } from "jotai";
import { gridSizeAtom } from "../../utils/atoms";

interface BoardProps {
	ships: Ship[];
	hide?: boolean;
	clickable?: boolean;
	opponentShots: Coordinates[];
	setShots: (c: Coordinates) => void;
	isOpponentComputer?: boolean;
	isTurn: boolean;
	isPrevShotSuccessful?: boolean;
	onLost: () => void;
}

const generateRandomCoordinates = (availableCells: Cell[]) => {
	const index = getRandomInt(0, availableCells.length);
	const cell = availableCells[index];
	return cell.getCoordinates();
};

let prevShot: Coordinates | null = null;

const Board = ({
	clickable = false,
	ships,
	hide = false,
	opponentShots,
	setShots,
	isOpponentComputer = false,
	isPrevShotSuccessful = false,
	isTurn,
	onLost,
}: BoardProps): JSX.Element => {
	const [gridSize] = useAtom(gridSizeAtom);
	const [grid, setGrid] = useState(new Grid(gridSize));

	useEffect(() => {
		setGrid(new Grid(gridSize));
	}, [gridSize]);

	grid.setShips(ships);
	grid.getGrid().forEach((row) => {
		row.forEach((cell) => {
			const { x, y } = cell.getCoordinates();
			ships.forEach((ship) => ship.isAt({ x, y }) && cell.setShip(ship));
			const isHit = opponentShots.some((c) => c.x === x && c.y === y);
			if (isHit) {
				cell.hit();
			}

			const ship = cell.getShip();
			if (ship?.getIsKilled()) {
				grid.killShip(ship);
			}
		});
	});

	if (grid.getShips().length > 0 && grid.getAvailableShips()?.length === 0) {
		onLost();
		return <Typography>You lost!</Typography>;
	}

	const processColumnDecks = () => {
		const columns: number[] = [];
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

	const handleClick = ({ x, y }: Coordinates) => {
		setShots({ x, y });
	};

	const makeComputerShot = () => {
		let availableCells = grid.getAvailableCells();
		if (!availableCells) {
			onLost();
			return;
		}
		if (isPrevShotSuccessful && prevShot) {
			const neighbours = grid.getNeighbours(prevShot);
			const filtered = neighbours.filter((cell) => !cell.getIsHit());
			if (filtered.length > 0) {
				availableCells = filtered;
			}
		}
		const coordinates = generateRandomCoordinates(availableCells);
		prevShot = coordinates;
		setShots(coordinates);
	};

	if (isOpponentComputer && isTurn) {
		makeComputerShot();
	}

	return (
		<>
			{grid.getGrid().map((row, rowIndex) => {
				const numberOfDecks = row.map((cell) => cell.getShip()).filter(Boolean).length;
				return (
					<div className="flex flex-nowrap justify-center" key={rowIndex}>
						{row.map((cell) => {
							const { x, y } = cell.getCoordinates();
							const ship = cell.getShip();
							const isHit = cell.getIsHit();

							const color = (() => {
								if (ship?.getIsKilled()) return "bg-red-500";
								if (!!ship && isHit) return "bg-green-500";
								if (!!ship && !hide) return "bg-yellow-600";
								if (isHit) return "bg-blue-500";
							})();

							return (
								<div
									key={`${x}-${y}`}
									role="button"
									tabIndex={0}
									onClick={() => !isHit && clickable && handleClick({ x, y })}
									className={cx(color, "h-10 w-10 cursor-pointer border border-solid")}
								/>
							);
						})}
						<div className="flex h-10 w-10 items-center">
							<Typography variant="body2" className="flex-1 text-center">
								{numberOfDecks}
							</Typography>
						</div>
					</div>
				);
			})}
			<div className="flex items-center justify-center">
				<>
					{processColumnDecks()}
					<div className="h-10 w-10" />
				</>
			</div>
		</>
	);
};

export default Board;
