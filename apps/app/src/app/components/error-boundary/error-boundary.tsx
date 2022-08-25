import React from "react";
import { toast } from "react-toastify";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: any) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	componentDidCatch(error: any, errorInfo: any) {
		// You can also log the error to an error reporting service
		console.error(error, errorInfo);
		toast.error("Something went wrong. Please try again later.");
	}

	render() {
		const generatorErrorRegex = new RegExp(/generate ships/);
		if (this.state.error && generatorErrorRegex.test(this.state.error.message)) {
			window.location.reload();
		}
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
