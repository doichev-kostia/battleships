import React, { useRef } from "react";
import { Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useShoot, useTokenData } from "data";
import Board from "app/components/board/board";
import { Grid } from "app/utils/game/grid";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "app/components/loader";
import Ship from "app/utils/game/ship";
import { ShipRepresentation } from "@battleships/contracts/src";
import { Coordinates } from "app/utils/types";

const makeShips = (ships: ShipRepresentation[]) => {
	return ships.map(({ xStart, yStart, xEnd, yEnd }) => new Ship({ xStart, yStart, xEnd, yEnd }));
};

const GamePage = () => {
	const { gameId } = useParams<"gameId">();
	const playerGrid = useRef(new Grid());
	const opponentGrid = useRef(new Grid());
	// const [isPlayerTurn, toggleTurn] = useToggleState(Math.random() > 0.5);

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading: isGameLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
	});

	const { mutate: shoot } = useShoot();

	if (isGameLoading || !game) {
		return <Loader />;
	}

	if (!tokenData || !gameId) {
		navigate("/");
		return;
	}

	const player = game.players.find(
		(player) => player?.role && player.role.id === tokenData.role.id,
	);
	const playerCells = playerGrid.current.getGrid();
	const opponentCells = opponentGrid.current.getGrid();

	const opponent = game.players.find((player) => {
		// if a player is a computer
		if (player?.role === null) {
			return true;
		}

		if (player?.role && player.role.id === tokenData.role.id) {
			return false;
		}
	});

	const playerShips = makeShips(player.ships);
	const opponentShips = makeShips(opponent.ships);

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
			<MuiGrid item xs={12} md={6} className="mb-10 md:mb-0">
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Your grid
					</Typography>
				</div>
				<Board
					clickable={false}
					opponentShots={opponent.shots}
					show={true}
					ships={playerShips}
					grid={playerCells}
				/>
			</MuiGrid>
			<MuiGrid item xs={12} md={6}>
				<div className="mb-5">
					<Typography variant="h5" className="text-center">
						Opponent's grid
					</Typography>
				</div>
				<Board
					opponentShots={player.shots}
					onShot={(c) => handleShot(c, player.id)}
					// onMiss={() => toggleTurn()}
					ships={opponentShips}
					// clickable={isPlayerTurn}
					grid={opponentCells}
				/>
			</MuiGrid>
		</MuiGrid>
	);
};

export default GamePage;
