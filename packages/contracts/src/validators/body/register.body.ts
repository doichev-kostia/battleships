import { Exclude, Expose } from "class-transformer";
import { IsString, Length } from "class-validator";
import { UserBody } from "./user.body";

@Exclude()
export class RegisterBody extends UserBody {
	@Expose()
	@IsString()
	@Length(8, 255)
	public password: string;
}
