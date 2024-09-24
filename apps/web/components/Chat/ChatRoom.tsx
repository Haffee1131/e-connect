"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/Chat/Message";
import { useSocket } from "@/contexts/SocketContext";
import { IMessage } from "@/services/MessageService";

import "../../app/globals.css";

export default function ChatRoom() {
	const { messages, sendMessage } = useSocket();

	const [inputMessage, setInputMessage] = useState("");
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = () => {
		if (inputMessage.trim()) {
			sendMessage(inputMessage.trim());
			setInputMessage("");
		}
	};

	return (
		<div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg overflow-hidden">
			<header className="bg-primary text-primary-foreground p-4 flex items-center justify-center italic">
				<h1 className="text-xl font-bold">E-Connect</h1>
			</header>

			<ScrollArea className="flex-grow relative">
				<div className="p-3 space-y-3">
					{messages.map((message, index) => (
						<div
							key={message.id}
							ref={
								index === messages.length - 1
									? lastMessageRef
									: null
							}
						>
							<Message message={message} />
						</div>
					))}
				</div>
			</ScrollArea>

			<footer className="p-4">
				<div className="flex space-x-4">
					<Input
						type="text"
						placeholder="Type a message..."
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSendMessage();
							}
						}}
						className="h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-md"
					/>
					<Button
						onClick={handleSendMessage}
						className="h-12 w-12 bg-primary text-white rounded-md flex items-center justify-center hover:bg-primary-dark"
					>
						<Send className="h-6 w-6" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</footer>
		</div>
	);
}
