import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { getEm, RequestContextManager } from "utils";
import ormConfig from "orm.config";

export class HandlerTestBase {
	public orm!: MikroORM<PostgreSqlDriver>;

	public readonly createConnection = async () => {
		try {
			this.orm = (await MikroORM.init(ormConfig)) as MikroORM<PostgreSqlDriver>;
			RequestContextManager.setEm(this.orm.em.fork());
		} catch (error) {
			console.log("Error while connecting to the database", error);
			throw error;
		}
	};

	public static readonly before = async () => {
		const base = new HandlerTestBase();
		await base.createConnection();
		const em = getEm();
		return { base, em };
	};
}
