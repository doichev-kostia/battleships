import React, { useEffect, useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useTokenData } from "data";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import { Coordinates } from "app/utils/types";
import { toast } from "react-toastify";
import Ship from "../../utils/game/ship";
import create from "zustand";
import Board from "../../components/board/board";

const STORAGE_KEYS = {
	playerShots: "playerShots",
	opponentShots: "opponentShots",
	isPlayerTurn: "isPlayerTurn",
};

interface ShotsStore {
	shots: Coordinates[];
	addShot: (c: Coordinates) => void;
}

const usePlayerShotsStore = create<ShotsStore>((set) => ({
	shots: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.playerShots) || "[]"),
	addShot: (c: Coordinates) =>
		set((state) => {
			sessionStorage.setItem(STORAGE_KEYS.playerShots, JSON.stringify([...state.shots, c]));
			return {
				shots: [...state.shots, c],
			};
		}),
}));

const useComputerShotsStore = create<ShotsStore>((set) => ({
	shots: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.opponentShots) || "[]"),
	addShot: (c: Coordinates) =>
		set((state) => {
			sessionStorage.setItem(STORAGE_KEYS.opponentShots, JSON.stringify([...state.shots, c]));
			return {
				shots: [...state.shots, c],
			};
		}),
}));
let renders = 0;
const GamePage = () => {
	const { gameId } = useParams<"gameId">();
	const [isPlayerTurn, setPlayerTurn] = useState(true);
	const playerShots = usePlayerShotsStore((state) => state.shots);
	const addPlayerShot = usePlayerShotsStore((state) => state.addShot);
	const computerShots = useComputerShotsStore((state) => state.shots);
	const addComputerShot = useComputerShotsStore((state) => state.addShot);
	const [isComputerShotSuccessful, setIsComputerShotSuccessful] = useState(false);

	console.log({ renders: renders++ });

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading, refetch } = useFetchGame(gameId || "");

	useEffect(() => {
		if (gameId) {
			refetch();
		}
	}, []);

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
		setter: (c: Coordinates) => void;
		currentShot: Coordinates;
		storageKey: string;
		opponentShips: Ship[];
	};

	const setShots = ({ setter, currentShot, storageKey, opponentShips }: SetShotsArgs) => {
		const isHit = opponentShips.some((ship) => ship.isAt(currentShot));
		if (!isHit) {
			toggleTurn();
			setIsComputerShotSuccessful(false);
		}
		if (isHit && storageKey === STORAGE_KEYS.opponentShots) {
			setIsComputerShotSuccessful(true);
		}
		setter(currentShot);
	};

	console.log({ isPlayerTurn, playerShots, computerShots });
	return (
		<MuiGrid container className="mt-10 items-center justify-between">
			<MuiGrid item xs={12} md={6} className="mb-10 md:mb-0" id="player">
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Your grid
					</Typography>
				</div>
				<Board
					isPrevShotSuccessful={isComputerShotSuccessful}
					isTurn={!isPlayerTurn}
					isOpponentComputer={true}
					opponentShots={computerShots}
					ships={playerShips}
					setShots={(c) =>
						setShots({
							setter: addComputerShot,
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
					clickable={isPlayerTurn}
					isTurn={isPlayerTurn}
					opponentShots={playerShots}
					hide
					ships={opponentShips}
					setShots={(c) =>
						setShots({
							setter: addPlayerShot,
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
