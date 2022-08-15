export const paths = {
	signIn: "sign-in",
	signUp: "sign-up",
	signOut: "sign-out",
	admin: "admin",
	gamer: "gamer",
	dashboard: "dashboard",
	profile: "profile",
	game: "game",
	archive: "archive",
};

const applyBasePath = (basePath: string, paths: string[]) => `/${basePath}/${paths.join("/")}`;

export const gamerAbsolutePaths = (() => {
	const basePath = paths.gamer;
	return {
		dashboard: applyBasePath(basePath, [paths.dashboard]),
		profile: applyBasePath(basePath, [paths.profile]),
		game: applyBasePath(basePath, [paths.game, ":id"]),
		archive: applyBasePath(basePath, [paths.archive]),
	} as const;
})();

export const adminAbsolutePaths = (() => {
	const basePath = paths.admin;

	return {
		dashboard: applyBasePath(basePath, [paths.dashboard]),
		profile: applyBasePath(basePath, [paths.profile]),
	};
})();
