import { AxiosError } from "axios";

export type ListRepresentation<Entity extends object> = {
	count: number;
	items: Entity[];
};

export type APIError<Errors = unknown> = {
	message: string;
	reason: string;
	errors?: Errors;
};

export type APIValidationError<T extends object> = APIError<{
	[K in keyof T]?: string | object | string[];
}>;

export type AxiosAPIError<Entity extends object> = AxiosError<
	APIError | APIValidationError<Entity>
>;
