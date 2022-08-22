import React, { useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useTokenData } from "data";
import Board from "app/components/board/board";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import { Coordinates } from "app/utils/types";
import { toast } from "react-toastify";
import Ship from "../../utils/game/ship";

const STORAGE_KEYS = {
	playerShots: "playerShots",
	opponentShots: "opponentShots",
	isPlayerTurn: "isPlayerTurn",
};

let isComputerShotSuccessful = false;

const GamePage = () => {
	const { gameId } = useParams<"gameId">();
	const [isPlayerTurn, setPlayerTurn] = useState(
		JSON.parse(sessionStorage.getItem(STORAGE_KEYS.isPlayerTurn) || "null") ?? true,
	);
	const [playerShots, setPlayerShots] = useState<Coordinates[]>(
		JSON.parse(sessionStorage.getItem(STORAGE_KEYS.playerShots) || "[]"),
	);
	const [computerShots, setComputerShots] = useState<Coordinates[]>(
		JSON.parse(sessionStorage.getItem(STORAGE_KEYS.opponentShots) || "[]"),
	);
	const [hasComputerShot, setHasComputerShot] = useState<boolean>(false);

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
	});

	const toggleTurn = () => {
		sessionStorage.setItem("isPlayerTurn", JSON.stringify(!isPlayerTurn));
		setPlayerTurn(!isPlayerTurn);
	};

	if (isGameLoading || !game) {
		return <Loader />;
	}

	if (!tokenData || !gameId) {
		navigate("/");
		return;
	}

	const handleOpponentLose = () => {
		toast.success("You win!");
		sessionStorage.removeItem(STORAGE_KEYS.playerShots);
		sessionStorage.removeItem(STORAGE_KEYS.opponentShots);
		sessionStorage.removeItem(STORAGE_KEYS.isPlayerTurn);
		setTimeout(() => {
			navigate("/");
		}, 1500);
	};

	const handlePlayerLose = () => {
		toast.error("You lose!");
		sessionStorage.removeItem(STORAGE_KEYS.playerShots);
		sessionStorage.removeItem(STORAGE_KEYS.opponentShots);
		sessionStorage.removeItem(STORAGE_KEYS.isPlayerTurn);
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
		computerShots.forEach(({ x, y }) => ship.isAt({ x, y }) && ship.hit({ x, y }));
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
		playerShots.forEach(({ x, y }) => ship.isAt({ x, y }) && ship.hit({ x, y }));
		return ship;
	});

	type SetShotsArgs = {
		setter: React.Dispatch<React.SetStateAction<Coordinates[]>>;
		shots: Coordinates[];
		currentShot: Coordinates;
		storageKey: string;
		opponentShips: Ship[];
	};

	const setShots = ({ setter, shots, currentShot, storageKey, opponentShips }: SetShotsArgs) => {
		setter([...shots, currentShot]);
		const isHit = opponentShips.some((ship) => ship.isAt(currentShot));
		if (!isHit) {
			toggleTurn();
		}
		if (isHit && storageKey === STORAGE_KEYS.opponentShots) {
			isComputerShotSuccessful = true;
		}
		sessionStorage.setItem(storageKey, JSON.stringify([...shots, currentShot]));
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
					setHasComputerShot={setHasComputerShot}
					isPrevShotSuccessful={isComputerShotSuccessful}
					isTurn={isPlayerTurn}
					isOpponentComputer={true}
					opponentShots={computerShots}
					ships={playerShips}
					setShots={(c) =>
						setShots({
							setter: setComputerShots,
							shots: computerShots,
							currentShot: c,
							storageKey: STORAGE_KEYS.opponentShots,
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
					clickable={isPlayerTurn && hasComputerShot}
					isTurn={!isPlayerTurn}
					opponentShots={playerShots}
					hide
					ships={opponentShips}
					setShots={(c) =>
						setShots({
							setter: setPlayerShots,
							shots: playerShots,
							currentShot: c,
							storageKey: STORAGE_KEYS.playerShots,
							opponentShips,
						})
					}
				/>
			</MuiGrid>
		</MuiGrid>
	);
};

export default GamePage;
