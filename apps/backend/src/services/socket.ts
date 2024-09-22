import { Server, Socket } from "socket.io";

class SocketService {
	private _io: Server;

	constructor() {
		console.log("Initializing socket server...");
		this._io = new Server();
	}

	get io() {
		return this._io;
	}

	public initListeners() {
		const io = this._io;
		console.log("Socket listeners initializing...: ");

		io.on("connect", (socket: Socket) => {
			console.log("New Socket: ", socket.id);

			socket.on("event:message", async (message: string) => {
				console.log("Received message: ", message);
			});
		});
	}
}

export default SocketService;
