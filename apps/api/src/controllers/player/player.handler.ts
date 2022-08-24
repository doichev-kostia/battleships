import { instanceToPlain } from "class-transformer";
import { PlayerBody } from "@battleships/contracts";
import { getEm } from "utils";
import { Player } from "entities/player.entity";

export class PlayerHandler {
	public static update = async (playerId: string, body: PlayerBody) => {
		const em = getEm();

		const player = await em.findOneOrFail(Player, playerId);

		player.assign(instanceToPlain(body));

		await em.flush();

		return player;
	};
}
