import { v4 as uuidv4 } from "uuid";
import { SelectEntertainmentCommandHandler } from "./select-entertainment.command";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { EntertainmentRepository } from "@/modules/game/domain/entertainment/entertainment.repository";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { EntertainmentBuilder } from "@/modules/game/domain/entertainment/entertainment.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryEntertainmentRepository } from "@/modules/game/infrastructure/persistence/entertainment/in-memory-entertainment.repository";

describe("SelectEntertainmentCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const entertainmentRepository = new InMemoryEntertainmentRepository();
	const handler = new SelectEntertainmentCommandHandler(gameRepository, entertainmentRepository);

	beforeEach(() => {
		gameRepository.clear();
		entertainmentRepository.clear();
	});

	it("should select entertainment and adjust budget", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const initialBudget = 10000;
		const entertainmentCost = 2000;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const entertainment = new EntertainmentBuilder()
			.withId(entertainmentId)
			.withCost(entertainmentCost)
			.build();

		gameRepository.setActiveGame(game);
		entertainmentRepository.setEntertainment(entertainment);

		await handler.execute({
			props: { gameId, entertainmentId },
		});

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedEntertainmentId).toBe(entertainmentId);
		expect(updatedGame?.currentBudget).toBe(initialBudget - entertainmentCost);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();

		await expect(
			handler.execute({
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if brief is not selected", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow("A brief must be selected before selecting entertainment");
	});

	it("should throw error if venue is not selected", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow("A venue must be selected before selecting entertainment");
	});

	it("should throw error if concept is not selected", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow("A concept must be selected before selecting entertainment");
	});

	it("should throw error if constraint is not selected", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();

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
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow("A constraint must be selected before selecting entertainment");
	});

	it("should throw error if entertainment is not found", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();

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
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow(`Entertainment with id ${entertainmentId} not found`);
	});

	it("should throw error if not enough budget", async () => {
		const gameId = uuidv4();
		const entertainmentId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const initialBudget = 1000;
		const entertainmentCost = 2000;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const entertainment = new EntertainmentBuilder()
			.withId(entertainmentId)
			.withCost(entertainmentCost)
			.build();

		gameRepository.setActiveGame(game);
		entertainmentRepository.setEntertainment(entertainment);

		await expect(
			handler.execute({
				props: { gameId, entertainmentId },
			}),
		).rejects.toThrow(
			`Not enough budget to select this entertainment. Cost: ${entertainmentCost}, Available: ${initialBudget}`,
		);
	});
});
