import { IsEmail, IsString, Length } from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LoginBody {
	@Expose()
	@IsString()
	@IsEmail()
	email: string;

	@Expose()
	@IsString()
	@Length(8)
	password: string;
}
