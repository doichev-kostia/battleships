import { HandlerTestBase } from "tests/utils/handler-test-base";
import { EntityManager } from "@mikro-orm/core";
import { RoleHandler } from "controllers/role/role.handler";
import { createSimpleUUID } from "utils/helpers";
import { expect } from "chai";

describe("Handler test", () => {
	describe("Role tests", () => {
		let base: HandlerTestBase;
		let em: EntityManager;
		before(async () => ({ base, em } = await HandlerTestBase.before()));

		beforeEach(async () => {
			await base.beforeEach();
		});

		it("should fetch role's games", async () => {
			const roleId = createSimpleUUID(0);
			const [games, count] = await RoleHandler.getGames(roleId);
			expect(count).to.be.greaterThan(0);
			expect(games).to.be.an("array");
		});

		after(() => base.after());
		afterEach(() => base.afterEach());
	});
});
