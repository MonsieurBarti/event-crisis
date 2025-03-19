import { v4 as uuidv4 } from "uuid";
import { CalculateFinalScoreCommandHandler } from "./calculate-final-score.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { BriefBuilder } from "@/modules/game/domain/brief/brief.builder";
import { VenueBuilder } from "@/modules/game/domain/venue/venue.builder";
import { ConceptBuilder } from "@/modules/game/domain/concept/concept.builder";
import { ConstraintBuilder } from "@/modules/game/domain/constraint/constraint.builder";
import { EntertainmentBuilder } from "@/modules/game/domain/entertainment/entertainment.builder";
import { CateringBuilder } from "@/modules/game/domain/catering/catering.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryBriefRepository } from "@/modules/game/infrastructure/persistence/brief/in-memory-brief.repository";
import { InMemoryVenueRepository } from "@/modules/game/infrastructure/persistence/venue/in-memory-venue.repository";
import { InMemoryConceptRepository } from "@/modules/game/infrastructure/persistence/concept/in-memory-concept.repository";
import { InMemoryConstraintRepository } from "@/modules/game/infrastructure/persistence/constraint/in-memory-constraint.repository";
import { InMemoryEntertainmentRepository } from "@/modules/game/infrastructure/persistence/entertainment/in-memory-entertainment.repository";
import { InMemoryCateringRepository } from "@/modules/game/infrastructure/persistence/catering/in-memory-catering.repository";

describe("CalculateFinalScoreCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const briefRepository = new InMemoryBriefRepository();
	const venueRepository = new InMemoryVenueRepository();
	const conceptRepository = new InMemoryConceptRepository();
	const constraintRepository = new InMemoryConstraintRepository();
	const entertainmentRepository = new InMemoryEntertainmentRepository();
	const cateringRepository = new InMemoryCateringRepository();

	const handler = new CalculateFinalScoreCommandHandler(
		gameRepository,
		briefRepository,
		venueRepository,
		conceptRepository,
		constraintRepository,
		entertainmentRepository,
		cateringRepository,
	);

	beforeEach(() => {
		gameRepository.clear();
		briefRepository.clear();
		venueRepository.clear();
		conceptRepository.clear();
		constraintRepository.clear();
		entertainmentRepository.clear();
		cateringRepository.clear();
	});

	it("should calculate and set the final score for a completed game", async () => {
		// Set up test data
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const constraintId = uuidv4();
		const entertainmentId = uuidv4();
		const cateringId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();

		const initialBudget = 10000;
		const briefBudget = 10000;
		const venueCost = 2000;
		const conceptCost = 3000;
		const entertainmentCost = 1000;
		const cateringCost = 500;
		const constraintCost = 750;
		const optionBudgetImpact = -1000;

		const currentBudget =
			initialBudget -
			venueCost -
			conceptCost -
			entertainmentCost -
			cateringCost -
			constraintCost +
			optionBudgetImpact;

		// Create game with all selections made
		const game = new GameBuilder()
			.withId(gameId)
			.withCurrentBudget(currentBudget)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withSelectedConstraintId(constraintId)
			.withSelectedEntertainmentId(entertainmentId)
			.withSelectedCateringId(cateringId)
			.withResolvedIssueIds([issueId])
			.withResolvedIssueOptionIds([optionId])
			.withFinalStrategyType("GAMBLING")
			.build();

		const brief = new BriefBuilder().withId(briefId).withBudget(briefBudget).build();

		const venue = new VenueBuilder().withId(venueId).withCost(venueCost).build();

		const concept = new ConceptBuilder().withId(conceptId).withCost(conceptCost).build();

		const constraint = new ConstraintBuilder()
			.withId(constraintId)
			.withImpact(4)
			.withCost(constraintCost)
			.build();

		const entertainment = new EntertainmentBuilder()
			.withId(entertainmentId)
			.withCost(entertainmentCost)
			.withImpact(6)
			.build();

		const catering = new CateringBuilder()
			.withId(cateringId)
			.withCost(cateringCost)
			.withImpact(7)
			.build();

		// Save entities to repositories
		gameRepository.setActiveGame(game);
		briefRepository.setBrief(brief);
		venueRepository.setVenue(venue);
		conceptRepository.setConcept(concept);
		constraintRepository.setConstraint(constraint);
		entertainmentRepository.setEntertainment(entertainment);
		cateringRepository.setCatering(catering);

		// Calculate final score
		const score = await handler.execute({
			props: {
				gameId,
			},
		});

		// Verify score calculation and game completion
		const updatedGame = await gameRepository.findById(gameId);
		expect(updatedGame).toBeDefined();
		expect(updatedGame?.isCompleted).toBe(true);
		expect(updatedGame?.finalScore).toBe(score);

		// Score should include various factors and be between 1 and 20
		expect(score).toBeGreaterThan(0);
		expect(score).toBeLessThanOrEqual(20);
	});

	it("should throw error if game is not found", async () => {
		const nonExistentId = uuidv4(); // Using a valid UUID that doesn't exist in the repository

		await expect(
			handler.execute({
				props: {
					gameId: nonExistentId,
				},
			}),
		).rejects.toThrow(`Game with id ${nonExistentId} not found`);
	});

	it("should throw error if required selections are missing", async () => {
		const gameId = uuidv4();
		const game = new GameBuilder().withId(gameId).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: {
					gameId,
				},
			}),
		).rejects.toThrow(
			"Cannot calculate score: Brief, Venue, Concept, Constraint, Entertainment, " +
				"Catering, resolved Issues, and Final Strategy are required",
		);
	});

	it("should throw error if game is already completed", async () => {
		const gameId = uuidv4();
		const game = new GameBuilder()
			.withId(gameId)
			.withIsCompleted(true)
			.withFinalScore(100)
			.withSelectedBriefId(uuidv4())
			.withSelectedVenueId(uuidv4())
			.withSelectedConceptId(uuidv4())
			.withSelectedConstraintId(uuidv4())
			.withSelectedEntertainmentId(uuidv4())
			.withSelectedCateringId(uuidv4())
			.withResolvedIssueIds([uuidv4()])
			.withResolvedIssueOptionIds([uuidv4()])
			.withFinalStrategyType("GAMBLING")
			.build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: {
					gameId,
				},
			}),
		).rejects.toThrow("Game is already completed");
	});
});
