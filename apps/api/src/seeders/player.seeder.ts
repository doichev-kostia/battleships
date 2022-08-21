import { EntitySeeder } from "utils/seeder/entity.seeder";
import { EntityManager } from "@mikro-orm/core";
import { SeederEntityMap } from "utils/seeder/seeder";
import { Builder } from "utils";
import { createSimpleUUID } from "utils/helpers";
import { RoleSeeder } from "seeders/role.seeder";
import { Player } from "entities/player.entity";
import { Role } from "entities/role.entity";
import { Game } from "entities/game.entity";
import { GameSeeder } from "seeders/game.seeder";

export class PlayerSeeder extends EntitySeeder<Player> {
	public dependencies = [RoleSeeder, GameSeeder];

	public seed = async (em: EntityManager, entities: SeederEntityMap) => {
		const roles = entities.get(Role);
		const games = entities.get(Game);

		this.entities = Builder.list(Player, 10)
			.with((x) => ({
				id: createSimpleUUID(x),
				role: roles[x],
				game: games[x],
			}))
			.last(2)
			.with({
				isWinner: true,
			})
			.build(em);
		return this.entities;
	};
}
