import { Exclude, Expose } from "class-transformer";
import { RoleRepresentation } from "./role.representation";
import { Nested } from "../utils/nested.decorator";
import { UserRepresentation } from "./user.representation";

@Exclude()
export class RoleWithUserRepresentation extends RoleRepresentation {
	@Expose()
	@Nested(UserRepresentation)
	public user: UserRepresentation;
}
