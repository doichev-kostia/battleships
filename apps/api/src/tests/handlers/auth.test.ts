import { RegisterBody } from "@battleships/contracts";
import { expect } from "chai";
import { HandlerTestBase } from "tests/utils/handler-test-base";
import { EntityManager } from "@mikro-orm/core";
import { AuthHandler } from "controllers/auth/auth.handler";

describe("Handler test", () => {
	describe("Auth tests", () => {
		let base: HandlerTestBase;
		let em: EntityManager;
		before(async () => ({ base, em } = await HandlerTestBase.before()));

		beforeEach(async () => {
			await base.beforeEach();
		});

		it("Should create a user", async () => {
			const user = {
				firstName: "John",
				lastName: "Doe",
				username: "johndoe",
				email: "test-user@gmail.com",
				password: "password123",
			};

			const { user: newUser } = await AuthHandler.register(user as RegisterBody);
			delete user.password;
			expect(newUser).to.include(user);
		});

		after(() => base.after());
		afterEach(() => base.afterEach());
	});
});
