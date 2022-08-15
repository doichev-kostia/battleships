import React from "react";
import { CircularProgress } from "@mui/material";

export const Loader = () => {
	return (
		<div className="fixed inset-0 flex justify-center items-center z-50">
			<CircularProgress data-cy="loader" />
		</div>
	);
};
