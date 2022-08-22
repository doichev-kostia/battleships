import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "app/utils/game/grid";
import { Button, Grid as MuiGrid, Typography } from "@mui/material";
import { useFetchGame, useJoinGame, useStartGame, useTokenData } from "data";
import { Loader } from "app/components/loader";
import Ship from "app/utils/game/ship";
import { useQueryClient } from "react-query";
import { GameRepresentation } from "@battleships/contracts";
import { gameKeys } from "data/queryKeys";
import { gamerAbsolutePaths } from "app/constants/paths";
import { PreviewBoard } from "../../components/preview-board/preview-board";

const WaitingRoom = () => {
	const { gameId } = useParams<"gameId">();
	const grid = useRef(new Grid());

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
		cacheTime: 0,
	});

	const { mutate: joinGame } = useJoinGame();
	const { mutate: startGame } = useStartGame();
	const queryClient = useQueryClient();

	if (isLoading || !game) {
		return <Loader />;
	}

	if (!tokenData) {
		navigate("/");
		return;
	}

	(() => {
		const player = game.players.find(
			(player) => player?.role && player.role.id === tokenData.role.id,
		);

		if (!player) {
			navigate("/");
			return;
		}

		const playerShips = player.ships.map(
			({ xStart, yStart, xEnd, yEnd, id }) => new Ship({ xStart, yStart, xEnd, yEnd }, id),
		);
		grid.current.setShips(playerShips);
		grid.current.fillWithShips();
	})();

	const handleComputerGame = () => {
		const computerGrid = new Grid();
		computerGrid.generateShips();
		const body = {
			gameId: game.id,
			body: {
				ships: computerGrid.getShips().map((ship) => ship.getCoordinates()),
			},
		};

		joinGame(body, {
			onSuccess: ({ id }: GameRepresentation) => {
				startGame(id, {
					onSuccess: () => {
						const path = gamerAbsolutePaths.game.replace(":gameId", game.id);
						queryClient.invalidateQueries(gameKeys.get(game.id));
						queryClient.invalidateQueries(gameKeys.available);
						navigate(path, { replace: true });
					},
				});
			},
		});
	};

	return (
		<div>
			<div className="mt-5">
				<Typography variant="h5" className="text-center">
					Waiting room
				</Typography>
			</div>
			<MuiGrid container className="mt-10 items-center justify-between">
				<MuiGrid item xs={12} md={6} className="mb-10 md:mb-0">
					<PreviewBoard grid={grid.current} />
				</MuiGrid>
			</MuiGrid>
			<div className="mt-7 flex items-center justify-center">
				<Button variant="contained" onClick={handleComputerGame}>
					Play with computer
				</Button>
			</div>
		</div>
	);
};

export default WaitingRoom;
