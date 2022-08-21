module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier", "tailwindcss"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:prettier/recommended",
		"plugin:tailwindcss/recommended",
	],
	rules: {
		"prettier/prettier": [
			"error",
			{
				useTabs: true,
				semi: true,
			},
		],
		"@typescript-eslint/no-var-requires": 0,
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/no-inferrable-types": "warn",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
