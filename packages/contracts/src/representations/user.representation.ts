import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, IsUUID } from "class-validator";
import { Nested } from "../utils/nested.decorator";

import { RoleRepresentation } from "./role.representation";

@Exclude()
export class UserRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

	@Expose()
	@IsString()
	public firstName: string;

	@Expose()
	@IsString()
	public lastName: string;

	@Expose()
	@IsString()
	public username: string;

	@Expose()
	@IsEmail()
	public email: string;

	@Expose()
	@Nested(RoleRepresentation, true)
	public roles: RoleRepresentation[];
}
