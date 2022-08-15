import { Base } from "utils/entities/base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Player } from "./player.entity";

@Entity()
export class Ship extends Base<Ship> {
	@ManyToOne("Player")
	public player: Player;

	@Property()
	public x_start: number;

	@Property()
	public y_start: number;

	@Property()
	public x_end: number;

	@Property()
	public y_end: number;
}
