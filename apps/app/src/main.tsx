import "./reset.css";
import "./index.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "app/routes/router";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "ui";
import { Loader } from "app/components/loader";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const rootElement = document.getElementById("root") || document.body;
// Create a client
const queryClient = new QueryClient();

const Main = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<StyledEngineProvider injectFirst>
						<Suspense fallback={<Loader />}>
							<Router />
						</Suspense>
					</StyledEngineProvider>
				</ThemeProvider>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

ReactDOM.render(<Main />, rootElement);
