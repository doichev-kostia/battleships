import React, { useState } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useTokenData } from "data";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import { Coordinates } from "app/utils/types";
import { toast } from "react-toastify";
import Ship from "../../utils/game/ship";
import create from "zustand";
import Board from "../../components/board/board";
import { useAtom } from "jotai";
import { gridSizeAtom } from "../../utils/atoms";

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
const renders = 0;
const GamePage = () => {
	const [, setGridSize] = useAtom(gridSizeAtom);
	const { gameId } = useParams<"gameId">();
	const [isPlayerTurn, setPlayerTurn] = useState(true);
	const playerShots = usePlayerShotsStore((state) => state.shots);
	const addPlayerShot = usePlayerShotsStore((state) => state.addShot);
	const computerShots = useComputerShotsStore((state) => state.shots);
	const addComputerShot = useComputerShotsStore((state) => state.addShot);
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

	const handleOpponentLost = () => {
		toast.success("You win!");
		sessionStorage.removeItem(STORAGE_KEYS.playerShots);
		sessionStorage.removeItem(STORAGE_KEYS.opponentShots);
		setTimeout(() => {
			navigate("/");
		}, 1500);
	};

	const handlePlayerLost = () => {
		toast.error("You lose!");
		sessionStorage.removeItem(STORAGE_KEYS.playerShots);
		sessionStorage.removeItem(STORAGE_KEYS.opponentShots);
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
					onLost={handleOpponentLost}
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
