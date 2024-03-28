import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { InputException, NotFoundException } from "./exception";
import { hasRole } from "./role";

import type { ChatSession, ChatHistory } from "../interface/chat";

const chatSessionSchema = z.object({
	model: z.string().min(1).max(16),
	role: z.string().min(1).max(16),
	message: z.string().min(1).max(160),
	history: z.array(
		z.object({
			from: z.string().min(1).max(16),
			content: z.string().min(1).max(160),
			createdAt: z.string().max(32),
		})
	),
});

export const chatMiddlewareValidator = zValidator("json", chatSessionSchema, (result, c) => {
	if (!result.success) {
		throw new InputException(`request.${result.error.issues[0].path[0]} is invalid`, result.error.issues[0].message);
	}
});

export function validateChatSession(chatSession: ChatSession): void {
	const { role, history } = chatSession;

	if (history.length > 0) {
		validateMultiTurnChatHistory(history);
	}

	if (!hasRole(role)) {
		throw new NotFoundException(`request.role ${role} doesn't exist`);
	}
}

function validateMultiTurnChatHistory(history: ChatHistory): void {
	/*
	 * request.history[].from must start with `user` and end with `model`
	 */
	history.forEach((message, index) => {
		// user's message must be even index (0, 2, 4, 6, ...)
		if (index % 2 === 0 && message.from !== "user") {
			throw new InputException("user's messages must be arrange in even order");
		}

		// model's message must be odd index (1, 3, 5, 7, ...)
		if (index % 2 !== 0 && message.from !== "model") {
			throw new InputException("model's messages must be arrange in odd order");
		}
	});
}
