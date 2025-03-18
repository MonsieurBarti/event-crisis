import { v4 as uuidv4 } from "uuid";
import { InitializeGameCommandHandler } from "./initialize-game.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";

describe("InitializeGameCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const handler = new InitializeGameCommandHandler(gameRepository);

	beforeEach(() => {
		gameRepository.clear();
	});

	it("should initialize a new game when player has no active games", async () => {
		const playerId = uuidv4();
		const initialBudget = 10000;

		const result = await handler.execute({
			props: { playerId, initialBudget },
		});

		expect(await gameRepository.findActiveByPlayerId(playerId)).toBe(result);
		expect(result).toBeDefined();
		expect(result.playerId).toBe(playerId);
		expect(result.currentBudget).toBe(initialBudget);
		expect(result.isCompleted).toBe(false);
	});

	it("should return existing game when player already has an active game", async () => {
		// Arrange
		const playerId = uuidv4();
		const initialBudget = 10000;

		const existingGame = new GameBuilder()
			.withPlayerId(playerId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(existingGame);

		const result = await handler.execute({
			props: { playerId, initialBudget },
		});

		expect(result).toBe(existingGame);
		expect(result.id).toBe(existingGame.id);
	});
});
