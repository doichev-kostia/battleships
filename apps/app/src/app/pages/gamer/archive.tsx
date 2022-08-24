import React from "react";
import { List, ListItem, Typography } from "@mui/material";
import { useFetchFinishedGames, useTokenData } from "data";
import { Loader } from "app/components/loader";

const ArchivePage = () => {
	const { role } = useTokenData() || {};

	const { data: finishedGames, isLoading } = useFetchFinishedGames(role?.id || "", {
		enabled: !!role?.id,
	});

	if (!finishedGames || isLoading) {
		return <Loader />;
	}

	return (
		<div>
			<Typography variant="h3">Archive</Typography>
			<List>
				{finishedGames.count > 0 ? (
					finishedGames.items.map((game) => {
						const { players } = game;
						const { user } = players[0].role;
						return (
							<ListItem key={game.id}>
								<Typography variant="body1">You vs {user.username}</Typography>
							</ListItem>
						);
					})
				) : (
					<Typography>No games found</Typography>
				)}
			</List>
		</div>
	);
};

export default ArchivePage;
