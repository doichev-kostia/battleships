import { Exclude, Expose } from "class-transformer";
import { IsEnum, IsUUID } from "class-validator";
import { ROLE_TYPE } from "../../enums/role-type";

@Exclude()
export class TokenBody {
	@Expose()
	@IsEnum(ROLE_TYPE)
	public roleType: ROLE_TYPE;

	@Expose()
	@IsUUID()
	public userId: string;
}
