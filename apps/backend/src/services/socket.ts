import { Server, Socket } from "socket.io";

interface IMessage {
	id: number;
	text: string;
	sent: boolean;
	timestamp: Date;
}

class SocketService {
	private _io: Server;

	constructor(server: any) {
		console.log("Initializing socket server...");
		this._io = new Server(server, {
			connectionStateRecovery: {},
			cors: {
				allowedHeaders: ["*"],
				origin: "*",
			},
		});
	}

	get io() {
		return this._io;
	}

	public initListeners() {
		const io = this._io;
		console.log("Socket listeners initializing...");

		io.on("connection", (socket: Socket) => {
			console.log("New Socket Connected: ", socket.id);

			if (!socket) console.log("Backend Socket Undefined!");

			socket.on("event:message", ({ message }: { message: IMessage }) => {
				console.log("New message received: ", message);
				// io.emit("event:message", message);
			});

			socket.emit("event:message", {
				message: {
					id: 200,
					text: "Message from Server",
					sent: true,
					timestamp: Date.now(),
				},
			});

			socket.on("disconnect", () => {
				console.log("Socket Disconnected: ", socket.id);
			});
		});
	}
}

export default SocketService;
