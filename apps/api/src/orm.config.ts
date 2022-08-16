import { FlushMode, Options, ReflectMetadataProvider } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";
import dotenv from "dotenv";

import { noEntityFoundError } from "utils";
import { paths } from "paths";

const env = process.env.NODE_ENV || "development";
const isTest = env === "test";
const dockerEnv = path.join(paths.root, `docker.${isTest ? "test." : ""}env`);

dotenv.config({
	path: dockerEnv,
});

const { POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD } = process.env;

export default {
	allowGlobalContext: true,
	flushMode: FlushMode.COMMIT,
	migrations: {
		path: path.join(__dirname, "migrations"),
		tableName: "migrations",
		transactional: true,
		pattern: /^[\w-]+\d+\.(ts|js)$/,
		disableForeignKeys: false,
		emit: "js",
	},
	// default in v4, so not needed to specify explicitly
	metadataProvider: ReflectMetadataProvider,
	findOneOrFailHandler: noEntityFoundError,
	type: "postgresql",
	tsNode: false,
	entities: [path.join(process.cwd(), "**", "*.entity.js")],
	entitiesTs: [path.join(process.cwd(), "**", "*.entity.ts")],
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	dbName: POSTGRES_DB,
	host: "localhost",
	port: isTest ? 5433 : 5432,
	ssl: false,
} as Options<PostgreSqlDriver>;
