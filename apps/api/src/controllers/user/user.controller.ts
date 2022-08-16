import { Get, JsonController, Param } from "routing-controllers";
import { Representer } from "@panenco/papi";
import { UserRepresentation } from "@battleships/contracts";
import { UserHandler } from "controllers/user/user.handler";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/users")
export class UserController {
	@Get("/:userId")
	@OpenAPI({ summary: "Find a user by id" })
	@Representer(UserRepresentation)
	async get(@Param("userId") userId: string) {
		const res = await UserHandler.get(userId);
		return res;
	}
}
