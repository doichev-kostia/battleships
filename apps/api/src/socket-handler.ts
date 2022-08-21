import * as socketIo from "socket.io";
import { SOCKET_EVENTS } from "@battleships/contracts";

export class SocketHandler {
	private io: socketIo.Server;

	constructor(io: socketIo.Server) {
		this.io = io;
		this.initializeListeners();
	}

	private initializeListeners() {
		this.io.on(SOCKET_EVENTS.CONNECT, this.connect.bind(this));
		this.io.on(SOCKET_EVENTS.GAME_INIT, this.gameInit.bind(this));
		this.io.on(SOCKET_EVENTS.GAME_JOIN, this.gameJoin.bind(this));
	}

	public connect(socket: socketIo.Socket) {
		console.log("Client connected");
		socket.on(SOCKET_EVENTS.DISCONNECT, () => {
			console.log("Client disconnected");
		});
	}

	public gameInit = (socket: socketIo.Server) => {
		socket.emit(SOCKET_EVENTS.GAME_INIT);
	};

	public gameJoin = (socket: socketIo.Server, { gameId }: { gameId: string }) => {
		socket.socketsJoin(gameId);
		socket.emit(SOCKET_EVENTS.GAME_JOIN);
	};
}
