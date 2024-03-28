import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

import api from "./api";
import { GenericException } from "./util/exception";

const app = new Hono();

app.use(poweredBy(), logger(), prettyJSON());
app.use("/api/*", cors());

app.route("/api", api);

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
	if (err instanceof GenericException) {
		const errorResponse = { error: { message: err.message, detail: err.detail } };

		return c.json(errorResponse, err.status);
	}

	return c.json(
		{
			error: {
				message: "Internal Server Error",
			},
		},
		500
	);
});

export default app;
