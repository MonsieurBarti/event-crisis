import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { UnexpectedIssueRepository } from "@/modules/game/domain/unexpected-issue/unexpected-issue.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	BudgetError,
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const resolveUnexpectedIssuePropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	issueId: z.string().uuid("Issue ID must be a valid UUID"),
	optionId: z.string().uuid("Option ID must be a valid UUID"),
});

export type ResolveUnexpectedIssueCommandProps = z.infer<typeof resolveUnexpectedIssuePropsSchema>;

export class ResolveUnexpectedIssueCommand {
	constructor(public readonly props: ResolveUnexpectedIssueCommandProps) {}
}

@CommandHandler(ResolveUnexpectedIssueCommand)
export class ResolveUnexpectedIssueCommandHandler
	implements ICommandHandler<ResolveUnexpectedIssueCommand>
{
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.UNEXPECTED_ISSUE_REPOSITORY)
		private readonly unexpectedIssueRepository: UnexpectedIssueRepository,
	) {}

	async execute(command: ResolveUnexpectedIssueCommand): Promise<Game> {
		let validProps: ResolveUnexpectedIssueCommandProps;

		try {
			validProps = resolveUnexpectedIssuePropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId || !game.selectedVenueId || !game.selectedConceptId) {
			throw new PrerequisiteError(
				"A brief, venue, and concept must be selected before resolving an unexpected issue",
			);
		}

		// Check if we've already resolved 3 issues (maximum per game)
		if (game.resolvedIssueIds.length >= 3) {
			throw new PrerequisiteError("Maximum number of issues (3) already resolved");
		}

		// Check if this specific issue has already been resolved
		if (game.resolvedIssueIds.includes(validProps.issueId)) {
			throw new PrerequisiteError("This issue has already been resolved");
		}

		const unexpectedIssue = await this.unexpectedIssueRepository.findById(validProps.issueId);
		if (!unexpectedIssue) {
			throw new NotFoundError("Unexpected Issue", validProps.issueId);
		}

		const option = unexpectedIssue.getOptionById(validProps.optionId);
		if (!option) {
			throw new NotFoundError("Option", validProps.optionId);
		}

		if (game.currentBudget + option.budgetImpact < 0) {
			throw new BudgetError(
				`Not enough budget to resolve this issue. Cost: ${Math.abs(option.budgetImpact)}, Available: ${game.currentBudget}`,
			);
		}

		const updatedGame = game.resolveIssue(
			validProps.issueId,
			validProps.optionId,
			option.budgetImpact,
		);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
