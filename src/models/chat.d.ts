export type Model = "gem";

export type Role = string;

export interface GeneralChat {
	// model: Model;
	selectedRole: Role;
	history: History;
}

export interface Message {
	from: "user" | "model";
	content: string;
	createdAt: Date;
}

export type History = Array<Message>;

export interface GeminiHistory {
	role: string;
	parts: string;
}
