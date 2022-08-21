import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";
import { Nested } from "../../utils/nested.decorator";
import { ShipBody } from "./ship.body";

@Exclude()
export class JoinGameBody {
	@Expose()
	@IsUUID()
	@IsOptional()
	// In case the computer is playing, the userId is not required
	public userId?: string;

	@Expose()
	@Nested(ShipBody, true)
	public ships: ShipBody[];
}
