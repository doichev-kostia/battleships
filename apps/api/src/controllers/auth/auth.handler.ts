import { AuthHelper } from "controllers/auth/auth.helper";
import { createLoginTokens } from "utils/helpers/tokens/create-login-tokens";
import { LoginBody, RegisterBody } from "@battleships/contracts";
import { getEm, hashPassword } from "utils";
import { BadRequest } from "@panenco/papi";

import { Role } from "entities/role.entity";
import { User } from "entities/user.entity";

export class AuthHandler {
	public static login = async (body: LoginBody) => {
		const { email, password } = body;
		const user = await AuthHelper.checkPassword({ email }, password);

		return createLoginTokens(user);
	};

	public static register = async (body: RegisterBody) => {
		const em = getEm();

		const a = await em.findOne(User, { email: body.email });

		if (a) {
			throw new BadRequest("emailAlreadyExist", "Email already exists");
		}

		const password = await hashPassword(body.password);
		const userInput = { ...body, password };
		const role = em.create(Role, {});
		const user = em.create(User, userInput);
		role.user = user;

		await em.persistAndFlush([user, role]);
		return await createLoginTokens(user);
	};
}
