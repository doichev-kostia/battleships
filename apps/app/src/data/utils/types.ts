export type APIError<Errors = unknown> = {
	message: string;
	reason: string;
	errors?: Errors;
};

export type APIValidationError<T extends object> = APIError<{
	[K in keyof T]?: string | object | string[];
}>;
