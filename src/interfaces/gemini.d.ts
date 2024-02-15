import type { GeminiConfig } from "./env";
import { History } from "./chat";
import { InputContent } from "@google/generative-ai";

interface ChatInputGemini {
	role: string;
	history: History;
	apiKey: string;
	config: GeminiConfig;
}

export interface GeminiInputContent extends InputContent {}
