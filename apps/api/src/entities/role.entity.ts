import { Base } from "utils/entities/base.entity";
import { ROLE_TYPE } from "@battleships/contracts";
import { Entity, Enum, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/user.entity";

@Entity()
export class Role extends Base<Role> {
	@Enum(() => ROLE_TYPE)
	type: ROLE_TYPE = ROLE_TYPE.GAMER;
	@ManyToOne(() => User)
	user: User;
}
