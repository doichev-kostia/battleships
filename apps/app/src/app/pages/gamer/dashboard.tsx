import React, { useEffect, useState } from "react";
import { Button, Container, Grid as MuiGrid, Typography } from "@mui/material";
import { Grid } from "app/utils/game/grid";
import { useNavigate } from "react-router-dom";
import { gamerAbsolutePaths, paths } from "app/constants/paths";
import { useInitializeGame, useJoinGame, useTokenData } from "data/hooks";
import { GameRepresentation } from "@battleships/contracts";
import { PreviewBoard } from "app/components/preview-board/preview-board";

const DashboardPage = () => {
	const [grid] = useState(new Grid());
	const [randomizeCounter, setRandomizeCounter] = useState(0);
	const [isRandomDisabled, setIsRandomDisabled] = useState(false);

	const navigate = useNavigate();
	const tokenData = useTokenData();

	const { mutate: initializeGame } = useInitializeGame();
	const { mutate: joinGame } = useJoinGame();

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
						navigate(path, { replace: true });
					},
				});
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
				<MuiGrid item xs={12}>
					<Typography variant="h5" className="mb-4 text-center">
						Prepare your grid
					</Typography>
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
