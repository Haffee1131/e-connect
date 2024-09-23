"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type TSocketProviderProps = {
	children?: React.ReactNode;
};

interface IMessage {
	id: number;
	text: string;
	sent: boolean;
	timestamp: Date;
}

interface ISocketContext {
	sendMessage: (message: IMessage) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// custom hook
export const useSocket = () => {
	const state = useContext(SocketContext);

	if (!state) {
		throw new Error("State is not defined!");
	}
	return state;
};

export const SocketProvider: React.FC<TSocketProviderProps> = ({
	children,
}) => {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const _socket = io(process.env.BACKEND_URL ?? "http://localhost:8000");
		console.log("Client Socket Initializing...");

		_socket.emit("event:message", {
			message: {
				id: 100,
				text: "Message from Client",
				sent: true,
				timestamp: Date.now(),
			},
		});

		_socket.on("event:message", ({ message }: { message: IMessage }) => {
			console.log("Client side message received: ", message);
			// io.emit("event:message", message);
		});

		setSocket(socket);

		return () => {
			_socket.disconnect();
			setSocket(undefined);
			console.log("Client Socket Disconnected");
		};
	}, []);

	const sendMessage: ISocketContext["sendMessage"] = useCallback(
		(msg: IMessage) => {
			console.log("Sent Message: ", msg);
			if (!socket) throw new Error("No Socket!!");

			socket.emit("event:message", { message: msg });
			console.log("Message Emitted.");
		},
		[socket]
	);

	return (
		<SocketContext.Provider value={{ sendMessage }}>
			{children}
		</SocketContext.Provider>
	);
};
