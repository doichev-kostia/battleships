import { Entries } from "./src/app/utils/types";

declare global {
	interface ObjectConstructor {
		entries<T>(o: T): Entries<T>;
	}
}

export {};
