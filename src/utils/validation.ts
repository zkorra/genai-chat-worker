import { InputException, NotFoundException } from "./exception";
import { hasRole } from "./role";

import type { ChatSession, History } from "../interfaces/chat";

export function validateChatSession(chatSession: ChatSession): void {
	const { role, message, history } = chatSession;

	if (message == null) {
		throw new InputException("Message is empty");
	}

	if (!Array.isArray(history)) {
		throw new InputException("History is invalid data type");
	}

	if (history.length > 0) {
		validateMultiTurnChatHistory(history);
	}

	if (!hasRole(role)) {
		throw new NotFoundException(`Selected role ${role} doesn't exist on our side :(`);
	}
}

function validateMultiTurnChatHistory(history: History): void {
	/*
	 * request.history[].from must start with `user` and end with `model`
	 */
	history.forEach((message, index) => {
		// user's message must be even index (0, 2, 4, 6, ...)
		if (index % 2 === 0 && message.from !== "user") {
			throw new InputException("user's messages must be arrange in even number");
		}

		// model's message must be odd index (1, 3, 5, 7, ...)
		if (index % 2 !== 0 && message.from !== "model") {
			throw new InputException("model's messages must be arrange in odd number");
		}
	});
}
