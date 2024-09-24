"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type TSocketProviderProps = {
	children: React.ReactNode;
};

interface IMessage {
	id: number;
	text: string;
	userName: string;
	sent: boolean;
	timestamp: Date;
}

interface ISocketContext {
	messages: IMessage[];
	sendMessage: (message: IMessage) => void;
}

const SocketContext = React.createContext<ISocketContext | undefined>(
	undefined
);

// Custom hook to use the SocketContext
export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

// SocketManager handles socket connection and events
class SocketManager {
	private socket: Socket | null = null;

	constructor(url: string) {
		this.socket = io(url, { transports: ["websocket"] });
	}

	on(event: string, callback: (data: IMessage) => void) {
		if (this.socket) {
			this.socket.on(event, callback);
		}
	}

	off(event: string, callback: (data: IMessage) => void) {
		if (this.socket) {
			this.socket.off(event, callback);
		}
	}

	emit(event: string, data: IMessage) {
		if (this.socket) {
			this.socket.emit(event, { message: data });
		}
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}
}

export const SocketProvider: React.FC<TSocketProviderProps> = ({
	children,
}) => {
	const [messages, setMessages] = useState<IMessage[]>([
		{
			id: 1,
			text: "Hey, welcome!",
			sent: false,
			userName: "Server",
			timestamp: new Date(Date.now() - 3600000),
		},
	]);
	const [socketManager, setSocketManager] = useState<SocketManager | null>(
		null
	);

	useEffect(() => {
		const manager = new SocketManager(
			process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"
		);
		setSocketManager(manager);

		const onMessageReceived = (message: IMessage) => {
			setMessages((prev) => [
				...prev,
				{
					...message,
					sent: false,
					timestamp: new Date(message.timestamp),
				},
			]);
		};

		manager.on("event:message", onMessageReceived);

		return () => {
			manager.off("event:message", onMessageReceived);
			manager.disconnect();
		};
	}, []);

	const sendMessage: ISocketContext["sendMessage"] = useCallback(
		(message: IMessage) => {
			setMessages((prev) => [...prev, { ...message, sent: true }]);
			socketManager?.emit("event:message", message);
		},
		[socketManager]
	);

	return (
		<SocketContext.Provider value={{ messages, sendMessage }}>
			{children}
		</SocketContext.Provider>
	);
};

// "use client";

// import React, { useCallback, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// type TSocketProviderProps = {
// 	children?: React.ReactNode;
// };

// interface IMessage {
// 	id: number;
// 	text: string;
// 	userName: string;
// 	sent: boolean;
// 	timestamp: Date;
// }

// interface ISocketContext {
// 	messages: IMessage[];
// 	sendMessage: (message: IMessage) => any;
// }

// const SocketContext = React.createContext<ISocketContext | null>(null);

// // custom hook
// export const useSocket = () => {
// 	const state = useContext(SocketContext);

// 	if (!state) {
// 		throw new Error("State is not defined!");
// 	}
// 	return state;
// };

// export const SocketProvider: React.FC<TSocketProviderProps> = ({
// 	children,
// }) => {
// 	const [socket, setSocket] = useState<Socket>();
// 	const [messages, setMessages] = useState<IMessage[]>([
// 		{
// 			id: 1,
// 			text: "Hey, welcome!",
// 			sent: false,
// 			userName: "Server",
// 			timestamp: new Date(Date.now() - 3600000),
// 		},
// 	]);

// 	useEffect(() => {
// 		const _socket = io(
// 			process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
// 			{
// 				transports: ["websocket"],
// 			}
// 		);
// 		setSocket(_socket);

// 		console.log("Connecting to Server...", _socket);

// 		// socket.emit("event:message", {
// 		// 	message: {
// 		// 		id: 100,
// 		// 		text: "Message from Client",
// 		// 		sent: true,
// 		// 		timestamp: Date.now(),
// 		// 	},
// 		// });

// 		// _socket.on("event:message", ({ message }: { message: IMessage }) => {
// 		// 	console.log("Message received from server: ", message);
// 		// 	// io.emit("event:message", message);
// 		// });

// 		_socket.on("event:message", onMessageReceived);

// 		return () => {
// 			_socket.off("event:message", onMessageReceived);
// 			_socket.disconnect();
// 			setSocket(undefined);
// 			console.log("Client Socket Disconnected");
// 		};
// 	}, []);

// 	const sendMessage: ISocketContext["sendMessage"] = useCallback(
// 		(message: IMessage) => {
// 			console.log("Sent Message: ", message.text);
// 			setMessages((prev) => [
// 				...prev,
// 				{
// 					id: message.id,
// 					text: message.text,
// 					userName: message.userName,
// 					sent: true,
// 					timestamp: message.timestamp,
// 				},
// 			]);
// 			if (!socket) throw new Error("No Socket!!");

// 			socket.emit("event:message", { message: message });
// 			console.log("Message Emitted.");
// 		},
// 		[socket]
// 	);

// 	const onMessageReceived = useCallback((message: IMessage) => {
// 		console.log("Message received from server: ", message);
// 		setMessages((prev) => [
// 			...prev,
// 			{
// 				id: message.id,
// 				text: message.text,
// 				userName: message.userName,
// 				sent: false,
// 				timestamp: new Date(message.timestamp),
// 			},
// 		]);
// 	}, []);

// 	return (
// 		<SocketContext.Provider value={{ messages, sendMessage }}>
// 			{children}
// 		</SocketContext.Provider>
// 	);
// };
