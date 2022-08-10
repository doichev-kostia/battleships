import { JsonController, Post } from "routing-controllers";
import { AuthHandler } from "./auth.handler";
import { Body } from "@panenco/papi";
import { LoginBody, RegisterBody } from "@battleships/contracts";

@JsonController("/authentication")
export class AuthController {
	@Post("/login")
	async login(@Body() body: LoginBody) {
		return AuthHandler.login(body);
	}

	@Post("/register")
	async register(@Body() body: RegisterBody) {
		return AuthHandler.register(body);
	}
}
