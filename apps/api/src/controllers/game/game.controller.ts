import { Authorized, Get, JsonController, Param, Patch, Post } from "routing-controllers";
import { Body, ListRepresenter, Representer } from "@panenco/papi";
import { GameRepresentation, JoinGameBody, ShotBody } from "@battleships/contracts";
import { GameHandler } from "controllers/game/game.handler";

@JsonController("/games")
export class GameController {
	@Post("/")
	@Authorized()
	@Representer(GameRepresentation)
	public create() {
		return GameHandler.create();
	}

	@Get("/available/:roleId")
	@Authorized()
	@ListRepresenter(GameRepresentation)
	public getAvailableGames(@Param("roleId") roleId: string) {
		return GameHandler.getAvailableGames(roleId);
	}

	@Get("/finished/:roleId")
	@Authorized()
	@ListRepresenter(GameRepresentation)
	public getFinishedGames(@Param("roleId") roleId: string) {
		return GameHandler.getFinishedGames(roleId);
	}

	// @Get("/finished/:roleId/download")
	// @Authorized()
	// public downloadFinishedGames(@Param("roleId") roleId: string) {
	// 	return GameHandler.downloadFinishedGames(roleId);
	// }

	@Get("/:gameId")
	@Authorized()
	@Representer(GameRepresentation)
	public getById(@Param("gameId") gameId: string) {
		return GameHandler.getById(gameId);
	}

	@Patch("/:gameId/join")
	@Authorized()
	@Representer(GameRepresentation)
	public join(@Param("gameId") gameId: string, @Body() body: JoinGameBody) {
		return GameHandler.join(gameId, body);
	}

	@Patch("/:gameId/start")
	@Authorized()
	@Representer(GameRepresentation)
	public start(@Param("gameId") gameId: string) {
		return GameHandler.start(gameId);
	}

	@Patch("/:gameId/finish")
	@Authorized()
	@Representer(GameRepresentation)
	public finish(@Param("gameId") gameId: string) {
		return GameHandler.finish(gameId);
	}

	@Patch("/:gameId/shoot")
	@Authorized()
	@Representer(GameRepresentation)
	public shoot(@Param("gameId") gameId: string, @Body() body: ShotBody) {
		return GameHandler.shoot(gameId, body);
	}
}
