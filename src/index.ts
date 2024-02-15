import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import api from "./api";
import { InputException } from "./utils/exception";

const app = new Hono();
app.use("/api/*", cors());

app.route("/api", api);

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json(
			{
				error: {
					message: err.message,
				},
			},
			err.status
		);
	}

	return c.json({ error: "Internal Error" }, 500);
});

export default app;
