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
				origin: "*", // Allow requests from frontend
				methods: ["*"],
				// credentials: true,
			},
		});
	}

	get io() {
		return this._io;
	}

	public initListeners() {
		const io = this._io;
		console.log("Socket listeners initializing...");

		io.on("connection", async (socket) => {
			console.log("New Socket Connected: ", socket.id);

			if (!socket) console.log("Backend Socket Undefined!");

			socket.on("event:message", ({ message }: { message: IMessage }) => {
				console.log("Message received from client: ", message);
				socket.broadcast.emit("event:message", message);
			});

			// // Send the message back to all clients (including the sender)
			// socket.emit("event:message", {
			// 	message: {
			// 		id: 200,
			// 		text: "Message from Server",
			// 		sent: true,
			// 		timestamp: Date.now(),
			// 	},
			// });

			socket.on("disconnect", () => {
				console.log("Socket Disconnected: ", socket.id);
			});
		});
	}
}

export default SocketService;
