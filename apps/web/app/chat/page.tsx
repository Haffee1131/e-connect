"use client";

import { useSearchParams } from "next/navigation";

import { SocketProvider } from "@/contexts/SocketContext";
import ChatRoom from "@/components/Chat/ChatRoom";

const ChatPage = () => {
	const searchParams = useSearchParams();
	const userName = searchParams.get("username") || "Anonymous";
	return (
		<SocketProvider userName={userName}>
			<ChatRoom />
		</SocketProvider>
	);
};

export default ChatPage;
