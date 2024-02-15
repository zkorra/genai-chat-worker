import { Hono } from "hono";
import type { Bindings } from "./interfaces/env";

import * as gemini from "./services/gemini";
import { ChatSession } from "./interfaces/chat";
import { HTTPException } from "hono/http-exception";
import { InputException } from "./utils/exception";

import { validateChatSession } from "./utils/validation";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", async (c) => {
	const body: ChatSession = await c.req.json();
	const startDateTime = Date.now();

	validateChatSession(body);

	let response;
	switch (body.model) {
		case "gemini": {
			response = await gemini.call({
				role: body.role,
				message: body.message,
				history: body.history,
				apiKey: c.env.GEMINI_API_KEY,
				config: c.env.GEMINI_CONFIG,
			});
			break;
		}
		default: {
			throw new InputException("Model is not valid");
		}
	}

	if (response == null) {
		throw new HTTPException(500);
	}

	body.history.push({
		from: "user",
		content: body.message,
		createdAt: startDateTime.toString(),
	});
	body.history.push({
		from: "model",
		content: response,
		createdAt: Date.now().toString(),
	});

	return c.json({ data: body.history }, 200);
});

export default api;
