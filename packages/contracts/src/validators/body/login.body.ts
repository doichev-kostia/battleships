import { IsEmail, IsString } from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LoginBody {
	@Expose()
	@IsString()
	@IsEmail()
	email: string;

	@Expose()
	@IsString()
	password: string;
}
