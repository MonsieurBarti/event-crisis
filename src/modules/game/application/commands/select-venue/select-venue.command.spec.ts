import { SelectVenueCommand, SelectVenueCommandHandler } from "./select-venue.command";
import { GameBuilder } from "../../../domain/game/game.builder";
import { VenueBuilder } from "../../../domain/venue/venue.builder";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError, PrerequisiteError } from "../../../domain/errors/game-error.base";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryVenueRepository } from "@/modules/game/infrastructure/persistence/venue/in-memory-venue.repository";

describe("SelectVenueCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const venueRepository = new InMemoryVenueRepository();
	const handler = new SelectVenueCommandHandler(gameRepository, venueRepository);

	beforeEach(async () => {
		gameRepository.clear();
		venueRepository.clear();
	});

	it("should select a venue and adjust budget", async () => {
		const gameId = uuidv4();
		const venueId = uuidv4();
		const briefId = uuidv4();
		const initialBudget = 10000;
		const venueCost = 3000;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withInitialBudget(initialBudget)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const venue = new VenueBuilder().withId(venueId).withCost(venueCost).build();

		gameRepository.setActiveGame(game);
		venueRepository.setVenue(venue);

		const result = await handler.execute(
			new SelectVenueCommand({
				gameId,
				venueId,
			}),
		);

		expect(result.currentBudget).toBe(initialBudget - venueCost);

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedVenueId).toBe(venueId);
		expect(updatedGame?.currentBudget).toBe(initialBudget - venueCost);
	});

	it("should throw error if game not found", async () => {
		const gameId = uuidv4();
		const venueId = uuidv4();

		await expect(
			handler.execute(
				new SelectVenueCommand({
					gameId,
					venueId,
				}),
			),
		).rejects.toThrow(NotFoundError);
	});

	it("should throw error if brief not selected", async () => {
		const gameId = uuidv4();
		const venueId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withInitialBudget(10000)
			.withCurrentBudget(10000)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute(
				new SelectVenueCommand({
					gameId,
					venueId,
				}),
			),
		).rejects.toThrow(PrerequisiteError);
	});

	it("should throw error if venue not found", async () => {
		const gameId = uuidv4();
		const venueId = uuidv4();
		const briefId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withInitialBudget(10000)
			.withCurrentBudget(10000)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute(
				new SelectVenueCommand({
					gameId,
					venueId,
				}),
			),
		).rejects.toThrow(NotFoundError);
	});
});
