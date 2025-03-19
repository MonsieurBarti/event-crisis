import {
	CalculateFinalScoreCommand,
	CalculateFinalScoreCommandHandler,
} from "./calculate-final-score/calculate-final-score.command";
import { v4 as uuidv4 } from "uuid";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryBriefRepository } from "@/modules/game/infrastructure/persistence/brief/in-memory-brief.repository";
import { InMemoryVenueRepository } from "@/modules/game/infrastructure/persistence/venue/in-memory-venue.repository";
import { InMemoryConceptRepository } from "@/modules/game/infrastructure/persistence/concept/in-memory-concept.repository";
import { InMemoryConstraintRepository } from "@/modules/game/infrastructure/persistence/constraint/in-memory-constraint.repository";
import { InMemoryCateringRepository } from "../../infrastructure/persistence/catering/in-memory-catering.repository";
import { InMemoryEntertainmentRepository } from "../../infrastructure/persistence/entertainment/in-memory-entertainment.repository";
import { InMemoryUnexpectedIssueRepository } from "../../infrastructure/persistence/unexpected-issue/in-memory-unexpected-issue.repository";
import {
	InitializeGameCommand,
	InitializeGameCommandHandler,
} from "./initialize-game/initialize-game.command";
import {
	ResolveUnexpectedIssueCommand,
	ResolveUnexpectedIssueCommandHandler,
} from "./resolve-unexpected-issue/resolve-unexpected-issue.command";
import { SelectBriefCommand, SelectBriefCommandHandler } from "./select-brief/select-brief.command";
import {
	SelectCateringCommand,
	SelectCateringCommandHandler,
} from "./select-catering/select-catering.command";
import {
	SelectConceptCommand,
	SelectConceptCommandHandler,
} from "./select-concept/select-concept.command";
import {
	SelectConstraintCommand,
	SelectConstraintCommandHandler,
} from "./select-constraint/select-constraint.command";
import {
	SelectEntertainmentCommand,
	SelectEntertainmentCommandHandler,
} from "./select-entertainment/select-entertainment.command";
import { SelectVenueCommand, SelectVenueCommandHandler } from "./select-venue/select-venue.command";
import {
	SelectFinalStrategyCommand,
	SelectFinalStrategyCommandHandler,
} from "./select-final-strategy/select-final-strategy.command";
import { BriefBuilder } from "@/modules/game/domain/brief/brief.builder";
import { VenueBuilder } from "@/modules/game/domain/venue/venue.builder";
import { ConceptBuilder } from "@/modules/game/domain/concept/concept.builder";
import { ConstraintBuilder } from "@/modules/game/domain/constraint/constraint.builder";
import { CateringBuilder } from "@/modules/game/domain/catering/catering.builder";
import { EntertainmentBuilder } from "@/modules/game/domain/entertainment/entertainment.builder";
import {
	UnexpectedIssueBuilder,
	UnexpectedIssueOptionBuilder,
} from "@/modules/game/domain/unexpected-issue/unexpected-issue.builder";
import { FinalStrategyType } from "@/modules/game/domain/game/game";
import { InsufficientBudgetError } from "../../domain/errors/game-error.base";

