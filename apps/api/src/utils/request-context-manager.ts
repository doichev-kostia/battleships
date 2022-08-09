import { EntityManager, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export class RequestContextManager {
	private static em: EntityManager<PostgreSqlDriver>;

	public static getEM(): EntityManager<PostgreSqlDriver> {
		return (
			RequestContextManager.em ??
			(RequestContext.getEntityManager() as EntityManager<PostgreSqlDriver>)
		);
	}

	/**
	 * For testing purposes only.
	 */
	public static setEM(em: EntityManager<PostgreSqlDriver>) {
		RequestContextManager.em = em;
	}
}

export const { getEM } = RequestContextManager;
