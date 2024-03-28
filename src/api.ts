import { Hono } from "hono";

import { Gemini } from "./service/gemini";
import { InputException, ServerException } from "./util/exception";
import { chatMiddlewareValidator, validateChatSession } from "./util/validation";

import type { Bindings } from "./interface/config/env";
import type { ApiRequest } from "./interface/request";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", chatMiddlewareValidator, async (c) => {
	const chatSession: ApiRequest = await c.req.json();

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

	return c.json(
		{
			from: "model",
			content: response,
			createdAt: new Date(Date.now()).toISOString(),
		},
		200
	);
});

export default api;
