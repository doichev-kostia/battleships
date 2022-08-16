declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			JWT_SECRET: string;
			// In seconds
			ACCESS_TOKEN_LIFETIME: string;
			// In milliseconds
			REFRESH_TOKEN_LIFETIME: string;
			DATABASE_URL: string;
			POSTGRES_CONTAINER: string;
			POSTGRES_USER: string;
			POSTGRES_PASSWORD: string;
			POSTGRES_DB: string;
			SHOULD_DUMP: string;
			PAPI_VERBOSE: "none" | string;
		}
	}
}

export {};
