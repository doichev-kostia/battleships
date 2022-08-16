import { Base } from "utils/entities/base.entity";
import { EntityManager } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeederEntityMap } from "utils/seeder/seeder";

export abstract class EntitySeeder<T extends Base<any>> {
	public dependencies: any[] = [];
	public entities: T[] = [];
	public isDone = false;
	abstract seed: (em: EntityManager<PostgreSqlDriver>, entities: SeederEntityMap) => Promise<T[]>;
	create?: (
		em: EntityManager<PostgreSqlDriver>,
		body: object,
		sitemap: string,
	) => Promise<Base<any>>;

	reset = () => {
		this.entities = [];
		this.isDone = false;
	};
}
