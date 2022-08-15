import { Exclude, Expose } from "class-transformer";
import { IsEnum, IsUUID } from "class-validator";

import { ROLE_TYPE } from "../enums/role-type";

@Exclude()
export class RoleRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

	@Expose()
	@IsEnum(ROLE_TYPE)
	public type: ROLE_TYPE;
}
