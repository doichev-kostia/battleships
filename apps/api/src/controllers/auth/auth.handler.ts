import { AuthHelper } from "controllers/auth/auth.helper";
import { createLoginTokens } from "utils/helpers/tokens/create-login-tokens";
import { LoginBody, RegisterBody } from "@battleships/contracts";
import { getEm, hashPassword } from "utils";
import { BadRequest } from "@panenco/papi";

import { Role } from "entities/role.entity";
import { User } from "entities/user.entity";

export class AuthHandler {
	public static login = async (body: LoginBody) => {
		const { login, password } = body;
		const user = await AuthHelper.checkPassword(
			{
				$or: [
					{
						email: login,
					},
					{
						username: login,
					},
				],
			},
			password,
		);

		return createLoginTokens(user);
	};

	public static register = async (body: RegisterBody) => {
		const em = getEm();

		const a = await em.findOne(User, {
			$or: [
				{
					email: body.email,
				},
				{
					username: body.username,
				},
			],
		});

		if (a) {
			const { reason, message } = AuthHandler.getProperErrorMessage(
				a.email === body.email ? "email" : "username",
			);
			throw new BadRequest(reason, message);
		}

		const password = await hashPassword(body.password);
		const userInput = { ...body, password };
		const user = em.create(User, userInput);
		em.persist(user);
		const role = em.create(Role, { user });
		em.persist(role);
		user.roles.add(role);
		await em.flush();
		return await createLoginTokens(user);
	};

	private static getProperErrorMessage(reason: "email" | "username") {
		const isEmail = reason === "email";
		return {
			reason: isEmail ? "emailAlreadyExist" : "usernameAlreadyExist",
			message: isEmail ? "Email already exists" : "Username already exists",
		};
	}
}
