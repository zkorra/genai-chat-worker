import { Hono } from "hono";
import type { Bindings } from "./env";

import * as gemini from "./services/gemini";
import { GeneralChat } from "./models/chat";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", async (c) => {
	const body: GeneralChat = await c.req.json();
	const { history, role } = body;

	let response;
	switch (role) {
		default: {
			response = await gemini.call({
				role: role,
				history: history,
				apiKey: c.env.GEMINI_API_KEY,
				config: c.env.GEMINI_CONFIG,
			});
			break;
		}
	}

	return c.json({ message: response }, 200);
});

export default api;
