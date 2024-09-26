import { Server } from "socket.io";

interface IMessage {
	id: number;
	text: string;
	userName: string;
	sent: boolean;
	timestamp: Date;
}

class SocketService {
	private _io: Server;

	constructor(server: any) {
		this._io = new Server(server, {
			connectionStateRecovery: {},
			cors: {
				origin: "*",
				methods: ["*"],
			},
		});
	}

	get io() {
		return this._io;
	}

	public initListeners() {
		const io = this._io;

		io.on("connection", async (socket) => {
			console.log("New Socket Connected: ", socket.id);

			if (!socket) console.log("Backend Socket Undefined!");

			socket.on("event:message", ({ message }: { message: IMessage }) => {
				socket.broadcast.emit("event:message", message);
			});

			socket.on("disconnect", () => {
				console.log("Socket Disconnected: ", socket.id);
			});
		});
	}
}

export default SocketService;
