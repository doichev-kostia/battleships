import { getEm } from "utils";
import { Role } from "entities/role.entity";
import { PagingQuery } from "@panenco/papi";
import { Game } from "entities/game.entity";

export class RoleHandler {
	public static getGames = async (
		roleId: string,
		query: PagingQuery = {},
	): Promise<[Game[], number]> => {
		const em = getEm();

		const role = await em.findOneOrFail(Role, roleId, { populate: ["players.game"] });
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const games = role.players.toArray().map((player) => player.game);
		return [games, games.length];
	};
}
