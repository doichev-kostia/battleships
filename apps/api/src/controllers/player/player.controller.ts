import { Authorized, JsonController, Param, Patch } from "routing-controllers";
import { Body, Representer } from "@panenco/papi";
import { PlayerBody, PlayerWithGameRepresentation } from "@battleships/contracts";
import { PlayerHandler } from "./player.handler";

@JsonController("/players")
export class PlayerController {
	@Patch("/:playerId")
	@Authorized()
	@Representer(PlayerWithGameRepresentation)
	public update(
		@Param("playerId") playerId: string,
		@Body({}, { skipMissingProperties: true }) body: PlayerBody,
	) {
		return PlayerHandler.update(playerId, body);
	}
}