describe("Game Flow Tests", () => {
	const briefRepository = new InMemoryBriefRepository();
	const cateringRepository = new InMemoryCateringRepository();
	const conceptRepository = new InMemoryConceptRepository();
	const constraintRepository = new InMemoryConstraintRepository();
	const entertainmentRepository = new InMemoryEntertainmentRepository();
	const gameRepository = new InMemoryGameRepository();
	const unexpectedIssueRepository = new InMemoryUnexpectedIssueRepository();
	const venueRepository = new InMemoryVenueRepository();

	const calculateFinalScoreCommandHandler = new CalculateFinalScoreCommandHandler(
		gameRepository,
		briefRepository,
		venueRepository,
		conceptRepository,
		constraintRepository,
	);
	const initializeGameCommandHandler = new InitializeGameCommandHandler(gameRepository);
	const resolveUnexpectedIssueCommandHandler = new ResolveUnexpectedIssueCommandHandler(
		gameRepository,
		unexpectedIssueRepository,
	);
	const selectBriefCommandHandler = new SelectBriefCommandHandler(
		gameRepository,
		briefRepository,
	);
	const selectCateringCommandHandler = new SelectCateringCommandHandler(
		gameRepository,
		cateringRepository,
	);
	const selectConceptCommandHandler = new SelectConceptCommandHandler(
		gameRepository,
		conceptRepository,
	);
	const selectConstraintCommandHandler = new SelectConstraintCommandHandler(
		gameRepository,
		constraintRepository,
	);
	const selectEntertainmentCommandHandler = new SelectEntertainmentCommandHandler(
		gameRepository,
		entertainmentRepository,
	);
	const selectFinalStrategyCommandHandler = new SelectFinalStrategyCommandHandler(gameRepository);
	const selectVenueCommandHandler = new SelectVenueCommandHandler(
		gameRepository,
		venueRepository,
	);

	beforeEach(() => {
		briefRepository.clear();
		cateringRepository.clear();
		conceptRepository.clear();
		constraintRepository.clear();
		entertainmentRepository.clear();
		gameRepository.clear();
		unexpectedIssueRepository.clear();
		venueRepository.clear();

		// Setup test data
		const briefs = [
			new BriefBuilder().withName("Luxury product launch").withBudget(50000).build(),
			new BriefBuilder().withName("AI conference").withBudget(40000).build(),
			new BriefBuilder().withName("Arts festival").withBudget(35000).build(),
		];
		briefs.forEach((brief) => briefRepository.save(brief));

		const venues = [
			new VenueBuilder().withName("Historic castle").withCost(10000).build(),
			new VenueBuilder().withName("Rooftop with a view").withCost(8000).build(),
			new VenueBuilder().withName("Design coworking space").withCost(6000).build(),
			new VenueBuilder().withName("Overprice manor").withCost(100000).build(),
		];
		venues.forEach((venue) => venueRepository.save(venue));

		const concepts = [
			new ConceptBuilder()

				.withName("Immersive experience and storytelling")
				.withCost(5000)
				.build(),
			new ConceptBuilder().withName("Technology and innovation").withCost(4000).build(),
			new ConceptBuilder().withName("Networking and debates").withCost(3000).build(),
		];
		concepts.forEach((concept) => conceptRepository.save(concept));

		const constraints = [
			new ConstraintBuilder().withName("The event must be 100% eco-responsible").build(),
			new ConstraintBuilder()

				.withName("It must be organized in a historical location")
				.build(),
			new ConstraintBuilder().withName("Live broadcasting is mandatory").build(),
		];
		constraints.forEach((constraint) => constraintRepository.save(constraint));

		const caterings = [
			new CateringBuilder().withName("Premium seated dinner").withCost(10000).build(),
			new CateringBuilder().withName("Gourmet buffet").build(),
			new CateringBuilder().withName("Molecular cocktail bar").build(),
		];
		caterings.forEach((catering) => cateringRepository.save(catering));

		const entertainments = [
			new EntertainmentBuilder().withName("Interactive holograms").withCost(8000).build(),
			new EntertainmentBuilder().withName("VR experience").withCost(6000).build(),
			new EntertainmentBuilder().withName("Contemporary dance show").withCost(4000).build(),
		];
		entertainments.forEach((entertainment) => entertainmentRepository.save(entertainment));

		const unexpectedIssues = [
			new UnexpectedIssueBuilder()

				.withName("Caterer cancels 24 hours before")
				.withDescription("Your catering service has canceled with short notice")
				.withOptions([
					new UnexpectedIssueOptionBuilder()

						.withName("Find last-minute replacement")
						.withDescription("Increase catering cost by 2k")
						.withBudgetImpact(-2000)
						.build(),
				])
				.build(),
			new UnexpectedIssueBuilder()

				.withName("Equipment delivery delay")
				.withDescription("Critical equipment won't arrive on time")
				.withOptions([
					new UnexpectedIssueOptionBuilder()

						.withName("Rush delivery fee")
						.withDescription("Pay extra for expedited shipping")
						.withBudgetImpact(-2000) // €2,000 immediate cost
						.build(),
				])
				.build(),
			new UnexpectedIssueBuilder()

				.withName("Difficult weather")
				.withDescription("A storm is predicted for your event day")
				.withOptions([
					new UnexpectedIssueOptionBuilder()

						.withName("Add weather contingency")
						.withDescription("Set up tents and heaters")
						.withBudgetImpact(-3000) // €3,000 immediate cost
						.build(),
				])
				.build(),
		];
		unexpectedIssues.forEach((issue) => unexpectedIssueRepository.save(issue));
	});

	it("Should process a game flow successfully in best case scenario", async () => {
		// Step 1: Initialize a new game
		const playerId = uuidv4();
		const initialBudget = 100000;
		const initGameCommand = new InitializeGameCommand({
			playerId,
			initialBudget,
		});
		const game = await initializeGameCommandHandler.execute(initGameCommand);
		const gameId = game.id;

		expect(game.playerId).toBe(playerId);
		expect(game.initialBudget).toBe(initialBudget);
		expect(game.currentBudget).toBe(initialBudget);

		// Step 2: User selects a brief
		const briefs = await briefRepository.findAll();
		const selectedBrief = briefs[0];
		const briefCommand = new SelectBriefCommand({
			gameId,
			briefId: selectedBrief.id, // Luxury product launch
		});
		await selectBriefCommandHandler.execute(briefCommand);

		// Verify brief selection
		expect(game.selectedBriefId).toBe(selectedBrief.id);
		expect(game.currentBudget).toBe(50000); // Brief budget

		// Step 3: User selects a venue
		const venues = await venueRepository.findAll();
		const selectedVenue = venues[0];
		const venueCommand = new SelectVenueCommand({
			gameId,
			venueId: selectedVenue.id, // Historic castle
		});
		await selectVenueCommandHandler.execute(venueCommand);

		// Verify venue selection and budget update
		expect(game.selectedVenueId).toBe(selectedVenue.id);
		expect(game.currentBudget).toBe(40000); // 50000 - 10000

		// Step 4: User selects a concept
		const concepts = await conceptRepository.findAll();
		const selectedConcept = concepts[0];
		const conceptCommand = new SelectConceptCommand({
			gameId,
			conceptId: selectedConcept.id, // Immersive experience
		});
		await selectConceptCommandHandler.execute(conceptCommand);

		// Verify concept selection and budget update
		expect(game.selectedConceptId).toBe(selectedConcept.id);
		expect(game.currentBudget).toBe(35000); // 40000 - 5000

		// Step 5: User selects a constraint
		const constraints = await constraintRepository.findAll();
		const selectedConstraint = constraints[0];
		const constraintCommand = new SelectConstraintCommand({
			gameId,
			constraintId: selectedConstraint.id, // 100% eco-responsible
		});
		await selectConstraintCommandHandler.execute(constraintCommand);

		// Verify constraint selection
		expect(game.selectedConstraintId).toBe(selectedConstraint.id);

		// Step 6: User encounters and resolves first unexpected issue
		const issues = await unexpectedIssueRepository.findAll();
		const selectedIssue = issues[0];
		const issue1Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: selectedIssue.id, // Caterer cancellation
			optionId: selectedIssue.options[0].id, // Catering +2k cost
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue1Command);

		// Verify issue resolution and budget impact
		expect(game.resolvedIssueIds).toContain(selectedIssue.id);
		expect(game.currentBudget).toBe(33000); // 35000 - 2000

		// Step 7: User selects entertainment
		const entertainments = await entertainmentRepository.findAll();
		const selectedEntertainment = entertainments[0];
		const entertainmentCommand = new SelectEntertainmentCommand({
			gameId,
			entertainmentId: selectedEntertainment.id, // Interactive holograms
		});

		await selectEntertainmentCommandHandler.execute(entertainmentCommand);

		// Verify entertainment selection and budget update
		expect(game.selectedEntertainmentId).toBe(selectedEntertainment.id);
		expect(game.currentBudget).toBe(25000); // 33000 - 8000

		// Step 8: User encounters and resolves second unexpected issue
		const selectedIssue2 = issues[1];
		const issue2Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: selectedIssue2.id, // Equipment delay
			optionId: selectedIssue2.options[0].id, // Add €2,000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue2Command);

		// Verify issue resolution and budget impact
		expect(game.resolvedIssueIds).toContain(selectedIssue2.id);
		expect(game.currentBudget).toBe(23000); // 25000 - 2000

		// Step 9: User selects catering
		const caterings = await cateringRepository.findAll();
		const selectedCatering = caterings[0];
		const cateringCommand = new SelectCateringCommand({
			gameId,
			cateringId: selectedCatering.id, // Premium seated dinner
		});
		await selectCateringCommandHandler.execute(cateringCommand);

		// Verify catering selection and budget update
		expect(game.selectedCateringId).toBe(selectedCatering.id);
		expect(game.currentBudget).toBe(13000); // 23000 - 10000

		// Step 10: User encounters and resolves third unexpected issue
		const issue3 = issues[2];
		const issue3Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: issue3.id, // Difficult weather
			optionId: issue3.options[0].id, // Add €3,000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue3Command);

		// Verify issue resolution and budget impact
		expect(game.resolvedIssueIds).toContain(issue3.id);
		expect(game.currentBudget).toBe(10000); // 13000 - 3000

		// Step 11: User selects final strategy
		const strategyCommand = new SelectFinalStrategyCommand({
			gameId,
			strategyType: FinalStrategyType.MARKETING,
		});
		await selectFinalStrategyCommandHandler.execute(strategyCommand);

		// Verify strategy selection
		expect(game.finalStrategyType).toBe(FinalStrategyType.MARKETING);

		// Step 12: Calculate final score
		const scoreCommand = new CalculateFinalScoreCommand({
			gameId,
		});
		const finalScore = await calculateFinalScoreCommandHandler.execute(scoreCommand);

		// Verify final score calculation
		expect(finalScore).toBeGreaterThan(0);
		expect(finalScore).toBeLessThanOrEqual(20);

		// Verify final game state
		const retrievedGame = await gameRepository.findById(gameId);
		expect(retrievedGame?.finalScore).toBe(finalScore);
		expect(retrievedGame?.complete).toBeTruthy();
	});

	it("Should handle a challenging scenario with minimal remaining budget", async () => {
		// Step 1: Initialize a new game with smaller budget
		const playerId = uuidv4();
		const initialBudget = 70000;
		const initGameCommand = new InitializeGameCommand({
			playerId,
			initialBudget,
		});
		const game = await initializeGameCommandHandler.execute(initGameCommand);
		const gameId = game.id;

		// Step 2: User selects a brief
		const briefs = await briefRepository.findAll();
		const selectedBrief = briefs[2]; // Arts festival (35000 budget)
		const briefCommand = new SelectBriefCommand({
			gameId,
			briefId: selectedBrief.id,
		});
		await selectBriefCommandHandler.execute(briefCommand);

		// Verify brief selection and budget update
		expect(game.selectedBriefId).toBe(selectedBrief.id);
		expect(game.currentBudget).toBe(35000); // Brief budget

		// Step 3: User selects the most expensive venue
		const venues = await venueRepository.findAll();
		const selectedVenue = venues[0]; // Historic castle (10000)
		const venueCommand = new SelectVenueCommand({
			gameId,
			venueId: selectedVenue.id,
		});
		await selectVenueCommandHandler.execute(venueCommand);

		// Verify venue selection and budget update
		expect(game.selectedVenueId).toBe(selectedVenue.id);
		expect(game.currentBudget).toBe(25000); // 35000 - 10000

		// Step 4: User selects the most expensive concept
		const concepts = await conceptRepository.findAll();
		const selectedConcept = concepts[0]; // Immersive experience (5000)
		const conceptCommand = new SelectConceptCommand({
			gameId,
			conceptId: selectedConcept.id,
		});
		await selectConceptCommandHandler.execute(conceptCommand);

		// Verify concept selection and budget update
		expect(game.selectedConceptId).toBe(selectedConcept.id);
		expect(game.currentBudget).toBe(20000); // 25000 - 5000

		// Step 5: User selects a constraint
		const constraints = await constraintRepository.findAll();
		const selectedConstraint = constraints[0];
		const constraintCommand = new SelectConstraintCommand({
			gameId,
			constraintId: selectedConstraint.id,
		});
		await selectConstraintCommandHandler.execute(constraintCommand);

		// Verify constraint selection
		expect(game.selectedConstraintId).toBe(selectedConstraint.id);

		// Step 6: User encounters all unexpected issues in a row
		// First issue
		const issues = await unexpectedIssueRepository.findAll();
		const issue1Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: issues[0].id,
			optionId: issues[0].options[0].id, // -2000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue1Command);
		expect(game.currentBudget).toBe(18000); // 20000 - 2000

		// Second issue
		const issue2Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: issues[1].id,
			optionId: issues[1].options[0].id, // -2000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue2Command);
		expect(game.currentBudget).toBe(16000); // 18000 - 2000

		// Third issue
		const issue3Command = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: issues[2].id,
			optionId: issues[2].options[0].id, // -3000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issue3Command);
		expect(game.currentBudget).toBe(13000); // 16000 - 3000

		// Step 7: User selects expensive entertainment
		const entertainments = await entertainmentRepository.findAll();
		const selectedEntertainment = entertainments[0]; // Interactive holograms (8000)
		const entertainmentCommand = new SelectEntertainmentCommand({
			gameId,
			entertainmentId: selectedEntertainment.id,
		});
		await selectEntertainmentCommandHandler.execute(entertainmentCommand);
		expect(game.currentBudget).toBe(5000); // 13000 - 8000

		// Step 8: User selects a less expensive catering (can't afford premium seated dinner)
		const caterings = await cateringRepository.findAll();
		// We'll use a catering option that doesn't have a specified cost since Premium seated dinner costs 10000
		// which exceeds our 5000 budget
		const selectedCatering = caterings[1]; // Gourmet buffet
		const cateringCommand = new SelectCateringCommand({
			gameId,
			cateringId: selectedCatering.id,
		});
		await selectCateringCommandHandler.execute(cateringCommand);

		// Verify catering selection and budget update
		expect(game.selectedCateringId).toBe(selectedCatering.id);
		// Since we don't know the exact cost, we'll just verify it's less than our previous amount
		expect(game.currentBudget).toBeLessThan(5000);

		// Step 9: User selects GAMBLING strategy to try to maximize score despite the low budget
		const strategyCommand = new SelectFinalStrategyCommand({
			gameId,
			strategyType: FinalStrategyType.GAMBLING,
		});
		await selectFinalStrategyCommandHandler.execute(strategyCommand);
		expect(game.finalStrategyType).toBe(FinalStrategyType.GAMBLING);

		// Step 10: Calculate final score
		const scoreCommand = new CalculateFinalScoreCommand({
			gameId,
		});
		const finalScore = await calculateFinalScoreCommandHandler.execute(scoreCommand);

		// Verify that even with negative budget, the score is still within the 1-20 range
		expect(finalScore).toBeGreaterThanOrEqual(1);
		expect(finalScore).toBeLessThanOrEqual(20);
		// Should be on the lower end due to negative budget
		expect(finalScore).toBeLessThan(10);
	});

	it("Should maximize score with PROFITABILITY strategy when keeping high budget", async () => {
		// Step 1: Initialize a new game
		const playerId = uuidv4();
		const initialBudget = 100000;
		const initGameCommand = new InitializeGameCommand({
			playerId,
			initialBudget,
		});
		const game = await initializeGameCommandHandler.execute(initGameCommand);
		const gameId = game.id;

		// Step 2: User selects a brief with higher budget
		const briefs = await briefRepository.findAll();
		const selectedBrief = briefs[0]; // Luxury product launch (50000)
		const briefCommand = new SelectBriefCommand({
			gameId,
			briefId: selectedBrief.id,
		});
		await selectBriefCommandHandler.execute(briefCommand);
		expect(game.currentBudget).toBe(50000);

		// Step 3: User selects the most affordable venue
		const venues = await venueRepository.findAll();
		const selectedVenue = venues[2]; // Design coworking space (6000)
		const venueCommand = new SelectVenueCommand({
			gameId,
			venueId: selectedVenue.id,
		});
		await selectVenueCommandHandler.execute(venueCommand);
		expect(game.currentBudget).toBe(44000); // 50000 - 6000

		// Step 4: User selects the most affordable concept
		const concepts = await conceptRepository.findAll();
		const selectedConcept = concepts[2]; // Networking and debates (3000)
		const conceptCommand = new SelectConceptCommand({
			gameId,
			conceptId: selectedConcept.id,
		});
		await selectConceptCommandHandler.execute(conceptCommand);
		expect(game.currentBudget).toBe(41000); // 44000 - 3000

		// Step 5: User selects a constraint
		const constraints = await constraintRepository.findAll();
		const selectedConstraint = constraints[2]; // Live broadcasting
		const constraintCommand = new SelectConstraintCommand({
			gameId,
			constraintId: selectedConstraint.id,
		});
		await selectConstraintCommandHandler.execute(constraintCommand);

		// Step 6: User resolves an unexpected issue
		const issues = await unexpectedIssueRepository.findAll();
		const issueCommand = new ResolveUnexpectedIssueCommand({
			gameId,
			issueId: issues[1].id, // Equipment delay
			optionId: issues[1].options[0].id, // -2000
		});
		await resolveUnexpectedIssueCommandHandler.execute(issueCommand);
		expect(game.currentBudget).toBe(39000); // 41000 - 2000

		// Step 7: User selects affordable entertainment
		const entertainments = await entertainmentRepository.findAll();
		const selectedEntertainment = entertainments[2]; // Contemporary dance show (4000)
		const entertainmentCommand = new SelectEntertainmentCommand({
			gameId,
			entertainmentId: selectedEntertainment.id,
		});
		await selectEntertainmentCommandHandler.execute(entertainmentCommand);
		expect(game.currentBudget).toBe(35000); // 39000 - 4000

		// Step 8: User selects mid-tier catering
		const caterings = await cateringRepository.findAll();
		const selectedCatering = caterings[1]; // Gourmet buffet (cost not specified)
		const cateringCommand = new SelectCateringCommand({
			gameId,
			cateringId: selectedCatering.id,
		});
		await selectCateringCommandHandler.execute(cateringCommand);

		expect(game.currentBudget).toBeGreaterThan(30000); // Gourmet buffet has some cost

		const strategyCommand = new SelectFinalStrategyCommand({
			gameId,
			strategyType: FinalStrategyType.PROFITABILITY,
		});
		await selectFinalStrategyCommandHandler.execute(strategyCommand);
		expect(game.finalStrategyType).toBe(FinalStrategyType.PROFITABILITY);

		const scoreCommand = new CalculateFinalScoreCommand({
			gameId,
		});
		const finalScore = await calculateFinalScoreCommandHandler.execute(scoreCommand);

		expect(finalScore).toBeGreaterThanOrEqual(1);
		expect(finalScore).toBeLessThanOrEqual(20);
		expect(finalScore).toBeGreaterThanOrEqual(8);
	});

	it("Should not be possible to select an item that exceeds budget", async () => {
		// Step 1: Initialize a new game
		const playerId = uuidv4();
		const initialBudget = 10000;
		const initGameCommand = new InitializeGameCommand({
			playerId,
			initialBudget,
		});
		const game = await initializeGameCommandHandler.execute(initGameCommand);
		const gameId = game.id;

		expect(game.playerId).toBe(playerId);
		expect(game.initialBudget).toBe(initialBudget);
		expect(game.currentBudget).toBe(initialBudget);

		// Step 2: User selects a brief
		const briefs = await briefRepository.findAll();
		const selectedBrief = briefs[0];
		const briefCommand = new SelectBriefCommand({
			gameId,
			briefId: selectedBrief.id, // Luxury product launch
		});
		await selectBriefCommandHandler.execute(briefCommand);

		// Verify brief selection
		expect(game.selectedBriefId).toBe(selectedBrief.id);
		expect(game.currentBudget).toBe(50000); // Brief budget

		// Step 3: User selects a venue
		const venues = await venueRepository.findAll();
		const selectedVenue = venues[3];
		const venueCommand = new SelectVenueCommand({
			gameId,
			venueId: selectedVenue.id, // Overpriced manor
		});
		await expect(selectVenueCommandHandler.execute(venueCommand)).rejects.toThrow(
			InsufficientBudgetError,
		);
	});
});
