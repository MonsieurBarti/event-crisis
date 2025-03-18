import { v4 as uuidv4 } from "uuid";
import { SelectCateringCommandHandler } from "./select-catering.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { CateringBuilder } from "@/modules/game/domain/catering/catering.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryCateringRepository } from "@/modules/game/infrastructure/persistence/catering/in-memory-catering.repository";

describe("SelectCateringCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const cateringRepository = new InMemoryCateringRepository();
	const handler = new SelectCateringCommandHandler(gameRepository, cateringRepository);

	beforeEach(() => {
		gameRepository.clear();
		cateringRepository.clear();
	});

	it("should select catering and adjust budget", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const initialBudget = 10000;
		const cateringCost = 1500;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const catering = new CateringBuilder().withId(cateringId).withCost(cateringCost).build();

		gameRepository.setActiveGame(game);
		cateringRepository.setCatering(catering);

		await handler.execute({
			props: { gameId, cateringId },
		});

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedCateringId).toBe(cateringId);
		expect(updatedGame?.currentBudget).toBe(initialBudget - cateringCost);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();

		await expect(
			handler.execute({
				props: { gameId, cateringId },
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if brief is not selected", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, cateringId },
			}),
		).rejects.toThrow("A brief must be selected before selecting catering");
	});

	it("should throw error if venue is not selected", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
		const briefId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, cateringId },
			}),
		).rejects.toThrow("A venue must be selected before selecting catering");
	});

	it("should throw error if concept is not selected", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
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
				props: { gameId, cateringId },
			}),
		).rejects.toThrow("A concept must be selected before selecting catering");
	});

	it("should throw error if constraint is not selected", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
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
				props: { gameId, cateringId },
			}),
		).rejects.toThrow("A constraint must be selected before selecting catering");
	});

	it("should throw error if entertainment is not selected", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
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
				props: { gameId, cateringId },
			}),
		).rejects.toThrow("Entertainment must be selected before selecting catering");
	});

	it("should throw error if catering is not found", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();

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
				props: { gameId, cateringId },
			}),
		).rejects.toThrow(`Catering with id ${cateringId} not found`);
	});

	it("should throw error if not enough budget", async () => {
		const gameId = uuidv4();
		const cateringId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const initialBudget = 1000;
		const cateringCost = 1500;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const catering = new CateringBuilder().withId(cateringId).withCost(cateringCost).build();

		gameRepository.setActiveGame(game);
		cateringRepository.setCatering(catering);

		await expect(
			handler.execute({
				props: { gameId, cateringId },
			}),
		).rejects.toThrow(
			`Not enough budget to select this catering. Cost: ${cateringCost}, Available: ${initialBudget}`,
		);
	});
});
