import { SocketProvider } from "@/contexts/SocketContext";
import ChatRoom from "@/components/Chat/ChatRoom";

const ChatPage = () => {
	return (
		<SocketProvider>
			<ChatRoom />
		</SocketProvider>
	);
};

export default ChatPage;
