module.exports = {
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"added",
				"refactored",
				"update",
				"modified",
				"fixed",
				"hotfixed",
				"test"
			]
		],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"subject-empty": [2, "never"]
	}
}
