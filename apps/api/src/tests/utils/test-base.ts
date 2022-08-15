import { TestDbDataService } from "utils/seeder/pumpAndDump/testDbDataService";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export abstract class TestBase {
	protected testDbService: TestDbDataService;

	public setTestDbService(orm: MikroORM<PostgreSqlDriver>) {
		this.testDbService = new TestDbDataService(orm);
	}

	public async beforeEach() {
		await this.testDbService.startTestTransaction();
	}

	public async afterEach() {
		await this.testDbService.rollbackTestTransaction();
	}
}
