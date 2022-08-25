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

export const gameKeys = (() => {
	const base = "game";
	return {
		create: `${base}/create`,
		join: `${base}/join`,
		get: (id: string) => `${base}/get/${id}`,
		start: `${base}/start`,
		finish: `${base}/finish`,
		shoot: `${base}/shoot`,
		available: `${base}/available`,
		finished: `${base}/finished`,
		exportFinished: `${base}/finished/export`,
		delete: `${base}/delete`,
	};
})();

export const playerKeys = (() => {
	const base = "player";
	return {
		update: `${base}/update`,
	};
})();
