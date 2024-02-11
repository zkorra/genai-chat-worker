import { Hono } from "hono";
import type { Bindings } from "./env";

import * as gemini from "./services/gemini";

const api = new Hono<{ Bindings: Bindings }>();

api.get("/", async (c) => {
	return c.json(`Hello, world! This is the root page of your Worker template. ${c.env.GEMINI_API_KEY}`);
});

api.post("/send", async (c) => {
	const body = await c.req.json();

	const response = await gemini.call(body, c.env.GEMINI_API_KEY, c.env.GEMINI_CONFIG);

	console.debug(response);

	return c.json({ message: response }, 200);
});

export default api;
