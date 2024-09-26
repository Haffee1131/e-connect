"use client";

import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";

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
	sendMessage: (messageText: string) => void;
}

const SocketContext = React.createContext<ISocketContext | undefined>(
	undefined
);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

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
			timestamp: new Date(Date.now()),
		},
	]);
	const { username } = useUser();
	const [socketManager, setSocketManager] = useState<SocketManager | null>(
		null
	);
	const [isPageFocused, setIsPageFocused] = useState(true);
	const [lastMessageCount, setLastMessageCount] = useState(messages.length);

	const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

	// Load notification sound on component mount
	useEffect(() => {
		notificationSoundRef.current = new Audio("/drop_notification.mp3");
	}, []);

	// Handle focus and blur events to track page visibility
	useEffect(() => {
		const handleFocus = () => {
			setIsPageFocused(true);
			document.title = "E-Connect";
			setLastMessageCount(messages.length);
		};

		const handleBlur = () => {
			setIsPageFocused(false);
		};

		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleBlur);

		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("blur", handleBlur);
		};
	}, [messages]);

	// Play notification sound and set title when new messages arrive and page is not focused
	useEffect(() => {
		if (!isPageFocused && messages.length > lastMessageCount) {
			document.title = "🔥 E-Connect";
			notificationSoundRef.current?.play();
		}

		setLastMessageCount(messages.length); // Update message count after a new message
	}, [messages, isPageFocused]);

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
		(messageText: string) => {
			const message: IMessage = {
				id: messages.length + 1,
				text: messageText,
				userName: username,
				sent: true,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, message]);
			socketManager?.emit("event:message", message);
		},
		[socketManager, messages, username]
	);

	return (
		<SocketContext.Provider value={{ messages, sendMessage }}>
			{children}
			<audio ref={notificationSoundRef} src="/drop_notification.mp3" />
		</SocketContext.Provider>
	);
};
