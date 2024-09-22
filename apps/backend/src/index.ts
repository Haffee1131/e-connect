import express, { Request, Response } from "express";
import http from "http";

import SocketService from "./services/socket";

function init() {
	// Express server
	const app = express();
	const PORT = process.env.PORT ?? 3005;
	app.use(express.json());

	// Http server
	const httpServer = http.createServer(app);

	// Socket server
	const socketService = new SocketService();
	socketService.io.attach(httpServer);
	socketService.initListeners();

	// Home Page
	app.get("/", (_: Request, res: Response) => {
		res.status(200).json("Welcome to Home Page!");
	});

	// Start the server
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}

init();
