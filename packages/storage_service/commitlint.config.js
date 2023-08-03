module.exports = {
	extends: ["@commitlint/config-conventional"],
	//Ignore bump messages for dependabot bump commits, sometimes creates headers longer than the character limit thus failing the workflow
	ignores: [(message) => message.includes("chore(release)")],
};
