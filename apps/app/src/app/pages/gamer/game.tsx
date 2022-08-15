import React, { useEffect, useState } from "react";
import { GAME_CONFIG } from "app/constants/game-config";
import { Game } from "app/utils/game/game";
import { Loader } from "app/components/loader";
import { Grid } from "@mui/material";
import { Cell } from "app/components/cell";
import { Cell as GridCell } from "app/utils/game/cell";

const generateGrid = (grid: GridCell[][]) => {
	return grid.map((row, rowIndex) => {
		return (
			<div className="flex flex-nowrap justify-center" key={rowIndex}>
				{row.map((cell) => {
					const x = cell.getX();
					const y = cell.getY();
					return <Cell key={`${x}-${y}`} coordinates={{ x, y }} />;
				})}
			</div>
		);
	});
};

const GamePage = () => {
	const [game, setGame] = useState<Game | null>(null);

	useEffect(() => {
		setGame(new Game(GAME_CONFIG));
	}, []);

	if (!game) {
		return <Loader />;
	}

	window.game = game;
	const playerGrid = generateGrid(game.getPlayerGrid());
	const opponentGrid = generateGrid(game.getOpponentGrid());

	return (
		<Grid container className="justify-between items-center mt-10">
			<Grid item xs={12} md={6} className="mb-10 md:mb-0">
				{playerGrid}
			</Grid>
			<Grid item xs={12} md={6}>
				{opponentGrid}
			</Grid>
		</Grid>
	);
};

export default GamePage;
