import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "app/utils/game/grid";
import { Button, Grid as MuiGrid, styled, Typography } from "@mui/material";
import { useFetchGame, useJoinGame, useStartGame, useTokenData } from "data";
import Board from "app/components/board/board";
import { Loader } from "app/components/loader";
import Ship from "app/utils/game/ship";
import { useQueryClient } from "react-query";
import { GameRepresentation } from "@battleships/contracts";
import { gameKeys } from "data/queryKeys";
import { gamerAbsolutePaths } from "app/constants/paths";

const Overlay = styled("div")`
	position: relative;

	&::after {
		content: "Waiting for opponent...";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		color: #ffffff;
	}
`;

const WaitingRoom = () => {
	const [hasOpponentJoined, setHasOpponentJoined] = useState(false);
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
					<Board opponentShots={[]} show={true} clickable={false} grid={grid.current} />
				</MuiGrid>
				<MuiGrid item xs={12} md={6}>
					{hasOpponentJoined ? (
						<Board opponentShots={[]} show={false} clickable={false} grid={new Grid()} />
					) : (
						<Overlay>
							<Board opponentShots={[]} show={false} clickable={false} grid={new Grid()} />
						</Overlay>
					)}
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
