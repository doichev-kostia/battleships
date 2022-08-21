import { Base } from "utils/entities/base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Player } from "./player.entity";

@Entity()
export class Ship extends Base<Ship> {
	@ManyToOne("Player")
	public player: Player;

	@Property()
	public xStart: number;

	@Property()
	public yStart: number;

	@Property()
	public xEnd: number;

	@Property()
	public yEnd: number;
}
