import React from "react";
import { Grid, Paper, styled } from "@mui/material";

export interface PublicLayoutProps {
	children: React.ReactNode;
}

const FormContainer = styled(Paper)`
	max-width: 600px;
	margin: 0 auto;
	border-radius: 10px;
	padding: 20px;
`;

export const PublicLayout = ({ children }: PublicLayoutProps) => {
	return (
		<Grid container className="min-h-screen">
			<Grid container item xs={12} className="justify-center content-center">
				<Grid component={FormContainer} elevation={3} className="min-h-content">
					{children}
				</Grid>
			</Grid>
		</Grid>
	);
};
