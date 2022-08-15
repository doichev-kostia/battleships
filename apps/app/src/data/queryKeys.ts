export const authKeys = (() => {
	const base = "auth";
	return {
		register: `${base}/register`,
		login: `${base}/login`,
	} as const;
})();
