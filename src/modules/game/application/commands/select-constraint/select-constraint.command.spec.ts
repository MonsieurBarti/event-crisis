import { v4 as uuidv4 } from "uuid";
import { SelectConstraintCommandHandler } from "./select-constraint.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { ConstraintBuilder } from "@/modules/game/domain/constraint/constraint.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryConstraintRepository } from "@/modules/game/infrastructure/persistence/constraint/in-memory-constraint.repository";

describe("SelectConstraintCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const constraintRepository = new InMemoryConstraintRepository();
	const handler = new SelectConstraintCommandHandler(gameRepository, constraintRepository);

	beforeEach(() => {
		gameRepository.clear();
		constraintRepository.clear();
	});

	it("should select a constraint", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const initialBudget = 10000;

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withInitialBudget(initialBudget)
			.withIsCompleted(false)
			.build();

		const constraint = new ConstraintBuilder().withId(constraintId).build();

		gameRepository.setActiveGame(game);
		constraintRepository.setConstraint(constraint);

		await handler.execute({
			props: { gameId, constraintId },
		});

		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.selectedConstraintId).toBe(constraintId);
		expect(updatedGame?.currentBudget).toBe(initialBudget);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();

		await expect(
			handler.execute({
				props: { gameId, constraintId },
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if brief is not selected", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, constraintId },
			}),
		).rejects.toThrow("A brief must be selected before selecting a constraint");
	});

	it("should throw error if venue is not selected", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();
		const briefId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withIsCompleted(false)
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: { gameId, constraintId },
			}),
		).rejects.toThrow("A venue must be selected before selecting a constraint");
	});

	it("should throw error if concept is not selected", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();
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
				props: { gameId, constraintId },
			}),
		).rejects.toThrow("A concept must be selected before selecting a constraint");
	});

	it("should throw error if constraint is not found", async () => {
		const gameId = uuidv4();
		const constraintId = uuidv4();
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
				props: { gameId, constraintId },
			}),
		).rejects.toThrow(`Constraint with id ${constraintId} not found`);
	});
});
