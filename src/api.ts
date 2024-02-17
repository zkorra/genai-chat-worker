import { Hono } from "hono";

import { Gemini } from "./services/gemini";
import { InputException, ServerException } from "./utils/exception";
import { validateChatSession } from "./utils/validation";

import type { Bindings } from "./interfaces/env";
import type { ChatSession } from "./interfaces/chat";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", async (c) => {
	const chatSession: ChatSession = await c.req.json();
	const startDateTime = Date.now();

	validateChatSession(chatSession);

	let response;
	switch (chatSession.model) {
		case "gemini": {
			const gemini = new Gemini(chatSession, c.env.GEMINI_API_KEY, c.env.GEMINI_CONFIG);
			response = await gemini.call();
			break;
		}
		default: {
			throw new InputException("Selected model is not valid");
		}
	}

	if (response == null || response.length === 0) {
		throw new ServerException("Error occurred during execution", `Got empty response from ${chatSession.model} api`);
	}

	chatSession.history.push(
		{
			from: "user",
			content: chatSession.message,
			createdAt: startDateTime.toString(),
		},
		{
			from: "model",
			content: response,
			createdAt: Date.now().toString(),
		}
	);

	return c.json({ history: chatSession.history }, 200);
});

export default api;
