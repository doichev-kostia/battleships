import { JsonController, Post } from "routing-controllers";
import { AuthHandler } from "./auth.handler";
import { Body } from "@panenco/papi";
import { LoginBody, UserBody } from "@battleships/contracts/src";

@JsonController("/authentication")
export class AuthController {
	@Post("/login")
	async login(@Body() body: LoginBody) {
		return AuthHandler.login(body);
	}

	@Post("/register")
	async register(@Body() body: UserBody) {
		return AuthHandler.register(body);
	}
}
