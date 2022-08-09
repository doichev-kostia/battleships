import { Base } from "utils/entities/base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Player } from "./player.entity";

@Entity()
export class Shot extends Base<Shot> {
	@Property()
	public x: number;

	@Property()
	public y: number;

	@ManyToOne(() => Player)
	public player: Player;
}
