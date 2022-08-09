import { Base } from "utils/entities/base.entity";
import { Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
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

	@ManyToOne(() => Game)
	public game: Game;

	@OneToMany(() => Shot, (shot) => shot.player)
	public shots = new Collection<Shot>(this);

	@OneToMany(() => Ship, (ship) => ship.player)
	public ships = new Collection<Ship>(this);
}
