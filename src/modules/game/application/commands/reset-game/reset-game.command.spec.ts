import { v4 as uuidv4 } from "uuid";
import { ResetGameCommandHandler } from "./reset-game.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";

describe("ResetGameCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const handler = new ResetGameCommandHandler(gameRepository);

	beforeEach(() => {
		gameRepository.clear();
	});

	it("should reset a game to its initial state", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const initialBudget = 5000;
		const issueId = uuidv4();
		const optionId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withInitialBudget(initialBudget)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(uuidv4())
			.withSelectedConceptId(uuidv4())
			.withSelectedConstraintId(uuidv4())
			.withSelectedEntertainmentId(uuidv4())
			.withSelectedCateringId(uuidv4())
			.withResolvedIssueIds([issueId])
			.withResolvedIssueOptionIds([optionId])
			.withFinalStrategyType("gambling")
			.withIsCompleted(true)
			.withFinalScore(8000)
			.build();

		gameRepository.setActiveGame(game);

		await handler.execute({
			props: {
				gameId,
			},
		});

		const resetGame = await gameRepository.findById(gameId);
		expect(resetGame).toBeDefined();
		expect(resetGame?.isCompleted).toBe(false);
		expect(resetGame?.finalScore).toBe(null);
		expect(resetGame?.selectedVenueId).toBe(null);
		expect(resetGame?.selectedConceptId).toBe(null);
		expect(resetGame?.selectedConstraintId).toBe(null);
		expect(resetGame?.selectedEntertainmentId).toBe(null);
		expect(resetGame?.selectedCateringId).toBe(null);
		expect(resetGame?.resolvedIssueIds).toEqual([]);
		expect(resetGame?.resolvedIssueOptionIds).toEqual([]);
		expect(resetGame?.finalStrategyType).toBe(null);
		expect(resetGame?.initialBudget).toBe(initialBudget);
		expect(resetGame?.currentBudget).toBe(initialBudget);
	});

	it("should maintain the current budget when resetting", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const initialBudget = 7500;

		const game = new GameBuilder()
			.withId(gameId)
			.withInitialBudget(initialBudget)
			.withSelectedBriefId(briefId)
			.build();

		gameRepository.setActiveGame(game);

		await handler.execute({
			props: { gameId },
		});

		const resetGame = await gameRepository.findById(gameId);
		expect(resetGame).toBeDefined();
		expect(resetGame?.initialBudget).toBe(initialBudget);
		expect(resetGame?.currentBudget).toBe(initialBudget);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();

		await expect(
			handler.execute({
				props: { gameId },
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});
});
