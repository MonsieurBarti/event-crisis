import { v4 as uuidv4 } from "uuid";
import { SelectBriefCommandHandler } from "./select-brief.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { BriefBuilder } from "@/modules/game/domain/brief/brief.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryBriefRepository } from "@/modules/game/infrastructure/persistence/brief/in-memory-brief.repository";

describe("SelectBriefCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const briefRepository = new InMemoryBriefRepository();
	const handler = new SelectBriefCommandHandler(gameRepository, briefRepository);

	beforeEach(async () => {
		gameRepository.clear();
		briefRepository.clear();
	});

	it("should select a brief and adjust budget", async () => {
		// Arrange
		const gameId = uuidv4();
		const briefId = uuidv4();
		const initialBudget = 0;
		const briefBudget = 10000;

		const game = new GameBuilder()
			.withId(gameId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const brief = new BriefBuilder().withId(briefId).withBudget(briefBudget).build();

		gameRepository.setActiveGame(game);
		briefRepository.setBrief(brief);

		// Act
		await handler.execute({
			props: {
				gameId,
				briefId,
			},
		});

		// Assert
		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedBriefId).toBe(briefId);
		expect(updatedGame?.currentBudget).toBe(briefBudget);
	});

	it("should throw error if game is not found", async () => {
		// Arrange
		const gameId = uuidv4();
		const briefId = uuidv4();

		// Act & Assert
		await expect(
			handler.execute({
				props: {
					gameId,
					briefId,
				},
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if brief is not found", async () => {
		// Arrange
		const gameId = uuidv4();
		const briefId = uuidv4();

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		// Act & Assert
		await expect(
			handler.execute({
				props: {
					gameId,
					briefId,
				},
			}),
		).rejects.toThrow(`Brief with id ${briefId} not found`);
	});

	it("should throw error if brief already selected", async () => {
		// Arrange
		const gameId = uuidv4();
		const briefId = uuidv4();
		const initialBudget = 0;
		const briefBudget = 10000;

		const game = new GameBuilder()
			.withId(gameId)
			.withCurrentBudget(initialBudget)
			.withSelectedBriefId(uuidv4()) // Already has a brief selected
			.withIsCompleted(false)
			.build();

		const brief = new BriefBuilder().withId(briefId).withBudget(briefBudget).build();

		gameRepository.setActiveGame(game);
		briefRepository.setBrief(brief);

		// Act & Assert
		await expect(
			handler.execute({
				props: {
					gameId,
					briefId,
				},
			}),
		).rejects.toThrow("Brief already selected");
	});
});
