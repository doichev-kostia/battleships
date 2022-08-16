import { EntityManager } from "@mikro-orm/core";
import { EntitySeeder } from "utils/seeder/entity.seeder";
import { User } from "entities/user.entity";
import { Builder } from "utils";
import { createSimpleUUID } from "utils/helpers";
import * as faker from "faker";
import { createTestEmail, createTestPassword } from "tests/utils/constants";

export class UserSeeder extends EntitySeeder<User> {
	public seed = async (em: EntityManager) => {
		this.entities = Builder.list(User, 10)
			.with((x) => ({
				id: createSimpleUUID(x),
				email: createTestEmail(x.toString()),
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				username: faker.internet.userName(),
				password: createTestPassword(x.toString()),
			}))
			.next(5)
			.with({
				phoneNumber: faker.phone.phoneNumber(),
			})
			.build(em);

		await Promise.all(this.entities.map(async (user) => await user.setPassword(user.password)));
		return this.entities;
	};
}
