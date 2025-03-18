import { SelectConceptCommand, SelectConceptCommandHandler } from "./select-concept.command";
import { GameBuilder } from "../../../domain/game/game.builder";
import { ConceptBuilder } from "../../../domain/concept/concept.builder";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError, PrerequisiteError } from "../../../domain/errors/game-error.base";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryConceptRepository } from "@/modules/game/infrastructure/persistence/concept/in-memory-concept.repository";

describe("SelectConceptCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const conceptRepository = new InMemoryConceptRepository();
	const handler = new SelectConceptCommandHandler(gameRepository, conceptRepository);

	beforeEach(async () => {
		gameRepository.clear();
		conceptRepository.clear();
	});

	it("should select a concept and adjust budget", async () => {
		// Arrange
		const gameId = uuidv4();
		const conceptId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const initialBudget = 10000;
		const conceptCost = 2500;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withInitialBudget(initialBudget)
			.withCurrentBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const concept = new ConceptBuilder().withId(conceptId).withCost(conceptCost).build();

		gameRepository.setActiveGame(game);
		conceptRepository.setConcept(concept);

		const result = await handler.execute(
			new SelectConceptCommand({
				gameId,
				conceptId,
			}),
		);

		expect(result.currentBudget).toBe(initialBudget - conceptCost);

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedConceptId).toBe(conceptId);
		expect(updatedGame?.currentBudget).toBe(initialBudget - conceptCost);
	});

	it("should throw error if game not found", async () => {
		const gameId = uuidv4();
		const conceptId = uuidv4();

		await expect(
			handler.execute(
				new SelectConceptCommand({
					gameId,
					conceptId,
				}),
			),
		).rejects.toThrow(NotFoundError);
	});

	it("should throw error if brief not selected", async () => {
		const gameId = uuidv4();
		const conceptId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withInitialBudget(10000)
			.withCurrentBudget(10000)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute(
				new SelectConceptCommand({
					gameId,
					conceptId,
				}),
			),
		).rejects.toThrow(PrerequisiteError);
	});

	it("should throw error if venue not selected", async () => {
		const gameId = uuidv4();
		const conceptId = uuidv4();
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
				new SelectConceptCommand({
					gameId,
					conceptId,
				}),
			),
		).rejects.toThrow(PrerequisiteError);
	});

	it("should throw error if concept not found", async () => {
		const gameId = uuidv4();
		const conceptId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withInitialBudget(10000)
			.withCurrentBudget(10000)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute(
				new SelectConceptCommand({
					gameId,
					conceptId,
				}),
			),
		).rejects.toThrow(NotFoundError);
	});
});
