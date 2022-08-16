import { Base } from "utils/entities/base.entity";
import { ClassType, importClasses } from "@panenco/papi";
import { EntitySeeder } from "utils/seeder/entity.seeder";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { setFixtureDate } from "utils/helpers/date";
import { paths } from "paths";

export type SeederEntityMap = {
	[key: string]: Base<any>[];
} & {
	get: <T extends Base<any>>(type: ClassType<T>) => T[];
};

export class DatabaseSeeder {
	private readonly DROP_COMMAND = "DROP SCHEMA public CASCADE; CREATE SCHEMA public;";
	public seeders: EntitySeeder<Base<any>>[];

	public orm: MikroORM<PostgreSqlDriver>;

	public entities: SeederEntityMap;

	constructor(orm: MikroORM<PostgreSqlDriver>) {
		setFixtureDate();
		this.entities = {
			get: <T extends Base<any>>(type: ClassType<T>): T[] =>
				this.entities[type.name.toLowerCase()] as T[],
		} as SeederEntityMap;
		const seeders = importClasses<EntitySeeder<Base<any>>>([
			`${paths.root}/**/seeders/**/*.seeder.js`,
		]);
		this.seeders = seeders.map((seeder) => new seeder(orm));
		this.orm = orm;
	}

	public refresh = async () => {
		this.seeders.forEach((seeder) => seeder.reset());
		await this.orm.em.execute(this.DROP_COMMAND);
		await this.prepare();
	};

	public seed = async () => {
		await RequestContext.createAsync(this.orm.em, async () => {
			while (this.seeders.some((seeder) => !seeder.isDone)) {
				await Promise.all(
					this.seeders.map(async (seeder) => {
						const isEveryDependencySeeded = seeder.dependencies.every((dependency) => {
							const dependencySeeder = this.seeders.find((seeder) => seeder instanceof dependency);
							return dependencySeeder.isDone;
						});
						if (isEveryDependencySeeded && !seeder.isDone) {
							await seeder.seed(this.orm.em, this.entities);
							seeder.isDone = true;
							const entityName = seeder.constructor.name.replace("Seeder", "").toLowerCase();
							this.entities[entityName] = seeder.entities;
						}
					}),
				);
			}
			await this.orm.em.flush();
		});
	};

	private prepare = async () => {
		await this.orm.getMigrator().up();
	};
}
