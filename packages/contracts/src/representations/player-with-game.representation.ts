import { Exclude, Expose } from "class-transformer";
import { PlayerRepresentation } from "./player.representation";
import { GameRepresentation } from "./game.representation";

@Exclude()
export class PlayerWithGameRepresentation extends PlayerRepresentation {
	@Expose()
	public game: GameRepresentation;
}
