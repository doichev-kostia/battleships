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
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SocketProvider } from "app/utils/socket-provider";

const rootElement = document.getElementById("root") || document.body;
// Create a client
const queryClient = new QueryClient();

const Main = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SocketProvider>
				<BrowserRouter>
					<ThemeProvider theme={theme}>
						<StyledEngineProvider injectFirst>
							<Suspense fallback={<Loader />}>
								<DndProvider backend={HTML5Backend}>
									<Router />
								</DndProvider>
							</Suspense>
						</StyledEngineProvider>
					</ThemeProvider>
				</BrowserRouter>
			</SocketProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

ReactDOM.render(<Main />, rootElement);
