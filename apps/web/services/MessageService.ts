export interface IMessage {
	id: number;
	text: string;
	sent: boolean;
	timestamp: Date;
	userName?: string;
}
