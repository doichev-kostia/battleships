import React from "react";
import { GAME_CONFIG } from "app/constants/game-config";
import Ship from "../../utils/game/ship";
import { Typography } from "@mui/material";
import { Coordinates } from "../../utils/types";
import { getRandomInt } from "../../utils/helpers";

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

let counter = 0;
const queue: Coordinates[] = [];
const generateRandomCoordinates = (successfulShot?: Coordinates) => {
	console.log({ counter: counter++ });
	// if (successfulShot) {
	// 	queue = [
	// 		{
	// 			x: successfulShot.x - 1,
	// 			y: successfulShot.y,
	// 		},
	// 		{
	// 			x: successfulShot.x + 1,
	// 			y: successfulShot.y,
	// 		},
	// 		{
	// 			x: successfulShot.x,
	// 			y: successfulShot.y - 1,
	// 		},
	// 		{
	// 			x: successfulShot.x,
	// 			y: successfulShot.y + 1,
	// 		},
	// 	];
	// }
	//
	// if (queue.length) {
	// 	return queue.pop() as Coordinates;
	// }

	const x = getRandomInt(0, GAME_CONFIG.size + 1);
	const y = getRandomInt(0, GAME_CONFIG.size + 1);

	return { x, y } as Coordinates;
};

const isValidShot = (coordinates: Coordinates, opponentShots: Coordinates[]) => {
	const { x, y } = coordinates;
	const isInRange = x >= 0 && x < GAME_CONFIG.size && y >= 0 && y < GAME_CONFIG.size;
	if (!isInRange) {
		return false;
	}

	return !opponentShots.some((c) => c.x === x && c.y === y);
};

let prevShot: Coordinates;

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
	const processColumnDecks = () => {
		const columns = [];
		for (let i = 0; i < GAME_CONFIG.size; i++) {
			let columnDecks = 0;
			for (let j = 0; j < GAME_CONFIG.size; j++) {
				columnDecks += Number(ships.some((ship) => ship.isAt({ x: i, y: j })));
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
		let coordinates: Coordinates = generateRandomCoordinates(
			isPrevShotSuccessful ? prevShot : undefined,
		);
		while (!isValidShot(coordinates, opponentShots)) {
			coordinates = generateRandomCoordinates(isPrevShotSuccessful ? prevShot : undefined);
		}
		prevShot = coordinates;
		setShots(coordinates);
	};

	if (isOpponentComputer && isTurn) {
		makeComputerShot();
	}

	return <button onClick={makeComputerShot}>click</button>;

	// return (
	// 	<>
	// 		{[...Array(GAME_CONFIG.size)].map((_, y) => {
	// 			let numberOfDecks = 0;
	// 			[...Array(GAME_CONFIG.size)].forEach((_, x) => {
	// 				if (ships.some((ship) => ship.isAt({ x, y }))) {
	// 					numberOfDecks++;
	// 				}
	// 			});
	// 			return (
	// 				<div className="flex flex-nowrap justify-center" key={y}>
	// 					{[...Array(GAME_CONFIG.size)].fill(0).map((_, x) => {
	// 						const ship = ships.find((ship) => ship.isAt({ x, y }));
	// 						const isHit = opponentShots.some((c) => c.x === x && c.y === y);
	//
	// 						const color = (() => {
	// 							if (ship?.getIsKilled()) return "bg-red-500";
	// 							if (!!ship && isHit) return "bg-green-500";
	// 							if (!!ship && !hide) return "bg-yellow-600";
	// 							if (isHit) return "bg-blue-500";
	// 						})();
	//
	// 						return (
	// 							<div
	// 								key={`${x}-${y}`}
	// 								role="button"
	// 								tabIndex={0}
	// 								onClick={() => !isHit && clickable && handleClick({ x, y })}
	// 								className={cx(color, "h-10 w-10 cursor-pointer border border-solid")}
	// 							/>
	// 						);
	// 					})}
	// 					<div className="flex h-10 w-10 items-center">
	// 						<Typography variant="body2" className="flex-1 text-center">
	// 							{numberOfDecks}
	// 						</Typography>
	// 					</div>
	// 				</div>
	// 			);
	// 		})}
	// 		<div className="flex items-center justify-center">
	// 			<>
	// 				{processColumnDecks()}
	// 				<div className="h-10 w-10" />
	// 			</>
	// 		</div>
	// 	</>
	// );
};

export default Board;
