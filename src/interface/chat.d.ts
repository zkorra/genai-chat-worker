export interface ChatSession {
	model: string;
	role: string;
	message: string;
	history: ChatHistory;
}

export interface ChatMessage {
	from: "user" | "model";
	content: string;
	createdAt: string;
}

export type ChatHistory = Array<ChatMessage>;
