export type Model = "gemini" | "chatgpt";

export type Role = string;

export interface ChatSession {
	model: Model;
	role: Role;
	message: string;
	history: ChatHistory;
}

export type ChatHistory = Array<ChatMessage>;

export interface ChatMessage {
	from: "user" | "model";
	content: string;
	createdAt: string;
}
