export type Bindings = {
	GEMINI_API_KEY: string;
	GEMINI_CONFIG: GeminiConfig;
};

type GeminiConfig = {
	MODEL_NAME: string;
	MAX_OUTPUT_TOKENS: number;
};
