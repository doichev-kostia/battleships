import { LoginBody, UserBody } from "@battleships/contracts";
import { getEM } from "utils";
import { User } from "entities";

export class AuthHandler {
	static async login(body: LoginBody) {}

	static async register(body: UserBody) {
		const em = getEM();

		if (await em.findOne(User, { email: body.email })) {
			throw new Error("Email already exists");
		}

		const userInput = { ...body };
		const user = em.create(User, userInput);
		if (user.password) await user.setPassword(user.password);

		await em.persistAndFlush(user);
		return user;
	}
}
