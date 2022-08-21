import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Grid as MuiGrid, List, ListItem, Typography } from "@mui/material";
import { Grid } from "app/utils/game/grid";
import { useNavigate } from "react-router-dom";
import { gamerAbsolutePaths, paths } from "app/constants/paths";
import { useFetchAvailableGames, useInitializeGame, useJoinGame, useTokenData } from "data/hooks";
import { GameRepresentation, SOCKET_EVENTS } from "@battleships/contracts";
import Board from "app/components/board/board";
import { Loader } from "app/components/loader";
import { useQueryClient } from "react-query";
import { SocketContext } from "app/utils/socket-provider";
import { gameKeys } from "data/queryKeys";

const DashboardPage = () => {
	const { socket } = useContext(SocketContext);
	const [grid] = useState(new Grid());
	const [randomizeCounter, setRandomizeCounter] = useState(0);
	const [isRandomDisabled, setIsRandomDisabled] = useState(false);

	const navigate = useNavigate();
	const tokenData = useTokenData();
	const queryClient = useQueryClient();

	const { mutate: initializeGame } = useInitializeGame();
	const { mutate: joinGame } = useJoinGame();
	const { data: availableGames, isLoading } = useFetchAvailableGames(tokenData?.role.id || "", {
		enabled: !!tokenData?.role.id,
	});

	/**
	 * @todo:
	 * 1. add get available games query by checking whether the game has 2 players and 1 of them is not the current user
	 * 2. invalidate the query when the new game is created by listening to the socket event
	 * 3. add a new game to the list of available games
	 * 4. join the new game and redirect to the waiting room page + disable it for other users
	 */

	if (!tokenData) {
		navigate(`/${paths.signIn}`);
		return;
	}

	useEffect(() => {
		socket.on(SOCKET_EVENTS.GAME_JOIN, () => {
			queryClient.invalidateQueries(gameKeys.available);
		});

		socket.on(SOCKET_EVENTS.GAME_START, () => {
			queryClient.invalidateQueries(gameKeys.available);
		});

		grid.generateShips();
	}, []);

	const handlePlay = () => {
		initializeGame(null, {
			onSuccess: ({ id }: GameRepresentation) => {
				const body = {
					gameId: id,
					body: {
						userId: tokenData.userId,
						ships: grid.getShips().map((ship) => ship.getCoordinates()),
					},
				};
				joinGame(body, {
					onSuccess: () => {
						const path = gamerAbsolutePaths.waitingRoom.replace(":gameId", id);
						socket.emit(SOCKET_EVENTS.GAME_INIT);
						socket.emit(SOCKET_EVENTS.GAME_JOIN, { gameId: id });
						navigate(path, { replace: true });
					},
				});
			},
		});
	};

	const handleJoin = (gameId: string) => {
		const body = {
			gameId,
			body: {
				userId: tokenData.userId,
				ships: grid.getShips().map((ship) => ship.getCoordinates()),
			},
		};
		joinGame(body, {
			onSuccess: () => {
				const path = gamerAbsolutePaths.waitingRoom.replace(":gameId", gameId);
				socket.emit(SOCKET_EVENTS.GAME_JOIN, { gameId });
				navigate(path, { replace: true });
			},
		});
	};

	const handleRandomize = () => {
		grid.generateShips();

		setRandomizeCounter((prevState) => prevState + 1);
		setIsRandomDisabled(() => {
			return true;
		});
		setTimeout(() => {
			setIsRandomDisabled(false);
		}, 1500);
	};

	return (
		<Container component="main" maxWidth="xl" className="mt-3">
			<Typography variant="h3" className="mb-10">
				Dashboard
			</Typography>
			<MuiGrid container rowSpacing={2} columnSpacing={2}>
				<MuiGrid item xs={12} md={3}>
					<Typography variant="h5">Available games</Typography>
					<List>
						{!isLoading && availableGames?.items ? (
							availableGames.items.map((game) => {
								const { players } = game;
								const { user } = players[0].role;
								return (
									<ListItem key={game.id} className="flex items-center justify-between pl-0">
										<div>
											<Typography variant="body1">{user.username}</Typography>
										</div>
										<div>
											<Button
												onClick={() => handleJoin(game.id)}
												variant="contained"
												color="primary"
												className="no-underline"
											>
												Join
											</Button>
										</div>
									</ListItem>
								);
							})
						) : (
							<Loader />
						)}
					</List>
				</MuiGrid>
				<MuiGrid item xs={12} md={9}>
					<Typography variant="h5" className="mb-4 text-center">
						Prepare your grid
					</Typography>
					<div className="flex flex-col items-center justify-center">
						<Board opponentShots={[]} show={true} clickable={false} grid={grid} />
					</div>
					<div className="mt-4 flex justify-center">
						<Button variant="contained" onClick={handleRandomize} disabled={isRandomDisabled}>
							Randomize layout
						</Button>
					</div>
					<div className="mt-4 flex justify-center">
						<Button variant="contained" onClick={handlePlay}>
							Play
						</Button>
					</div>
				</MuiGrid>
			</MuiGrid>
		</Container>
	);
};

export default DashboardPage;
