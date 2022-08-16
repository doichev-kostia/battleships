import hashFiles from "hash-files";
import fs from "fs-extra";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { pumpAndDump } from "utils/seeder/pumpAndDump/pumpAndDump";
import { getEm } from "utils/request-context-manager";
import { execAsync } from "utils/seeder/pumpAndDump/execAsync";

const DROP_SCHEMAS_COMMAND = "DROP SCHEMA public CASCADE; CREATE SCHEMA public;";

let fileHash = "";

const generateHash = async () => {
	if (fileHash) return fileHash;

	fileHash = await new Promise((resolve, reject) => {
		hashFiles(
			{
				files: ["./src/seeders/*", "./src/**/*.entity.*", "./src/migrations/*"],
			},
			async (error, hash) => {
				if (error) {
					console.log(`error: ${error.message}`);
					reject();
					return;
				}
				resolve(hash);
			},
		);
	});
	return fileHash;
};

const getDumpPath = async () => {
	const hash = await generateHash();
	const root = process.env.NODE_ENV === "development" ? "src" : "src/tests";
	const dumpDirectory = `${root}/assets/dumps`;
	const hashedDumpFile = `${dumpDirectory}/${hash}.sql`;
	return {
		dumpDirectory,
		hashedDumpFile,
	};
};

export const checkDbHasChanged = async () => {
	const { hashedDumpFile } = await getDumpPath();
	return !fs.existsSync(hashedDumpFile);
};

export const dropAndLoad = async (orm: MikroORM<PostgreSqlDriver>, isForced = false) => {
	const { dumpDirectory, hashedDumpFile } = await getDumpPath();

	if ((await checkDbHasChanged()) || isForced) {
		if (process.env.PAPI_VERBOSE !== "none") {
			console.log(`Loading fixtures because ${isForced ? "it's forced" : "of changes"}`);
		}

		fs.emptyDirSync(dumpDirectory);
		fs.writeFileSync(`${dumpDirectory}/.gitkeep`, "!.gitignore");

		await pumpAndDump(orm, hashedDumpFile);
		getEm().clear();
		return;
	} else {
		console.log("Not regenerating fixtures because no changes detected");
	}

	await orm.em.execute(DROP_SCHEMAS_COMMAND);
	const loadCommand = process.env.DATABASE_URL
		? `psql ${process.env.DATABASE_URL} < ${hashedDumpFile}`
		: `docker exec -i ${process.env.POSTGRES_CONTAINER} psql -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} < ${hashedDumpFile}`;

	await execAsync(loadCommand);
};
