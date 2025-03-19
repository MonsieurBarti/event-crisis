import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { BriefRepository } from "@/modules/game/domain/brief/brief.repository";
import { VenueRepository } from "@/modules/game/domain/venue/venue.repository";
import { ConceptRepository } from "@/modules/game/domain/concept/concept.repository";
import { ConstraintRepository } from "@/modules/game/domain/constraint/constraint.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	StateError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";

export const calculateFinalScorePropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
});

export type CalculateFinalScoreCommandProps = z.infer<typeof calculateFinalScorePropsSchema>;

export class CalculateFinalScoreCommand {
	constructor(public readonly props: CalculateFinalScoreCommandProps) {}
}

@CommandHandler(CalculateFinalScoreCommand)
export class CalculateFinalScoreCommandHandler
	implements ICommandHandler<CalculateFinalScoreCommand>
{
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.BRIEF_REPOSITORY)
		private readonly briefRepository: BriefRepository,
		@Inject(GAME_TOKENS.VENUE_REPOSITORY)
		private readonly venueRepository: VenueRepository,
		@Inject(GAME_TOKENS.CONCEPT_REPOSITORY)
		private readonly conceptRepository: ConceptRepository,
		@Inject(GAME_TOKENS.CONSTRAINT_REPOSITORY)
		private readonly constraintRepository: ConstraintRepository,
	) {}

	async execute(command: CalculateFinalScoreCommand): Promise<number> {
		let validProps: CalculateFinalScoreCommandProps;

		try {
			validProps = calculateFinalScorePropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (
			!game.selectedBriefId ||
			!game.selectedVenueId ||
			!game.selectedConceptId ||
			!game.selectedConstraintId ||
			!game.selectedEntertainmentId ||
			!game.selectedCateringId ||
			game.resolvedIssueIds.length === 0 ||
			!game.finalStrategyType
		) {
			throw new PrerequisiteError(
				"Cannot calculate score: Brief, Venue, Concept, Constraint, Entertainment, Catering, resolved Issues, and Final Strategy are required",
			);
		}

		if (game.isCompleted) {
			throw new StateError("Game is already completed");
		}

		// Get entities to calculate score
		const [brief, venue, concept, constraint] = await Promise.all([
			this.briefRepository.findById(game.selectedBriefId),
			this.venueRepository.findById(game.selectedVenueId),
			this.conceptRepository.findById(game.selectedConceptId),
			this.constraintRepository.findById(game.selectedConstraintId),
		]);

		if (!brief) throw new NotFoundError("Brief", game.selectedBriefId);
		if (!venue) throw new NotFoundError("Venue", game.selectedVenueId);
		if (!concept) throw new NotFoundError("Concept", game.selectedConceptId);
		if (!constraint) throw new NotFoundError("Constraint", game.selectedConstraintId);

		let rawScore = 0;

		const budgetEfficiencyScore = (game.currentBudget / brief.budget) * 100;

		const venueScore = venue.cost / 1000;
		const conceptScore = concept.cost / 1000;

		rawScore = budgetEfficiencyScore + venueScore + conceptScore;

		let strategyMultiplier = 1.0;
		switch (game.finalStrategyType) {
			case "GAMBLING":
				strategyMultiplier = 1.2;
				break;
			case "MARKETING":
				strategyMultiplier = 1.1;
				break;
			case "PROFITABILITY":
				strategyMultiplier = 1.05;
				break;
			default:
				strategyMultiplier = 1.0;
		}

		rawScore *= strategyMultiplier;

		const MIN_POSSIBLE_SCORE = 0;
		const MAX_POSSIBLE_SCORE = 200;
		const MIN_FINAL_SCORE = 1;
		const MAX_FINAL_SCORE = 20;

		let finalScore =
			MIN_FINAL_SCORE +
			((rawScore - MIN_POSSIBLE_SCORE) / (MAX_POSSIBLE_SCORE - MIN_POSSIBLE_SCORE)) *
				(MAX_FINAL_SCORE - MIN_FINAL_SCORE);

		finalScore = Math.max(MIN_FINAL_SCORE, Math.min(MAX_FINAL_SCORE, finalScore));

		finalScore = Math.round(finalScore);

		const completedGame = game.complete(finalScore);
		await this.gameRepository.save(completedGame);

		return finalScore;
	}
}
