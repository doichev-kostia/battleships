import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
	socket: Readonly<Socket>;
}

export const SocketContext = React.createContext<ISocketContext>({} as ISocketContext);

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket] = useState<Socket>(io(import.meta.env.VITE_SOCKET_URL));

	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	}, []);
	return <SocketContext.Provider value={{ socket: socket }}>{children}</SocketContext.Provider>;
};
