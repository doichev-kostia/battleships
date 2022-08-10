import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

@Exclude()
export class UserBody {
	@Expose()
	@IsString()
	@Length(1, 255)
	public firstName: string;

	@Expose()
	@IsString()
	@Length(1, 255)
	public lastName: string;

	@Expose()
	@IsEmail()
	public email: string;

	@Expose()
	@IsString()
	@Length(1, 255)
	public username: string;

	@Expose()
	@IsPhoneNumber()
	@IsOptional()
	public phoneNumber?: string;
}
