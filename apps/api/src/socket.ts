import * as socketIo from "socket.io";
import { Server } from "http";
import { SocketHandler } from "socket-handler";

class SocketClient {
	private io: socketIo.Server;
	private handler: SocketHandler;

	constructor(httpServer: Server) {
		this.io = new socketIo.Server(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST", "PATCH"],
				credentials: false,
			},
		});
		this.handler = new SocketHandler(this.io);
	}

	public sendMessage(event: string, message: any) {
		this.io.emit(event, message);
	}
}

export default SocketClient;
