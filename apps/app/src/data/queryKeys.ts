export const authKeys = (() => {
	const base = "auth";
	return {
		register: `${base}/register`,
		login: `${base}/login`,
	} as const;
})();

export const tokenKeys = (() => {
	const base = "token";
	return {
		refresh: `${base}/refresh`,
	} as const;
})();

export const userKeys = (() => {
	const base = "user";
	return {
		get: (id: string) => `${base}/get/${id}`,
	} as const;
})();
