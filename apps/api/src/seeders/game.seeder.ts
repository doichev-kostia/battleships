import { EntityManager } from "@mikro-orm/core";
import { GAME_STATUS } from "@battleships/contracts";

import { Builder } from "utils";
import { EntitySeeder } from "utils/seeder/entity.seeder";
import { createSimpleUUID } from "utils/helpers";
import { Game } from "entities/game.entity";

export class GameSeeder extends EntitySeeder<Game> {
	public seed = async (em: EntityManager) => {
		this.entities = Builder.list(Game, 10)
			.with((x) => ({
				id: createSimpleUUID(x),
			}))
			.first(4)
			.with({
				status: GAME_STATUS.PENDING,
			})
			.next(3)
			.with({
				status: GAME_STATUS.IN_PROGRESS,
			})
			.next(3)
			.with({
				status: GAME_STATUS.FINISHED,
			})
			.build(em);

		return this.entities;
	};
}
