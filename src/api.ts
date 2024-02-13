import { Hono } from "hono";
import type { Bindings } from "./env";

import * as gemini from "./services/gemini";
import { GeneralChat } from "./models/chat";

const api = new Hono<{ Bindings: Bindings }>();

api.post("/send", async (c) => {
	const body: GeneralChat = await c.req.json();

	const response = await gemini.call(body, c.env.GEMINI_API_KEY, c.env.GEMINI_CONFIG);

	console.debug(response);

	return c.json({ message: response }, 200);
});

export default api;
