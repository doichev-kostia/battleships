import { FilterQuery } from "@mikro-orm/core";
import { getEm } from "utils";
import { compare } from "bcryptjs";
import { Forbidden } from "@panenco/papi";

import { User } from "entities/user.entity";

export class AuthHelper {
	public static checkPassword = async (userFilter: FilterQuery<User>, password: string) => {
		const em = getEm();

		const user = await em.findOne(User, userFilter);

		if (!user || !(await compare(password, user.password))) {
			throw new Forbidden("invalidCredentials", "The provided credentials are incorrect");
		}

		return user;
	};
}
