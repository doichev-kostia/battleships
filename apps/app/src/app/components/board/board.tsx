import React, { useRef } from "react";
import Ship from "../../utils/game/ship";
import { Typography } from "@mui/material";
import { Coordinates } from "../../utils/types";
import { getRandomInt } from "../../utils/helpers";
import { Grid } from "../../utils/game/grid";
import { Cell } from "../../utils/game/cell";
import cx from "classnames";

interface BoardProps {
	ships: Ship[];
	hide?: boolean;
	clickable?: boolean;
	opponentShots: Coordinates[];
	setShots: (c: Coordinates) => void;
	isOpponentComputer?: boolean;
	isTurn: boolean;
	isPrevShotSuccessful?: boolean;
}

const generateRandomCoordinates = (availableCells: Cell[]) => {
	const index = getRandomInt(0, availableCells.length);
	const cell = availableCells[index];
	return cell.getCoordinates();
};

const Board = ({
	clickable = false,
	ships,
	hide = false,
	opponentShots,
	setShots,
	isOpponentComputer = false,
	isPrevShotSuccessful = false,
	isTurn,
}: BoardProps): JSX.Element => {
	const grid = useRef(new Grid());

	grid.current.setShips(ships);
	grid.current.getGrid().forEach((row) => {
		row.forEach((cell) => {
			const { x, y } = cell.getCoordinates();
			ships.forEach((ship) => ship.isAt({ x, y }) && cell.setShip(ship));
			const isHit = opponentShots.some((c) => c.x === x && c.y === y);
			if (isHit) {
				cell.hit();
			}

			if (cell.getShip()?.getIsKilled()) {
				grid.current.killShip(cell.getShip());
			}
		});
	});

	if (grid.current.getShips().length > 0 && grid.current.getAvailableShips()?.length === 0) {
		console.log("You lost!");
		return <div>LOST</div>;
	}

	const processColumnDecks = () => {
		const columns: number[] = [];
		for (let i = 0; i < grid.current.getGrid().length; i++) {
			let columnDecks = 0;
			for (let j = 0; j < grid.current.getGrid().length; j++) {
				columnDecks += grid.current.getGrid()[j][i].getShip() ? 1 : 0;
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
		const availableCells = grid.current.getAvailableCells();
		if (!availableCells) {
			console.log("no available cells");
			return;
		}
		const coordinates = generateRandomCoordinates(availableCells);
		setShots(coordinates);
	};

	if (isOpponentComputer && isTurn) {
		makeComputerShot();
	}

	return (
		<>
			{grid.current.getGrid().map((row, rowIndex) => {
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
