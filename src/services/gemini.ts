import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneralChat } from "../models/chat";

import { findPrompt } from "../utils/prompt";
import { GeminiConfig } from "../env";

export async function call(generalChat: GeneralChat, apiKey: string, config: GeminiConfig) {
	const { MODEL_NAME, MAX_OUTPUT_TOKENS } = config;

	const found = findPrompt(generalChat.dummy);
	if (found == null) {
		return;
	}

	// generalChat.history.unshift({ role: 'user', parts: prompt });
	console.debug("[gemini.call] history", [
		{ role: "user", parts: found.prompt },
		{ role: "model", parts: found.modelTurned },
		...generalChat.history,
	]);

	// Access your API key as an environment variable (see "Set up your API key" above)
	const genAI = new GoogleGenerativeAI(apiKey);

	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });

	const chat = model.startChat({
		history: [
			{ role: "user", parts: found.prompt },
			{ role: "model", parts: found.modelTurned },
			...generalChat.history,
		],
		generationConfig: {
			maxOutputTokens: MAX_OUTPUT_TOKENS,
		},
	});

	const result = await chat.sendMessage(generalChat.message);
	const response = await result.response;

	return response.text();
}
