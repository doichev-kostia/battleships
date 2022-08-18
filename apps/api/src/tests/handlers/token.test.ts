import { expect } from "chai";
import { HandlerTestBase } from "tests/utils/handler-test-base";
import { EntityManager } from "@mikro-orm/core";
import { AuthHandler } from "controllers/auth/auth.handler";
import { createTestCredentials } from "tests/utils/constants";
import { TokenHandler } from "controllers/token/token.handler";
import { ROLE_TYPE } from "@battleships/contracts";

describe("Handler test", () => {
	describe("Token tests", () => {
		let base: HandlerTestBase;
		let em: EntityManager;
		before(async () => ({ base, em } = await HandlerTestBase.before()));

		beforeEach(async () => {
			await base.beforeEach();
		});

		it("should refresh the token", async () => {
			const { email, password } = createTestCredentials("0");
			const { user, refreshToken } = await AuthHandler.login({ login: email, password });

			expect(refreshToken.value).to.be.a("string");

			const accessToken = await TokenHandler.refreshAccessToken(
				refreshToken.value,
				user.id,
				ROLE_TYPE.GAMER,
			);
			expect(accessToken.token).to.be.a("string");
		});

		after(() => base.after());
		afterEach(() => base.afterEach());
	});
});
