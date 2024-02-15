import { Hono } from "hono";

import * as gemini from "./services/gemini";
import { InputException } from "./utils/exception";
import { validateChatSession } from "./utils/validation";

import type { Bindings } from "./interfaces/env";
import type { ChatSession } from "./interfaces/chat";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", async (c) => {
	const chat: ChatSession = await c.req.json();
	const startDateTime = Date.now();

	validateChatSession(chat);

	let response;
	switch (chat.model) {
		case "gemini": {
			response = await gemini.call({
				role: chat.role,
				message: chat.message,
				history: chat.history,
				env: c.env,
			});
			break;
		}
		default: {
			throw new InputException("Model is not valid");
		}
	}

	chat.history.push(
		{
			from: "user",
			content: chat.message,
			createdAt: startDateTime.toString(),
		},
		{
			from: "model",
			content: response,
			createdAt: Date.now().toString(),
		}
	);

	return c.json({ history: chat.history }, 200);
});

export default api;
