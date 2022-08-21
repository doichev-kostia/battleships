import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "app/utils/game/grid";
import { Grid as MuiGrid, styled, Typography } from "@mui/material";
import { useFetchGame, useJoinGame, useStartGame, useTokenData } from "data";
import Board from "app/components/board/board";
import { Loader } from "app/components/loader";
import Ship from "app/utils/game/ship";
import { useQueryClient } from "react-query";

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
	// const { socket } = useContext(SocketContext);
	// const [hasOpponentJoined, setHasOpponentJoined] = useState(false);
	const { gameId } = useParams<"gameId">();
	const grid = useRef(new Grid());

	const tokenData = useTokenData();
	const navigate = useNavigate();
	const { data: game, isLoading } = useFetchGame(gameId || "", {
		enabled: !!gameId,
	});

	const { mutate: joinGame } = useJoinGame();
	const { mutate: startGame } = useStartGame();
	const queryClient = useQueryClient();

	useEffect(() => {
		// socket.on(SOCKET_EVENTS.GAME_JOIN, (data) => {
		// 	debugger;
		// 	if (data.gameId === gameId) {
		// 		setHasOpponentJoined(true);
		// 	}
		// });
	}, []);

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

	// const handleComputerGame = () => {
	// 	const computerGrid = new Grid();
	// 	computerGrid.generateShips();
	// 	const body = {
	// 		gameId: game.id,
	// 		body: {
	// 			ships: computerGrid.getShips().map((ship) => ship.getCoordinates()),
	// 		},
	// 	};
	//
	// 	joinGame(body, {
	// 		onSuccess: ({ id }: GameRepresentation) => {
	// 			startGame(id, {
	// 				onSuccess: () => {
	// 					const path = gamerAbsolutePaths.game.replace(":gameId", game.id);
	// 					queryClient.invalidateQueries(gameKeys.get(game.id));
	// 					queryClient.invalidateQueries(gameKeys.available);
	// 					navigate(path, { replace: true });
	// 				},
	// 			});
	// 		},
	// 	});
	// };

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
					{/*{hasOpponentJoined ? (*/}
					{/*	<Board opponentShots={[]} show={false} clickable={false} grid={grid.current} />*/}
					{/*) : (*/}
					{/*	<Overlay>*/}
					{/*		<Board opponentShots={[]} show={false} clickable={false} grid={grid.current} />*/}
					{/*	</Overlay>*/}
					{/*)}*/}
				</MuiGrid>
			</MuiGrid>
			<div className="mt-7 flex items-center justify-center">
				{/*<Button variant="contained" onClick={handleComputerGame}>*/}
				{/*	Play with computer*/}
				{/*</Button>*/}
			</div>
		</div>
	);
};

export default WaitingRoom;
