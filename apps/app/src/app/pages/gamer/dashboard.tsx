import React, { useContext, useEffect, useState } from "react";
import {
	Button,
	Container,
	FormControl,
	Grid as MuiGrid,
	InputLabel,
	List,
	ListItem,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import { Grid } from "app/utils/game/grid";
import { useNavigate } from "react-router-dom";
import { gamerAbsolutePaths, paths } from "app/constants/paths";
import { useFetchAvailableGames, useInitializeGame, useJoinGame, useTokenData } from "data/hooks";
import { GameRepresentation, SOCKET_EVENTS } from "@battleships/contracts";
import { PreviewBoard } from "app/components/preview-board/preview-board";
import { SocketContext } from "../../utils/socket-provider";
import { useQueryClient } from "react-query";
import { gameKeys } from "../../../data/queryKeys";
import { Loader } from "../../components/loader";
import { GridSize } from "app/constants/game-config";
import { useAtom } from "jotai";
import { gridSizeAtom } from "app/utils/atoms";
import { toast } from "react-toastify";

const DashboardPage = () => {
	const [gridSize, setGridSize] = useAtom(gridSizeAtom);
	const { socket } = useContext(SocketContext);
	const [grid, setGrid] = useState(new Grid(gridSize));
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

	useEffect(() => {
		const newGrid = new Grid(gridSize);
		newGrid.generateShips();
		setGrid(newGrid);
		setRandomizeCounter(randomizeCounter + 1);
	}, [gridSize]);

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
		if (gridSize === "small") {
			toast.error("You can't join a game with a small grid size");
			return;
		}
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
			onError: (error) => {
				toast.error(error.message);
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
					<div className="mb-7 flex justify-center">
						<FormControl className="min-w-[320px]">
							<InputLabel id="game-size">Size</InputLabel>
							<Select
								labelId="game-size"
								id="game-size-select"
								value={gridSize}
								label="Size"
								onChange={({ target: { value } }: SelectChangeEvent<GridSize>) =>
									setGridSize(value as GridSize)
								}
							>
								<MenuItem value="small">Small (6 * 6)</MenuItem>
								<MenuItem value="standard">Standard (11 * 11)</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="flex flex-col items-center justify-center">
						<PreviewBoard grid={grid} />
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
