export type Model = "gemini" | "chatgpt";

export type Role = string;

export interface ChatSession {
	model: Model;
	role: Role;
	message: string;
	history: History;
}

export interface Message {
	from: "user" | "model";
	content: string;
	createdAt: string;
}

export type History = Array<Message>;
