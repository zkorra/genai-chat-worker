import { GoogleGenerativeAI } from "@google/generative-ai";

import { findRole } from "../util/role";
import { ServerException } from "../util/exception";

import type { GeminiConfig } from "../interface/config/env";
import type { ChatSession, ChatHistory } from "../interface/chat";
import type { GeminiChatSession, GeminiInputContent } from "../interface/client/gemini";

export class Gemini {
	private chatSession: ChatSession;
	private apiKey: string;
	private config: GeminiConfig;

	constructor(chatSession: ChatSession, apiKey: string, config: GeminiConfig) {
		this.chatSession = chatSession;
		this.apiKey = apiKey;
		this.config = config;
	}

	async call(): Promise<string> {
		const geminiChatSession = this.initiateGeminiChatSession();

		console.info("[gemini service] chat session initiated with history:", await geminiChatSession.getHistory());

		try {
			console.info("[gemini service] sending message:", this.chatSession.message);
			const result = await geminiChatSession.sendMessage(this.chatSession.message);
			const responseText = result.response.text();
			console.info("[gemini service] result:", responseText);

			return responseText;
		} catch (err) {
			console.error("[gemini service]", err);
			throw new ServerException("Error occurred while sending message to gemini api");
		}
	}

	initiateGeminiChatSession(): GeminiChatSession {
		const foundRole = findRole(this.chatSession.role)!;

		const contentList: Array<GeminiInputContent> = [
			{ role: "user", parts: foundRole.prompt },
			{ role: "model", parts: foundRole.modelAnswer },
			...this.convertHistoryToGeminiFormat(this.chatSession.history),
		];

		const generationConfig = {
			maxOutputTokens: this.config.MAX_OUTPUT_TOKENS,
			temperature: this.config.TEMPERATURE,
			topP: this.config.TOP_P,
			topK: this.config.TOP_K,
		};

		const model = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({ model: this.config.MODEL_NAME, generationConfig });

		const geminiChatSession = model.startChat({
			history: contentList,
		});

		return geminiChatSession;
	}

	private convertHistoryToGeminiFormat(history: ChatHistory): Array<GeminiInputContent> {
		return history.map((message) => ({ role: message.from, parts: message.content }));
	}
}
