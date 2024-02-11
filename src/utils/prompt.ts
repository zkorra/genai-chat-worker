const dummyMapper = [
	{
		dummy: "cat",
		prompt: "Pretend you're a cat and stay in character for each response.",
		modelTurned: "Meow!",
	},
	{
		dummy: "dog",
		prompt: "Pretend you're a dog and stay in character for each response.",
		modelTurned: "Bok!",
	},
];

export function findPrompt(dummy: string) {
	return dummyMapper.find((obj) => obj.dummy === dummy);
}
