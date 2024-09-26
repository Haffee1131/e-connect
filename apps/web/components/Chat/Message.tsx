import { MessageContent } from "@/components/Message/MessageContent";
import { IMessage } from "@/services/MessageService";

interface MessageProps {
	message: IMessage;
}

export function Message({ message }: MessageProps) {
	return (
		<MessageContent
			text={message.text || "Hey, there!"}
			timestamp={message.timestamp}
			userName={message.userName || "User"}
			sent={message.sent || false}
		/>
	);
}
