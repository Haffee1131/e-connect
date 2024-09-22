"use client";

import { useState, useRef, useEffect } from "react";
import { UserCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
	id: number;
	text: string;
	sent: boolean;
	timestamp: Date;
};

function MessageContent({
	text,
	timestamp,
}: {
	text: string;
	timestamp: Date;
}) {
	const [expanded, setExpanded] = useState(false);
	const [showReadMore, setShowReadMore] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			const lineHeight = parseInt(
				getComputedStyle(contentRef.current).lineHeight
			);
			const maxHeight = lineHeight * 5;
			setShowReadMore(contentRef.current.scrollHeight > maxHeight);
		}
	}, [text]);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div>
			<div
				ref={contentRef}
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					expanded ? "max-h-full" : "max-h-[7.5em]"
				}`}
			>
				{text}
			</div>
			<div className="flex justify-between items-center mt-1">
				{showReadMore && (
					<Button
						variant="link"
						className="p-0 h-auto font-normal text-default"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<>
								Read less <ChevronUp className="h-3 w-3 ml-1" />
							</>
						) : (
							<>
								Read more{" "}
								<ChevronDown className="h-3 w-3 ml-1" />
							</>
						)}
					</Button>
				)}
				<span className="text-xs text-muted-foreground ml-auto">
					{formatTime(timestamp)}
				</span>
			</div>
		</div>
	);
}

export default function ChatRoom() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: 1,
			text: "Hello!",
			sent: false,
			timestamp: new Date(Date.now() - 3600000),
		},
		{
			id: 2,
			text: "Hi there!",
			sent: true,
			timestamp: new Date(Date.now() - 3540000),
		},
		{
			id: 3,
			text: "How are you?",
			sent: false,
			timestamp: new Date(Date.now() - 3480000),
		},
		{
			id: 4,
			text: "I'm doing great, thanks! Here's a long message to demonstrate the new feature. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
			sent: true,
			timestamp: new Date(Date.now() - 3420000),
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = () => {
		if (inputMessage.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					text: inputMessage,
					sent: true,
					timestamp: new Date(),
				},
			]);
			setInputMessage("");
		}
	};

	const handleReceiveMessage = () => {
		const newMessage = {
			id: messages.length + 1,
			text: "This is a received message. It can also be quite long to demonstrate the 'Read more' functionality for received messages as well. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			sent: false,
			timestamp: new Date(),
		};
		setMessages([...messages, newMessage]);
	};

	return (
		<div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg overflow-hidden">
			<div className="bg-primary text-primary-foreground p-4 flex items-center">
				<UserCircle className="w-8 h-8 mr-2" />
				<h1 className="text-xl font-bold">Chat Room</h1>
			</div>

			<ScrollArea className="flex-grow relative" ref={scrollAreaRef}>
				<div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none" />
				<div className="p-4 space-y-4">
					{messages.map((message, index) => (
						<div
							key={message.id}
							className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
							ref={
								index === messages.length - 1
									? lastMessageRef
									: null
							}
						>
							<div
								className={`relative max-w-[70%] p-3 rounded-lg ${
									message.sent
										? "bg-primary text-primary-foreground rounded-tr-none"
										: "bg-secondary text-secondary-foreground rounded-tl-none"
								}`}
							>
								<MessageContent
									text={message.text}
									timestamp={message.timestamp}
								/>
								<div
									className={`absolute top-0 w-4 h-4 ${
										message.sent
											? "-right-2 bg-primary"
											: "-left-2 bg-secondary"
									}`}
									style={{
										clipPath: message.sent
											? "polygon(0 0, 0% 100%, 100% 0)"
											: "polygon(100% 0, 0 0, 100% 100%)",
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
			<div className="p-4 bg-muted">
				<div className="flex space-x-2">
					<Input
						type="text"
						placeholder="Type a message..."
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleSendMessage();
							}
						}}
					/>
					<Button onClick={handleSendMessage} size="icon">
						<Send className="h-4 w-4" />
						<span className="sr-only">Send message</span>
					</Button>
					<Button
						onClick={handleReceiveMessage}
						variant="outline"
						size="icon"
					>
						<UserCircle className="h-4 w-4" />
						<span className="sr-only">
							Simulate received message
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
