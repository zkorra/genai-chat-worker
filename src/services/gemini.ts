import { GoogleGenerativeAI } from "@google/generative-ai";

import { findRole } from "../utils/role";

import type { GeminiConfig } from "../interfaces/env";
import type { History } from "../interfaces/chat";
import type { GeminiInputContent } from "../interfaces/gemini";

interface ChatInputGemini {
	role: string;
	message: string;
	history: History;
	apiKey: string;
	config: GeminiConfig;
}

export async function call(input: ChatInputGemini) {
	const { role, message, history, apiKey, config } = input;

	const foundRole = findRole(role)!;

	const contentList: Array<GeminiInputContent> = [
		{ role: "user", parts: foundRole.prompt },
		{ role: "model", parts: foundRole.modelAnswer },
		...convertHistoryToGeminiFormat(history),
	];

	const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: config.MODEL_NAME });
	console.info(`[gemini service] model ${config.MODEL_NAME} initiated`);

	const chat = model.startChat({
		history: contentList,
		generationConfig: {
			maxOutputTokens: config.MAX_OUTPUT_TOKENS,
		},
	});
	console.debug("[gemini service] starting chat with history ->", contentList);

	console.info("[gemini service] sending message ->", message);
	const result = await chat.sendMessage(message);

	const responseText = result.response.text();
	console.info("[gemini service] result ->", responseText);

	return responseText;
}

function convertHistoryToGeminiFormat(history: History) {
	let geminiFormatHistory: Array<GeminiInputContent> = [];
	history.forEach((message) => {
		geminiFormatHistory.push({ role: message.from, parts: message.content });
	});
	return geminiFormatHistory;
}
