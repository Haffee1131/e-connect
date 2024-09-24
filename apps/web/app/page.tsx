"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketContext";

interface IMessage {
	id: number;
	text: string;
	sent: boolean;
	timestamp: Date;
	userName: string;
}

function getRandomColor() {
	const hue = Math.floor(Math.random() * 360);
	const saturation = 70;
	const lightness = 60;
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

interface IMessageContentProps {
	text: string;
	timestamp: Date;
	userName: string;
	sent: boolean;
}

export function MessageContent({
	text = "Hey!",
	timestamp,
	userName = "Server",
	sent = false,
}: IMessageContentProps) {
	const [expanded, setExpanded] = useState(false);
	const [showReadMore, setShowReadMore] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [avatarColor, setAvatarColor] = useState<string>("");

	useEffect(() => {
		setAvatarColor(getRandomColor());
	}, []);

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
			hour12: false,
		});
	};

	return (
		<div
			className={`flex items-start ${sent ? "flex-row-reverse" : "flex-row"}`}
		>
			<Avatar
				className={`w-7 h-7 ${sent ? "ml-2" : "mr-2"}`}
				style={{ backgroundColor: avatarColor }}
			>
				<AvatarImage
					src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`}
					alt={userName}
				/>
				<AvatarFallback
					style={{
						backgroundColor: avatarColor,
						color: "white",
					}}
				>
					{userName.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div
				className={`relative max-w-[70%] p-3 rounded-lg 
			${
				sent
					? "bg-primary text-white rounded-tr-none"
					: "bg-secondary text-black rounded-tl-none"
			}
		  `}
			>
				<div className="mb-1">
					<span className="text-md font-bold">{userName}</span>
				</div>

				<div
					ref={contentRef}
					className={`overflow-hidden transition-all duration-300 ease-in-out ${
						expanded ? "max-h-full" : "max-h-[7.5em]"
					}`}
					style={{
						wordBreak: "break-word",
						overflowWrap: "break-word",
					}}
				>
					<div className="break-words whitespace-pre-wrap">
						{text}
					</div>
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
									Read less{" "}
									<ChevronUp className="h-3 w-3 ml-1" />
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
				<div
					className={`absolute top-0 w-4 h-4 ${
						sent ? "-right-2 bg-primary" : "-left-2 bg-secondary"
					}`}
					style={{
						clipPath: sent
							? "polygon(0 0, 0% 100%, 100% 0)"
							: "polygon(100% 0, 0 0, 100% 100%)",
					}}
				/>
			</div>
		</div>
	);
}

export default function ChatRoom() {
	const { messages, sendMessage } = useSocket();

	const [inputMessage, setInputMessage] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = () => {
		if (inputMessage.trim()) {
			sendMessage({
				id: messages.length + 1,
				text: inputMessage.trim(),
				sent: true,
				timestamp: new Date(),
			});
			setInputMessage("");
		}
	};

	return (
		<div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg overflow-hidden">
			<div className="bg-primary text-primary-foreground p-4 flex items-center justify-center italic">
				<h1 className="text-xl font-bold">E-Connect</h1>
			</div>

			<ScrollArea className="flex-grow relative" ref={scrollAreaRef}>
				<div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none" />
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
							<MessageContent
								text={message.text}
								timestamp={message.timestamp}
								userName={"Hafeez"}
								sent={message.sent}
							/>
						</div>
					))}
				</div>
			</ScrollArea>
			<div className="p-4">
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
			</div>
		</div>
	);
}
