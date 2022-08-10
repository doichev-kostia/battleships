import { AuthHandler } from "controllers/auth/auth.handler";
import { RegisterBody } from "@battleships/contracts";
import { expect } from "chai";
import { HandlerTestBase } from "tests/utils/handler-test-base";
import { EntityManager } from "@mikro-orm/core";

describe("Handler test", () => {
	describe("Auth tests", () => {
		let em: EntityManager;
		before(async () => ({ em } = await HandlerTestBase.before()));

		it("Should create a user", async () => {
			const user = {
				firstName: "John",
				lastName: "Doe",
				email: "test-user@gmail.com",
				password: "password123",
			};

			const createdUser = await AuthHandler.register(user as RegisterBody);
			delete user.password;
			expect(createdUser).to.include(user);
		});
	});
});
