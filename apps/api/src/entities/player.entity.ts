import { Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Base } from "utils/entities/base.entity";

import { Role } from "./role.entity";
import { Game } from "./game.entity";
import { Shot } from "./shot.entity";
import { Ship } from "./ship.entity";

@Entity()
export class Player extends Base<Player> {
	@ManyToOne(() => Role)
	public role: Role;

	@Property()
	public isWinner = false;

	@ManyToOne("Game")
	public game: Game;

	@OneToMany("Shot", "player")
	public shots = new Collection<Shot>(this);

	@OneToMany("Ship", "player")
	public ships = new Collection<Ship>(this);
}
