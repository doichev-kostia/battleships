import ormConfig from "orm.config";
import { MikroORM } from "@mikro-orm/core";
import { RequestContextManager } from "utils";
import { dropAndLoad } from "utils/seeder/pumpAndDump/dropAndLoad";

const loadFixtures = async () => {
	const orm = await MikroORM.init(ormConfig);
	RequestContextManager.setEm(orm.em.fork());
	await dropAndLoad(orm, false);
};

loadFixtures()
	.then(() => {
		console.log("Fixtures loaded");
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
