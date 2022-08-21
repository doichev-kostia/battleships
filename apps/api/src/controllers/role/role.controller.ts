import { Authorized, Get, JsonController, Param } from "routing-controllers";
import { RoleHandler } from "controllers/role/role.handler";
import { GameRepresentation } from "@battleships/contracts";
import { ListRepresenter, PagingQuery, Query } from "@panenco/papi";

@JsonController("/roles")
export class RoleController {
	@Get("/:roleId")
	@Authorized()
	@ListRepresenter(GameRepresentation)
	public getGames(@Param("roleId") roleId: string, @Query() query: PagingQuery) {
		return RoleHandler.getGames(roleId, query);
	}
}
