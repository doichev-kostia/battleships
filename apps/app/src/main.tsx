import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Router from "app/routes/router";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "ui";
import { Loader } from "app/components/loader";

const rootElement = document.getElementById("root") || document.body;

const Main = () => {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<StyledEngineProvider injectFirst>
					<Suspense fallback={<Loader />}>
						<Router />
					</Suspense>
				</StyledEngineProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
};

ReactDOM.createRoot(rootElement).render(<Main />);
