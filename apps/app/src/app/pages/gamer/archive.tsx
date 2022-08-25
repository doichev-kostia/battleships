import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useExportFinishedGames, useFetchFinishedGames, useTokenData } from "data";
import { Loader } from "app/components/loader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { saveBlob } from "../../utils/helpers";

const ArchivePage = () => {
	const { role } = useTokenData() || {};

	const { data: finishedGames, isLoading } = useFetchFinishedGames(role?.id || "", {
		enabled: !!role?.id,
	});
	const { refetch } = useExportFinishedGames(role?.id || "", {
		enabled: false,
		onError: (error) => {
			toast.error(error.message || "An error has occurred while downloading the file");
		},
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
			winner: winner?.role?.user.username || "Computer",
		};
	});

	const handleExport = () => {
		refetch().then(({ data }) => {
			if (!data) return;
			saveBlob(data, `${new Date().toLocaleDateString()}-game-results.json`);
		});
	};

	return (
		<div className="px-10">
			<Typography variant="h3">Archive</Typography>
			<Box sx={{ height: 400, width: "100%" }}>
				<DataGrid columns={columns} rows={rows} />
			</Box>
			<div className="mt-10">
				<Button variant="contained" onClick={handleExport}>
					Export as JSON
				</Button>
			</div>
		</div>
	);
};

export default ArchivePage;
