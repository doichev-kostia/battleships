import { JsonController, Post, Req, Res } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Body } from "@panenco/papi";
import { Request, Response } from "express";
import { TokenBody } from "@battleships/contracts";
import { TokenHandler } from "controllers/token/token.handler";

@JsonController("/tokens")
class TokenController {
	@Post("/refresh")
	@OpenAPI({ summary: "Refresh the access token" })
	async refresh(@Body() body: TokenBody, @Req() request: Request, @Res() response: Response) {
		const refreshToken = request.header("x-refresh-token");
		const accessToken = await TokenHandler.refreshAccessToken(
			refreshToken,
			body.userId,
			body.roleType,
		);
		response.header("x-auth", accessToken.token);
	}
}
