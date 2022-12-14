import { Entity, Enum, ManyToOne, OneToMany } from "@mikro-orm/core";
import { ROLE_TYPE } from "@battleships/contracts";
import { Base } from "utils/entities/base.entity";

import { Player } from "./player.entity";
import { User } from "./user.entity";

@Entity()
export class Role extends Base<Role> {
	@Enum(() => ROLE_TYPE)
	public type: ROLE_TYPE = ROLE_TYPE.GAMER;

	@OneToMany(() => Player, (player) => player.role)
	public players: Player[];

	@ManyToOne("User")
	public user: User;
}
