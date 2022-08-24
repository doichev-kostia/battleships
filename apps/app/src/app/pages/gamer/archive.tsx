import React from "react";
import { Box, Typography } from "@mui/material";
import { useFetchFinishedGames, useTokenData } from "data";
import { Loader } from "app/components/loader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ArchivePage = () => {
	const { role } = useTokenData() || {};

	const { data: finishedGames, isLoading } = useFetchFinishedGames(role?.id || "", {
		enabled: !!role?.id,
	});

	if (!finishedGames || isLoading) {
		return <Loader />;
	}

	const columns: GridColDef[] = [
		{
			field: "username",
			headerName: "Player 1",
			width: 150,
			editable: false,
		},
		{
			field: "username2",
			headerName: "Player2",
			width: 150,
			editable: false,
		},
		{
			field: "createdAt",
			headerName: "Date",
			width: 200,
			editable: false,
		},
		{
			field: "winner",
			headerName: "Winner",
			sortable: false,
			width: 120,
		},
	];

	const rows = finishedGames.items.map((game) => {
		const { players, createdAt } = game;
		const usernames = players.map((player) => {
			const role = player.role;
			if (role === null) {
				return "Computer";
			}
			return role.user.username;
		});
		const winner = players.find((player) => player.isWinner);

		return {
			id: game.id,
			username: usernames[0],
			username2: usernames[1],
			createdAt: createdAt,
			winner: winner?.user.username || "Computer",
		};
	});

	return (
		<div className="px-10">
			<Typography variant="h3">Archive</Typography>
			<Box sx={{ height: 400, width: "100%" }}>
				<DataGrid columns={columns} rows={rows} />
			</Box>
		</div>
	);
};

export default ArchivePage;
