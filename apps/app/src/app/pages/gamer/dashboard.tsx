import React, { useMemo, useRef } from "react";
import { Button, Container, Grid as MuiGrid, List, ListItem, Typography } from "@mui/material";
import { Cell } from "app/components/cell";
import { Cell as GridCell } from "app/utils/game/cell";
import { Grid } from "app/utils/game/grid";
import { Link } from "react-router-dom";
import { gamerAbsolutePaths } from "app/constants/paths";
import cx from "classnames";
import { GAME_CONFIG, SHIPS } from "app/constants/game-config";

const createShips = () => {
	const { ships } = GAME_CONFIG;

	return ships.map((ship) => {
		const CELL_WIDTH = 20;
		const componentLength = ship.size * CELL_WIDTH;
		const shipName = SHIPS.get(ship.size);
		return (
			<ListItem
				key={ship.size}
				sx={{
					width: componentLength,
				}}
				className="bg-amber-300 block"
			>
				<Typography variant="body1">{shipName}</Typography>
				<Typography variant="body1">x: {ship.quantity}</Typography>
			</ListItem>
		);
	});
};

const games = [
	{
		id: "1",
		name: "Game 1",
		players: [
			{
				id: "1",
				name: "Player 1",
			},
		],
	},
	{
		id: "2",
		name: "Game 2",
		players: [
			{
				id: "2",
				name: "Player 2",
			},
		],
	},
];

const generateGrid = (grid: GridCell[][]) => {
	return grid.map((row, rowIndex) => {
		return (
			<div className="flex flex-nowrap justify-center" key={rowIndex}>
				{row.map((cell) => {
					const x = cell.getX();
					const y = cell.getY();
					const isShip = cell.getHasShip();
					return (
						<Cell
							key={`${x}-${y}`}
							className={cx(isShip && "bg-amber-500")}
							coordinates={{ x, y }}
						/>
					);
				})}
			</div>
		);
	});
};

const DashboardPage = () => {
	const grid = useRef<Grid>(new Grid());

	const board = useMemo(() => generateGrid(grid.current.getGrid()), [grid.current]);
	const ships = useMemo(() => createShips(), []);
	return (
		<Container component="main" maxWidth="xl" className="mt-3">
			<Typography variant="h3" className="mb-10">
				Dashboard
			</Typography>
			<MuiGrid container rowSpacing={2} columnSpacing={2}>
				<MuiGrid item xs={12} md={3}>
					<Typography variant="h5">Available games</Typography>
					<List>
						{games.map((game) => {
							const { players } = game;
							const player = players[0];
							return (
								<ListItem key={game.id} className="flex justify-between items-center pl-0">
									<div>
										<Typography variant="body1">{game.name}</Typography>
										<Typography variant="body2">{player.name}</Typography>
									</div>
									<div>
										<Button
											component={Link}
											to={gamerAbsolutePaths.game.replace(":id", game.id)}
											variant="contained"
											color="primary"
											className="no-underline"
										>
											Join
										</Button>
									</div>
								</ListItem>
							);
						})}
					</List>
				</MuiGrid>
				<MuiGrid item xs={12} md={9}>
					<Typography variant="h5" className="text-center mb-4">
						Prepare your grid
					</Typography>
					<div className="flex flex-col justify-center items-center">{board}</div>
					<List className="flex flex-col gap-y-10">{ships}</List>
				</MuiGrid>
			</MuiGrid>
		</Container>
	);
};

export default DashboardPage;
