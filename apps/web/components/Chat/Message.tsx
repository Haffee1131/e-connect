import { MessageContent } from "@/components/Message/MessageContent";
import { IMessage } from "@/services/MessageService";

interface MessageProps {
	message: IMessage;
}

export function Message({ message }: MessageProps) {
	return (
		<MessageContent
			text={message.text}
			timestamp={message.timestamp}
			userName={message.userName || "Unknown"}
			sent={message.sent}
		/>
	);
}
