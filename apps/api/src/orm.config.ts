import { FlushMode, Options, ReflectMetadataProvider } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";

import { noEntityFoundError } from "./utils/extensions";

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
	user: "root",
	password: "root",
	dbName: "battleships",
	host: "localhost",
	port: 5432,
	ssl: false,
} as Options<PostgreSqlDriver>;
