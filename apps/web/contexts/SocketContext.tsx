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
	messages: IMessage[];
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
	const [messages, setMessages] = useState<IMessage[]>([
		{
			id: 1,
			text: "Hello!",
			sent: false,
			timestamp: new Date(Date.now() - 3600000),
		},
	]);

	useEffect(() => {
		const _socket = io(
			process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
			{
				transports: ["websocket"],
			}
		);
		setSocket(_socket);

		console.log("Connecting to Server...", _socket);

		// socket.emit("event:message", {
		// 	message: {
		// 		id: 100,
		// 		text: "Message from Client",
		// 		sent: true,
		// 		timestamp: Date.now(),
		// 	},
		// });

		// _socket.on("event:message", ({ message }: { message: IMessage }) => {
		// 	console.log("Message received from server: ", message);
		// 	// io.emit("event:message", message);
		// });

		_socket.on("event:message", onMessageReceived);

		return () => {
			_socket.off("event:message", onMessageReceived);
			_socket.disconnect();
			setSocket(undefined);
			console.log("Client Socket Disconnected");
		};
	}, []);

	const sendMessage: ISocketContext["sendMessage"] = useCallback(
		(message: IMessage) => {
			console.log("Sent Message: ", message.text);
			setMessages((prev) => [
				...prev,
				{
					id: message.id,
					text: message.text,
					sent: true,
					timestamp: message.timestamp,
				},
			]);
			if (!socket) throw new Error("No Socket!!");

			socket.emit("event:message", { message: message });
			console.log("Message Emitted.");
		},
		[socket]
	);

	const onMessageReceived = useCallback((message: IMessage) => {
		console.log("Message received from server: ", message);
		setMessages((prev) => [
			...prev,
			{
				id: message.id,
				text: message.text,
				sent: false,
				timestamp: new Date(message.timestamp),
			},
		]);
	}, []);

	return (
		<SocketContext.Provider value={{ messages, sendMessage }}>
			{children}
		</SocketContext.Provider>
	);
};
