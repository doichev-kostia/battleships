import React, { useEffect, useRef, useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useShoot, useTokenData } from "data";
import Board from "app/components/board/board";
import { Grid } from "app/utils/game/grid";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import Ship from "app/utils/game/ship";
import { ShipRepresentation } from "@battleships/contracts/src";
import { Coordinates } from "app/utils/types";
import { toast } from "react-toastify";
import { Computer } from "app/utils/game/computer";

const prepareShips = (grid: Grid, shipEntities: ShipRepresentation[]) => {
	const ships = shipEntities.map(
		({ xStart, yStart, xEnd, yEnd, id }) => new Ship({ xStart, yStart, xEnd, yEnd }, id),
	);
	grid.setShips(ships);
	grid.fillWithShips();
};

const GamePage = () => {
	const { gameId } = useParams<"gameId">();
	const playerGrid = useRef(new Grid());
	const opponentGrid = useRef(new Grid());
	const computer = useRef(new Computer(playerGrid.current));
	const [isComputer, setIsComputer] = useState(false);
	const isPlayerTurn = useRef(Math.random() > 0.5);

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading } = useFetchGame(gameId || "", {
		cacheTime: 0,
		enabled: !!gameId,
		onSuccess: (game) => {
			game.players.forEach((player) => {
				if (game.players.length === 2 && player.role == null) {
					setIsComputer(true);
				}
			});
		},
	});

	useEffect(() => {
		if (!isPlayerTurn) {
			computer.current.shoot();
		}
	}, []);

	// try using sockets, http doesn't work or just save everything when the game is over
	const { mutate: shoot } = useShoot();

	if (isGameLoading || !game) {
		return <Loader />;
	}

	if (!tokenData || !gameId) {
		navigate("/");
		return;
	}

	const handleOpponentLose = () => {
		toast.success("You win!");
		setTimeout(() => {
			navigate("/");
		}, 1500);
	};

	const handlePlayerLose = () => {
		toast.error("You lose!");
		setTimeout(() => {
			navigate("/");
		}, 1500);
	};

	const player = game.players.find(
		(player) => player?.role && player.role.id === tokenData.role.id,
	);

	const opponent = game.players.find((player) => {
		// if a player is a computer
		if (player?.role === null) {
			return true;
		}

		if (player?.role && player.role.id === tokenData.role.id) {
			return false;
		}
	});

	if (!player || !opponent) {
		window.location.reload();
		console.error("player or opponent not found");
		return;
	}

	const handlePlayerMiss = (coords: Coordinates) => {
		isPlayerTurn.current = false;
		if (isComputer) {
			computer.current.shoot();
		}
	};

	const handleOpponentHit = (coords: Coordinates) => {
		if (isComputer) {
			computer.current.setShotSuccessful(true);
			computer.current.shoot();
		}
	};

	const handleOpponentMiss = (coords: Coordinates) => {
		computer.current.setShotSuccessful(false);
		isPlayerTurn.current = true;
	};

	prepareShips(playerGrid.current, player.ships);
	prepareShips(opponentGrid.current, opponent.ships);

	const handleShot = (coordinates: Coordinates, playerId: string) => {
		shoot({
			gameId,
			body: {
				x: coordinates.x,
				y: coordinates.y,
				playerId,
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
					isOpponentComputer={isComputer}
					showHints={true}
					onHit={handleOpponentHit}
					onMiss={handleOpponentMiss}
					onLose={handlePlayerLose}
					onShot={(c) => handleShot(c, opponent.id)}
					clickable={false}
					opponentShots={opponent.shots}
					show={true}
					grid={playerGrid.current}
				/>
			</MuiGrid>
			<MuiGrid item xs={12} md={6} id="opponent">
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Opponent's grid
					</Typography>
				</div>
				<Board
					showHints={true}
					show={false}
					onLose={handleOpponentLose}
					opponentShots={player.shots}
					onShot={(c) => handleShot(c, player.id)}
					onMiss={handlePlayerMiss}
					clickable={isPlayerTurn.current}
					grid={opponentGrid.current}
				/>
			</MuiGrid>
		</MuiGrid>
	);
};

export default GamePage;
