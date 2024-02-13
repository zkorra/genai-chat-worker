import { GoogleGenerativeAI } from "@google/generative-ai";
import type { History, GeminiHistory, GeneralChat } from "../models/chat";

import { findPrompt } from "../utils/prompt";
import { GeminiConfig } from "../env";

export async function call(generalChat: GeneralChat, apiKey: string, config: GeminiConfig) {
	const { MODEL_NAME, MAX_OUTPUT_TOKENS } = config;

	const found = findPrompt(generalChat.selectedRole);
	if (found == null) {
		return;
	}

	const history = [
		{ role: "user", parts: found.prompt },
		{ role: "model", parts: found.modelAnswer },
		...convertHistoryToGeminiFormat(generalChat.history),
	];
	console.debug("[gemini.call] history", history);

	if (history.length <= 2) {
		return;
	}

	// Access your API key as an environment variable (see "Set up your API key" above)
	const genAI = new GoogleGenerativeAI(apiKey);

	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });

	const lastestMessage = history.pop();

	if (lastestMessage?.parts == null) {
		return;
	}

	const chat = model.startChat({
		history: history,
		generationConfig: {
			maxOutputTokens: MAX_OUTPUT_TOKENS,
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
