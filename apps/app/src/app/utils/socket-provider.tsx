import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
	socket: Readonly<Socket>;
}

export const SocketContext = React.createContext<ISocketContext>({} as ISocketContext);

interface SocketProviderProps {
	children: React.ReactNode;
}

const socket = io(import.meta.env.VITE_SOCKET_URL);

export const SocketProvider = ({ children }: SocketProviderProps) => {
	useEffect(() => {
		return () => {
			console.log("a");
			socket.disconnect();
		};
	}, []);
	return <SocketContext.Provider value={{ socket: socket }}>{children}</SocketContext.Provider>;
};
