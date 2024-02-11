export type Model = "gem";

export type Dummy = string;

export interface GeneralChat {
	// model: Model;
	dummy: Dummy;
	message: string;
	history: History;
}

export interface Message {
	role: "user" | "model";
	parts: string;
}

export type History = Array<Message>;
