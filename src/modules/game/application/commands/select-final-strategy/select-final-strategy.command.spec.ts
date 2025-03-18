import { v4 as uuidv4 } from "uuid";
import { SelectFinalStrategyCommandHandler, StrategyType } from "./select-final-strategy.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";

describe("SelectFinalStrategyCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const handler = new SelectFinalStrategyCommandHandler(gameRepository);

	beforeEach(() => {
		gameRepository.clear();
	});

	it("should select a final strategy", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const cateringId = uuidv4();
		const issueId = uuidv4();
		const issueOptionId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withSelectedCateringId(cateringId)
			.withResolvedIssueIds([issueId])
			.withResolvedIssueOptionIds([issueOptionId])
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await handler.execute({
			props: { gameId, strategyType },
		});

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.finalStrategyType).toBe(strategyType);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();
		const strategyType: StrategyType = "gambling";

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if brief is not selected", async () => {
		const gameId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("A brief must be selected before selecting a final strategy");
	});

	it("should throw error if venue is not selected", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("A venue must be selected before selecting a final strategy");
	});

	it("should throw error if concept is not selected", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("A concept must be selected before selecting a final strategy");
	});

	it("should throw error if constraint is not selected", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("A constraint must be selected before selecting a final strategy");
	});

	it("should throw error if entertainment is not selected", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("Entertainment must be selected before selecting a final strategy");
	});

	it("should throw error if catering is not selected", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow("Catering must be selected before selecting a final strategy");
	});

	it("should throw error if no issues have been resolved", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const cateringId = uuidv4();
		const strategyType: StrategyType = "gambling";

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withSelectedCateringId(cateringId)
			.withResolvedIssueIds([])
			.withResolvedIssueOptionIds([])
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, strategyType },
			}),
		).rejects.toThrow(
			"At least one unexpected issue must be resolved before selecting a final strategy",
		);
	});
});
