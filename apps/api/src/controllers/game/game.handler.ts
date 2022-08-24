import { getEm } from "utils";
import { GAME_STATUS, JoinGameBody, ShotBody } from "@battleships/contracts";
import { Game } from "entities/game.entity";
import { Player } from "entities/player.entity";
import { User } from "entities/user.entity";
import { Shot } from "entities/shot.entity";
import { Ship } from "entities/ship.entity";

export class GameHandler {
	public static getAvailableGames = async (roleId): Promise<[Game[], number]> => {
		const em = getEm();

		const games = await em.find(
			Game,
			{
				status: GAME_STATUS.PENDING,
				players: {
					$and: [
						{
							role: {
								$ne: roleId,
							},
						},
					],
				},
			},
			{ populate: ["players.role.user"] },
		);

		const filtered = games.filter((game) => game.players.length < 2);

		return [filtered, filtered.length];
	};

	public static getFinishedGames = async (roleId: string): Promise<[Game[], number]> => {
		const em = getEm();

		const games = await em.find(
			Game,
			{
				status: GAME_STATUS.FINISHED,
				players: {
					$and: [
						{
							role: {
								$eq: roleId,
							},
						},
					],
				},
			},
			{ populate: ["players.role.user"] },
		);

		return [games, games.length];
	};

	// public downloadFinishedGames = async (roleId: string) => {
	// 	const [games, count] = GameHandler.getFinishedGames(roleId);
	// };

	public static create = async () => {
		const em = getEm();

		const game = em.create(Game, {});
		await em.persistAndFlush(game);
		return game;
	};

	public static getById = async (gameId: string) => {
		const em = getEm();
		const game = await em.findOneOrFail(Game, gameId, {
			populate: ["players.role", "players.ships", "players.shots"],
		});
		return game;
	};

	public static join = async (gameId: string, { userId, ships }: JoinGameBody) => {
		const em = getEm();

		const game = await em.findOneOrFail(Game, gameId, { populate: ["players"] });

		// In case the computer is playing, the userId is not required
		let role = null;
		if (userId) {
			const user = await em.findOneOrFail(User, userId, { populate: ["roles"] });
			role = user.roles[0];
		}
		const player = await em.create(Player, {
			role,
			game,
		});

		await em.persist(player);

		const shipEntities = await Promise.all(
			ships.map(async ({ xStart, yStart, xEnd, yEnd }) => {
				const ship = await em.create(Ship, {
					player,
					xStart,
					yStart,
					xEnd,
					yEnd,
				});

				player.ships.add(ship);
				return ship;
			}),
		);

		game.players.add(player);
		await em.persistAndFlush([game, player, ...shipEntities]);
		return game;
	};

	public static start = async (gameId: string) => {
		const em = getEm();

		const game = await em.findOneOrFail(Game, gameId);
		game.status = GAME_STATUS.IN_PROGRESS;
		await em.persistAndFlush(game);
		return game;
	};

	public static finish = async (gameId: string) => {
		const em = getEm();

		const game = await em.findOneOrFail(Game, gameId);
		game.status = GAME_STATUS.FINISHED;
		await em.persistAndFlush(game);
		return game;
	};

	public static shoot = async (gameId: string, { playerId, x, y }: ShotBody) => {
		const em = getEm();

		const game = await em.findOneOrFail(Game, gameId, { populate: ["players"] });
		const player = await em.findOneOrFail(Player, playerId, { populate: ["shots"] });
		const shot = await em.create(Shot, {
			x,
			y,
			player,
		});

		player.shots.add(shot);

		await em.persistAndFlush([game, player, shot]);
		return game;
	};
}
