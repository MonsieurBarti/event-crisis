import { v4 as uuidv4 } from "uuid";
import { ResolveUnexpectedIssueCommandHandler } from "./resolve-unexpected-issue.command";
import { GameBuilder } from "@/modules/game/domain/game/game.builder";
import { UnexpectedIssueBuilder } from "@/modules/game/domain/unexpected-issue/unexpected-issue.builder";
import { InMemoryGameRepository } from "@/modules/game/infrastructure/persistence/game/in-memory-game.repository";
import { InMemoryUnexpectedIssueRepository } from "@/modules/game/infrastructure/persistence/unexpected-issue/in-memory-unexpected-issue.repository";

describe("ResolveUnexpectedIssueCommandHandler", () => {
	const gameRepository = new InMemoryGameRepository();
	const unexpectedIssueRepository = new InMemoryUnexpectedIssueRepository();
	const handler = new ResolveUnexpectedIssueCommandHandler(
		gameRepository,
		unexpectedIssueRepository,
	);

	beforeEach(() => {
		gameRepository.clear();
		unexpectedIssueRepository.clear();
	});

	it("should resolve an unexpected issue and adjust budget", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();
		const initialBudget = 8000;
		const budgetImpact = -1500;

		const game = new GameBuilder()
			.withId(gameId)
			.withCurrentBudget(initialBudget)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.build();

		const issue = UnexpectedIssueBuilder.create()
			.withId(issueId)
			.withName("Test Issue")
			.withDescription("Test Issue Description")
			.withOption({
				id: optionId,
				name: "Test Option",
				description: "Test Option Description",
				budgetImpact: budgetImpact,
			})
			.build();

		gameRepository.setActiveGame(game);
		unexpectedIssueRepository.setUnexpectedIssue(issue);

		await handler.execute({
			props: {
				gameId,
				issueId,
				optionId,
			},
		});

		const updatedGame = await gameRepository.findById(gameId);

		expect(updatedGame).toBeDefined();
		expect(updatedGame?.resolvedIssueIds).toContain(issueId);
		expect(updatedGame?.resolvedIssueOptionIds).toContain(optionId);
		expect(updatedGame?.currentBudget).toBe(initialBudget + budgetImpact);
	});

	it("should throw error if game is not found", async () => {
		const gameId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();

		await expect(
			handler.execute({
				props: {
					gameId,
					issueId,
					optionId,
				},
			}),
		).rejects.toThrow(`Game with id ${gameId} not found`);
	});

	it("should throw error if required selections are not made", async () => {
		const gameId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();

		const game = new GameBuilder().withId(gameId).withIsCompleted(false).build();

		gameRepository.setActiveGame(game);

		await expect(
			handler.execute({
				props: {
					gameId,
					issueId,
					optionId,
				},
			}),
		).rejects.toThrow(
			"A brief, venue, and concept must be selected before resolving an unexpected issue",
		);
	});

	it("should throw error if issue is not found", async () => {
		const gameId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();
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
				props: {
					gameId,
					issueId,
					optionId,
				},
			}),
		).rejects.toThrow(`Unexpected Issue with id ${issueId} not found`);
	});

	it("should throw error if option is not found in the issue", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const issueId = uuidv4();
		const validOptionId = uuidv4();
		const invalidOptionId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.build();

		const issue = UnexpectedIssueBuilder.create()
			.withId(issueId)
			.withOption({
				id: validOptionId,
				name: "Valid Option",
				description: "Valid Option Description",
				budgetImpact: -500,
			})
			.build();

		gameRepository.setActiveGame(game);
		unexpectedIssueRepository.setUnexpectedIssue(issue);

		await expect(
			handler.execute({
				props: {
					gameId,
					issueId,
					optionId: invalidOptionId,
				},
			}),
		).rejects.toThrow(`Option with id ${invalidOptionId} not found`);
	});

	it("should throw error if maximum number of issues already resolved", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();
		const existingIssueId1 = uuidv4();
		const existingIssueId2 = uuidv4();
		const existingIssueId3 = uuidv4();
		const existingOptionId1 = uuidv4();
		const existingOptionId2 = uuidv4();
		const existingOptionId3 = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withResolvedIssueIds([existingIssueId1, existingIssueId2, existingIssueId3])
			.withResolvedIssueOptionIds([existingOptionId1, existingOptionId2, existingOptionId3])
			.build();

		const issue = UnexpectedIssueBuilder.create()
			.withId(issueId)
			.withOption({
				id: optionId,
				name: "Test Option",
				description: "Test Option Description",
				budgetImpact: -500,
			})
			.build();

		gameRepository.setActiveGame(game);
		unexpectedIssueRepository.setUnexpectedIssue(issue);

		await expect(
			handler.execute({
				props: {
					gameId,
					issueId,
					optionId,
				},
			}),
		).rejects.toThrow("Maximum number of issues (3) already resolved");
	});

	it("should throw error if issue has already been resolved", async () => {
		const gameId = uuidv4();
		const briefId = uuidv4();
		const venueId = uuidv4();
		const conceptId = uuidv4();
		const issueId = uuidv4();
		const optionId = uuidv4();
		const existingOptionId = uuidv4();

		const game = new GameBuilder()
			.withId(gameId)
			.withSelectedBriefId(briefId)
			.withSelectedVenueId(venueId)
			.withSelectedConceptId(conceptId)
			.withResolvedIssueIds([issueId])
			.withResolvedIssueOptionIds([existingOptionId])
			.build();

		const issue = UnexpectedIssueBuilder.create()
			.withId(issueId)
			.withOption({
				id: optionId,
				name: "Test Option",
				description: "Test Option Description",
				budgetImpact: -500,
			})
			.build();

		gameRepository.setActiveGame(game);
		unexpectedIssueRepository.setUnexpectedIssue(issue);

		await expect(
			handler.execute({
				props: {
					gameId,
					issueId,
					optionId,
				},
			}),
		).rejects.toThrow("This issue has already been resolved");
	});
});
