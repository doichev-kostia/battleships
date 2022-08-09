import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root") || document.body;

const Main = () => {
	return (
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
};

ReactDOM.createRoot(rootElement).render(<Main />);
