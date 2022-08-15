import { PostgreSqlDriver } from "@mikro-orm/postgresql";

import { MikroORM } from "@mikro-orm/core";
import { checkDbHasChanged, dropAndLoad } from "utils/seeder/pumpAndDump/dropAndLoad";
import { getEm } from "utils/request-context-manager";

export class TestDbDataService {
	private static isLoaded: boolean;

	private orm: MikroORM<PostgreSqlDriver>;

	constructor(orm: MikroORM<PostgreSqlDriver>) {
		this.orm = orm;
	}

	public async loadFixtures() {
		await dropAndLoad(this.orm);
	}

	public async loadTransactionalFixtures() {
		if (TestDbDataService.isLoaded || !(await checkDbHasChanged())) {
			return;
		}

		await this.loadFixtures();
		TestDbDataService.isLoaded = true;
	}

	public async startTestTransaction() {
		await this.loadTransactionalFixtures();
		getEm().clear();
		this.orm.em.clear();
		await this.orm.em.begin();
		await getEm().begin();
	}

	public async rollbackTestTransaction() {
		await this.orm.em.rollback();
		await getEm().rollback();
	}
}
