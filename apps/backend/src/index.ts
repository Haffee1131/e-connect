import express, { Request, Response } from "express";

async function init() {
	const app = express();
	const PORT = process.env.PORT ?? 3001;

	app.use(express.json());

	// Home Page
	app.get("/", (_: Request, res: Response) => {
		res.status(200).json("Welcome to Home Page!");
	});

	// Start the server
	if (process.env.NODE_ENV !== "test") {
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	}
}

init();
