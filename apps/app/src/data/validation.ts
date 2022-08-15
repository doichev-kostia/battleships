import { RegisterBody } from "@battleships/contracts";
import { Exclude, Expose } from "class-transformer";
import { Match } from "./utils/match.decorator";

@Exclude()
export class SignUpValidationSchema extends RegisterBody {
	@Expose()
	@Match("password", {
		message: "Passwords do not match",
	})
	public confirmPassword: string;
}
