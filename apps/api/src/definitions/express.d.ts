import { EntityManager } from "@mikro-orm/core";

declare module "express" {
	interface Request {
		em: EntityManager;
		token: object;
		rawBody: any;
	}
}
