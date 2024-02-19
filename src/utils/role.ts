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

export function findRole(role: string) {
	return roleMapper.find((obj) => obj.role === role);
}

export function hasRole(role: string) {
	return roleMapper.some((obj) => obj.role === role);
}
