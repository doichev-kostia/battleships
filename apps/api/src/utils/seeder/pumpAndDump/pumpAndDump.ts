import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DatabaseSeeder } from "utils/seeder/seeder";
import { execAsync } from "utils/seeder/pumpAndDump/execAsync";

const getDumpCommand = (hashedDumpFile: string) => {
	if (process.env.DATABASE_URL) {
		return `pg_dump ${process.env.DATABASE_URL} > ${hashedDumpFile}`;
	}

	return `docker exec -i ${process.env.POSTGRES_CONTAINER} pg_dump -U ${process.env.POSTGRES_USER} ${process.env.POSTGRES_DB} > ${hashedDumpFile}`;
};

export const pumpAndDump = async (orm: MikroORM<PostgreSqlDriver>, hashedDumpFile: string) => {
	const dumpCommand = getDumpCommand(hashedDumpFile);
	const seeder = new DatabaseSeeder(orm);
	await seeder.refresh();
	await seeder.seed();

	if (process.env.SHOULD_DUMP) {
		console.log("Dumping database...");
		await execAsync(dumpCommand);
	}

	if (process.env.PAPI_VERBOSE !== "none") {
		console.log(`Database dumped in ${hashedDumpFile}`);
	}
};
