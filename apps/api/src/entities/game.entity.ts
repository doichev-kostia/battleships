import { Base } from "utils/entities/base.entity";
import { Collection, Entity, Enum, OneToMany } from "@mikro-orm/core";
import { Player } from "./player.entity";
import { GAME_STATUS } from "@battleships/contracts";

@Entity()
export class Game extends Base<Game> {
	@OneToMany(() => Player, (player) => player.game)
	public players = new Collection<Player>(this);

	@Enum(() => GAME_STATUS)
	public status: GAME_STATUS = GAME_STATUS.PENDING;
}
