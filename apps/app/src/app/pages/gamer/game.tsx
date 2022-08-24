import React, { useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useFinishGame, useShoot, useTokenData } from "data";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import { Coordinates } from "app/utils/types";
import Ship from "../../utils/game/ship";
import Board from "../../components/board/board";
import { useAtom } from "jotai";
import { gridSizeAtom } from "../../utils/atoms";
import { GAME_STATUS } from "@battleships/contracts";
import { toast } from "react-toastify";

const GamePage = () => {
	const [, setGridSize] = useAtom(gridSizeAtom);
	const { gameId } = useParams<"gameId">();
	const [isPlayerTurn, setPlayerTurn] = useState(true);
	const [isComputerShotSuccessful, setIsComputerShotSuccessful] = useState(false);

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
		onSuccess: (game) => {
			const isSmall = game.players.some((player) => player.ships.length < 5);
			isSmall ? setGridSize("small") : setGridSize("standard");
		},
	});

	const { mutate: finishGame } = useFinishGame();
	const { mutate: shoot } = useShoot();

	if (game && game.status === GAME_STATUS.FINISHED) {
		navigate("/");
	}
	const toggleTurn = () => {
		setPlayerTurn((prevState) => !prevState);
	};

	if (isGameLoading || !game) {
		return <Loader />;
	}

	if (!tokenData || !gameId) {
		navigate("/");
		return;
	}

	const handleLoss = (message: string, severity: "success" | "error") => {
		toast[severity](message);
		setTimeout(() => {
			finishGame({ id: gameId });
			navigate("/");
		}, 1500);
	};

	const handleOpponentLost = () => {
		handleLoss("You win", "success");
	};

	const handlePlayerLost = () => {
		handleLoss("You lost!", "error");
	};

	const player = game.players.find(
		(player) => player?.role && player.role.id === tokenData.role.id,
	);

	const opponent = game.players.find((player) => {
		// if a player is a computer
		if (player?.role === null) {
			return true;
		}
	});

	if (!player || !opponent) {
		window.location.reload();
		return;
	}

	const playerShips = player.ships.map(({ xStart, yStart, xEnd, yEnd, id }) => {
		const ship = new Ship(
			{
				xStart,
				yStart,
				xEnd,
				yEnd,
			},
			id,
		);
		opponent.shots.forEach(({ x, y }) => ship.isAt({ x, y }) && ship.hit({ x, y }));
		return ship;
	});

	const opponentShips = opponent.ships.map(({ xStart, yStart, xEnd, yEnd, id }) => {
		const ship = new Ship(
			{
				xStart,
				yStart,
				xEnd,
				yEnd,
			},
			id,
		);
		player.shots.forEach(({ x, y }) => ship.isAt({ x, y }) && ship.hit({ x, y }));
		return ship;
	});

	type SetShotsArgs = {
		playerId: string;
		currentShot: Coordinates;
		opponentShips: Ship[];
	};

	const setShots = ({ playerId, currentShot, opponentShips }: SetShotsArgs) => {
		const isHit = opponentShips.some((ship) => ship.isAt(currentShot));
		if (!isHit) {
			toggleTurn();
			setIsComputerShotSuccessful(false);
		}
		if (isHit && playerId === opponent.id) {
			setIsComputerShotSuccessful(true);
		}
		shoot({
			gameId,
			body: {
				playerId,
				x: currentShot.x,
				y: currentShot.y,
			},
		});
	};

	return (
		<MuiGrid container className="mt-10 items-center justify-between">
			<MuiGrid item xs={12} md={6} className="mb-10 md:mb-0" id="player">
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Your grid
					</Typography>
				</div>
				<Board
					onLost={handlePlayerLost}
					isPrevShotSuccessful={isComputerShotSuccessful}
					isTurn={!isPlayerTurn}
					isOpponentComputer={true}
					opponentShots={opponent.shots}
					ships={playerShips}
					setShots={(c) =>
						setShots({
							playerId: opponent.id,
							currentShot: c,
							opponentShips: playerShips,
						})
					}
				/>
			</MuiGrid>
			<MuiGrid item xs={12} md={6} id="opponent">
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Opponent's grid
					</Typography>
				</div>
				<Board
					onLost={handleOpponentLost}
					clickable={isPlayerTurn}
					isTurn={isPlayerTurn}
					opponentShots={player.shots}
					// hide
					ships={opponentShips}
					setShots={(c) =>
						setShots({
							playerId: player.id,
							currentShot: c,
							opponentShips,
						})
					}
				/>
			</MuiGrid>
		</MuiGrid>
	);
};

export default GamePage;
