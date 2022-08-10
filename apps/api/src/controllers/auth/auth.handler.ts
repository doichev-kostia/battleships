import { LoginBody, RegisterBody } from "@battleships/contracts";
import { getEm, hashPassword } from "utils";
import { Role, User } from "entities";

export class AuthHandler {
	static async login(body: LoginBody) {}

	static async register(body: RegisterBody) {
		const em = getEm();

		if (await em.findOne(User, { email: body.email })) {
			throw new Error("Email already exists");
		}

		const userInput = { ...body, password: await hashPassword(body.password) };
		const user = em.create(User, userInput);
		const role = em.create(Role, { user });
		em.persist([user, role]);

		await em.flush();
		return user;
	}
}
