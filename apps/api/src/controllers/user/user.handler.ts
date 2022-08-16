import { getEm } from "utils";
import { User } from "entities/user.entity";
import { NotFound } from "@panenco/papi";

export class UserHandler {
	static async get(id: string) {
		const em = getEm();

		const user = await em.findOne(User, { id }, { populate: ["roles"] });
		if (!user) {
			throw new NotFound("userNotFound", "User not found");
		}
		return user;
	}
}
