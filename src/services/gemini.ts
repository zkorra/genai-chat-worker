import { GoogleGenerativeAI } from "@google/generative-ai";
import type { History, GeminiHistory, GeneralChat } from "../models/chat";

import { findPrompt } from "../utils/prompt";
import { GeminiConfig } from "../env";

interface ChatInputGemini {
	role: string;
	history: History;
	apiKey: string;
	config: GeminiConfig;
}

export async function call(input: ChatInputGemini) {
	const { role, history, apiKey, config } = input;

	const found = findPrompt(role);
	if (found == null) {
		return;
	}

	const geminiHistory = [
		{ role: "user", parts: found.prompt },
		{ role: "model", parts: found.modelAnswer },
		...convertHistoryToGeminiFormat(history),
	];
	console.debug("[gemini.call] history", geminiHistory);

	if (geminiHistory.length <= 2) {
		return;
	}

	// Access your API key as an environment variable (see "Set up your API key" above)
	const genAI = new GoogleGenerativeAI(apiKey);

	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: config.MODEL_NAME });

	const lastestMessage = geminiHistory.pop();

	if (lastestMessage?.parts == null) {
		return;
	}

	const chat = model.startChat({
		history: geminiHistory,
		generationConfig: {
			maxOutputTokens: config.MAX_OUTPUT_TOKENS,
		},
	});

	console.debug("[gemini.call] sending", lastestMessage.parts);

	const result = await chat.sendMessage(lastestMessage.parts);
	const response = await result.response;

	return response.text();
}

function convertHistoryToGeminiFormat(history: History) {
	let geminiFormatHistory: Array<GeminiHistory> = [];
	history.forEach((message) => {
		geminiFormatHistory.push({ role: message.from, parts: message.content });
	});
	return geminiFormatHistory;
}
