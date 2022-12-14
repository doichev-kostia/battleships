import { Exclude, Expose } from "class-transformer";
import { IsDate, IsEnum, IsUUID } from "class-validator";
import { GAME_STATUS } from "../enums/game-status";
import { Nested } from "../utils/nested.decorator";

import { PlayerRepresentation } from "./player.representation";

@Exclude()
export class GameRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

	@Expose()
	@IsDate()
	public createdAt: Date;

	@Expose()
	@IsEnum(GAME_STATUS)
	public status: GAME_STATUS;

	@Expose()
	@Nested(PlayerRepresentation, true)
	public players: PlayerRepresentation[];
}
