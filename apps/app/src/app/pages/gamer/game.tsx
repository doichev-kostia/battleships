import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useFinishGame, useSaveWinner, useShoot, useTokenData } from "data";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import { Coordinates } from "app/utils/types";
import Ship from "../../utils/game/ship";
import Board from "../../components/board/board";
import { useAtom } from "jotai";
import { gridSizeAtom } from "../../utils/atoms";
import { GAME_STATUS, SOCKET_EVENTS } from "@battleships/contracts";
import { toast } from "react-toastify";
import { SocketContext } from "app/utils/socket-provider";
import { useQueryClient } from "react-query";
import { gameKeys } from "../../../data/queryKeys";

const GamePage = () => {
	const { socket } = useContext(SocketContext);
	const [, setGridSize] = useAtom(gridSizeAtom);
	const { gameId } = useParams<"gameId">();
	const [isPlayerTurn, setPlayerTurn] = useState(true);
	const [isComputerShotSuccessful, setIsComputerShotSuccessful] = useState(false);
	const isComputer = useRef(false);

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
		onSuccess: (game) => {
			const isSmall = game.players.some((player) => player.ships.length < 5);
			isSmall ? setGridSize("small") : setGridSize("standard");
			isComputer.current = game.players.some((player) => player.role === null);
		},
	});

	const { mutate: finishGame } = useFinishGame();
	const { mutate: shoot } = useShoot();
	const { mutate: saveWinner } = useSaveWinner();
	const queryClient = useQueryClient();

	useEffect(() => {
		socket.emit(SOCKET_EVENTS.GAME_JOIN, { gameId });
		socket.on(SOCKET_EVENTS.SHOT_FIRED, ({ isHit }) => {
			if (!isHit) {
				setPlayerTurn(true);
			}
			queryClient.invalidateQueries(gameKeys.get(gameId as string));
		});
	}, []);

	console.log({ isPlayerTurn });

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

	const handleLost = (opponentId: string, message: string, severity: "success" | "error") => {
		toast[severity](message);
		setTimeout(() => {
			saveWinner(opponentId);
			finishGame({ id: gameId });
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

		return player?.role && player.role.id !== tokenData.role.id;
	});

	if (!player || !opponent) {
		window.location.reload();
		return;
	}

	const handleOpponentLost = () => {
		handleLost(player.id, "You win", "success");
	};

	const handlePlayerLost = () => {
		handleLost(opponent.id, "You lost!", "error");
	};

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
		shoot(
			{
				gameId,
				body: {
					playerId,
					x: currentShot.x,
					y: currentShot.y,
				},
			},
			{
				onSuccess: () => {
					socket.emit(SOCKET_EVENTS.SHOT_FIRED, { isHit });
				},
			},
		);
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
					isOpponentComputer={isComputer.current}
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
					hide
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
