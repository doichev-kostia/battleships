import { JsonController, Post, Res } from "routing-controllers";
import { Body, Representer } from "@panenco/papi";
import { Response } from "express";
import { LoginBody, RegisterBody, UserRepresentation } from "@battleships/contracts";
import { AuthHandler } from "./auth.handler";

@JsonController("/authentication")
export class AuthController {
	@Post("/login")
	@Representer(UserRepresentation)
	async login(@Body() body: LoginBody, @Res() res: Response) {
		const { jwtAccessToken, refreshToken, user } = await AuthHandler.login(body);
		this.setTokens(res, jwtAccessToken.token, refreshToken.value);
		return user;
	}

	@Post("/register")
	@Representer(UserRepresentation)
	async register(@Body() body: RegisterBody, @Res() res: Response) {
		const { jwtAccessToken, refreshToken, user } = await AuthHandler.register(body);
		this.setTokens(res, jwtAccessToken.token, refreshToken.value);
		return user;
	}

	private setTokens(res: Response, jwtAccessToken: string, refreshToken: string) {
		res.header("x-auth", jwtAccessToken);
		res.header("x-refresh-token", refreshToken);
	}
}
