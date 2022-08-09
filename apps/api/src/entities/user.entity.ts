import { Base } from "utils/entities/base.entity";
import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Role } from "entities/role.entity";
import { RefreshToken } from "entities/token/refresh-token.entity";
import { hashPassword } from "utils";

@Entity()
export class User extends Base<User> {
	@Property()
	public firstName: string;

	@Property()
	public lastName: string;

	@Property({ unique: true })
	public email: string;

	@Property({ unique: true })
	public username: string;

	@Property()
	public password?: string;

	@Property({ nullable: true })
	public phoneNumber?: string;

	@OneToMany(() => Role, (role) => role.user)
	public roles = new Collection<Role>(this);

	@OneToMany(() => RefreshToken, (token) => token.user)
	public refreshTokens = new Collection<RefreshToken>(this);

	@Property({ persist: false })
	public get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	public async setPassword(password: string) {
		this.password = await hashPassword(password);
	}
}
