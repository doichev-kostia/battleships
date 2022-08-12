import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";
import { noEntityFoundError } from "utils";

export default {
	migrations: {
		path: path.join(__dirname, "migrations"),
		tableName: "migrations",
		transactional: true,
		pattern: /^[\w-]+\d+\.(ts|js)$/,
		disableForeignKeys: false,
		emit: "js",
	},
	type: "postgresql",
	tsNode: false,
	entities: [path.join(process.cwd(), "**", "*.entity.js")],
	entitiesTs: [path.join(process.cwd(), "**", "*.entity.ts")],
	user: "root",
	password: "root",
	dbName: "node-course",
	host: "localhost",
	port: 5432,
	ssl: false,
	findOneOrFailHandler: noEntityFoundError,
} as Options<PostgreSqlDriver>;
