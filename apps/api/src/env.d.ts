declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			JWT_SECRET: string;
			// In seconds
			ACCESS_TOKEN_LIFETIME: string;
			// In milliseconds
			REFRESH_TOKEN_LIFETIME: string;
		}
	}
}

export {};
