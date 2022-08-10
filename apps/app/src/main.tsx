import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Router from "app/components/router";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "ui";

const rootElement = document.getElementById("root") || document.body;

const Main = () => {
	return (
		<React.StrictMode>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<StyledEngineProvider injectFirst>
						<Router />
					</StyledEngineProvider>
				</ThemeProvider>
			</BrowserRouter>
		</React.StrictMode>
	);
};

ReactDOM.createRoot(rootElement).render(<Main />);
