import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import SocketService from "./services/socket";

async function init() {
	// Express Server
	const app = express();

	// Add CORS middleware to allow requests from localhost:3000
	app.use(
		cors({
			origin: "http://localhost:3000", // The frontend URL
			methods: ["GET", "POST"],
			credentials: true,
		})
	);

	// HTTP Server
	const httpServer = http.createServer(app);
	const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT ?? 8000;

	// Socket server
	const socketService = new SocketService(httpServer);
	socketService.initListeners();

	// Home Page
	app.get("/", (_: Request, res: Response) => {
		res.status(200).json("Welcome to Home Page!");
	});

	// Start the server
	httpServer.listen(HTTP_SERVER_PORT, () => {
		console.log(
			`HTTP Server is running on http://localhost:${HTTP_SERVER_PORT}`
		);
	});
}

init();
