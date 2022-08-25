import { HandlerTestBase } from "tests/utils/handler-test-base";
import { EntityManager } from "@mikro-orm/core";
import { GameHandler } from "controllers/game/game.handler";
import { expect } from "chai";
import { GAME_STATUS } from "@battleships/contracts";
import { createSimpleUUID } from "utils/helpers";

const ships = [
	{
		xStart: 0,
		yStart: 2,
		xEnd: 0,
		yEnd: 4,
	},
];

const shot = {
	playerId: createSimpleUUID(5),
	x: 0,
	y: 0,
};

describe("Handler test", () => {
	describe("Game tests", () => {
		let base: HandlerTestBase;
		let em: EntityManager;
		let gameId: string;
		before(async () => ({ base, em } = await HandlerTestBase.before()));

		beforeEach(async () => {
			await base.beforeEach();
			gameId = (await GameHandler.create()).id;
		});

		it("should create a game", async () => {
			const game = await GameHandler.create();
			expect(game.status).to.equal(GAME_STATUS.PENDING);
		});

		it("should join a game as computer", async () => {
			const gameId = createSimpleUUID(0);
			const game = await GameHandler.join(gameId, { ships });
			expect(game.players.length).to.be.greaterThan(0);
			expect(game.players[0].ships.toArray()).to.be.an("array");
		});

		it("should join a game as user", async () => {
			const userId = createSimpleUUID(0);
			const game = await GameHandler.join(gameId, { userId, ships });
			expect(game.players).to.have.lengthOf(1);
			expect(game.players[0].role.user.id).to.equal(userId);
		});

		it("should start a game", async () => {
			const gameId = createSimpleUUID(0);
			const game = await GameHandler.start(gameId);
			expect(game.status).to.equal(GAME_STATUS.IN_PROGRESS);
		});

		it("should finish a game", async () => {
			const gameId = createSimpleUUID(0);
			const game = await GameHandler.finish(gameId);
			expect(game.status).to.equal(GAME_STATUS.FINISHED);
		});

		it("should register a shot", async () => {
			const gameId = createSimpleUUID(5);
			const game = await GameHandler.shoot(gameId, shot);
			const playerShots = await game.players[0].shots.loadItems();
			expect(playerShots.length).to.be.greaterThan(0);
		});

		it("should get role's finished games", async () => {
			const roleId = createSimpleUUID(9);
			const game = await GameHandler.getFinishedGames(roleId);
			expect(game.length).to.be.greaterThan(0);
		});

		it("should export finished games to a file", async () => {
			const roleId = createSimpleUUID(9);
			const { buffer } = await GameHandler.downloadFinishedGames(roleId);
			const data = JSON.parse(buffer.toString());
			expect(data).to.be.an("array");
		});

		after(() => base.after());
		afterEach(() => base.afterEach());
	});
});
