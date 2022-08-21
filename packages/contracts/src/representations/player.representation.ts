import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsUUID } from "class-validator";
import { Nested } from "../utils/nested.decorator";

import { ShotRepresentation } from "./shot.representation";
import { ShipRepresentation } from "./ship.representation";
import { RoleWithUserRepresentation } from "./role-with-user.representation";

@Exclude()
export class PlayerRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

	@Expose()
	@IsBoolean()
	public isWinner: boolean;

	@Expose()
	@Nested(ShotRepresentation, true)
	public shots: ShotRepresentation[];

	@Expose()
	@Nested(ShipRepresentation, true)
	public ships: ShipRepresentation[];

	@Expose()
	@Nested(RoleWithUserRepresentation)
	public role: RoleWithUserRepresentation;
}
