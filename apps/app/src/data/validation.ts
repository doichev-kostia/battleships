import { RegisterBody } from "@battleships/contracts";
import { Exclude, Expose } from "class-transformer";
import { Equals } from "class-validator";

@Exclude()
export class SignUpValidationSchema extends RegisterBody {
	@Expose()
	@Equals(RegisterBody.prototype.password)
	public confirmPassword: string;
}
