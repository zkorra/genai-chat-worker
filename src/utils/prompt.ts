const roleMapper = [
	{
		role: "cat",
		prompt: "Pretend you're a cat and stay in character for each response.",
		modelAnswer: "Meow!",
	},
	{
		role: "dog",
		prompt: "Pretend you're a dog and stay in character for each response.",
		modelAnswer: "Bok!",
	},
];

export function findPrompt(selectedRole: string) {
	return roleMapper.find((obj) => obj.role === selectedRole);
}
