import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { BriefRepository } from "@/modules/game/domain/brief/brief.repository";
import { VenueRepository } from "@/modules/game/domain/venue/venue.repository";
import { ConceptRepository } from "@/modules/game/domain/concept/concept.repository";
import { ConstraintRepository } from "@/modules/game/domain/constraint/constraint.repository";
import { EntertainmentRepository } from "@/modules/game/domain/entertainment/entertainment.repository";
import { CateringRepository } from "@/modules/game/domain/catering/catering.repository";
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
		@Inject(GAME_TOKENS.ENTERTAINMENT_REPOSITORY)
		private readonly entertainmentRepository: EntertainmentRepository,
		@Inject(GAME_TOKENS.CATERING_REPOSITORY)
		private readonly cateringRepository: CateringRepository,
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
		const [brief, venue, concept, constraint, entertainment, catering] = await Promise.all([
			this.briefRepository.findById(game.selectedBriefId),
			this.venueRepository.findById(game.selectedVenueId),
			this.conceptRepository.findById(game.selectedConceptId),
			this.constraintRepository.findById(game.selectedConstraintId),
			this.entertainmentRepository.findById(game.selectedEntertainmentId),
			this.cateringRepository.findById(game.selectedCateringId),
		]);

		if (!brief) throw new NotFoundError("Brief", game.selectedBriefId);
		if (!venue) throw new NotFoundError("Venue", game.selectedVenueId);
		if (!concept) throw new NotFoundError("Concept", game.selectedConceptId);
		if (!constraint) throw new NotFoundError("Constraint", game.selectedConstraintId);
		if (!entertainment) throw new NotFoundError("Entertainment", game.selectedEntertainmentId);
		if (!catering) throw new NotFoundError("Catering", game.selectedCateringId);

		let rawScore = 0;

		// Budget efficiency score - how much of the initial budget remains
		const budgetEfficiencyScore = (game.currentBudget / brief.budget) * 100;

		// Base score from venue and concept costs
		const venueScore = venue.cost / 1000;
		const conceptScore = concept.cost / 1000;

		// Impact scores from various components
		const constraintImpactScore = constraint.impact * 2; // Multiplier to give constraints appropriate weight
		const constraintCostScore = constraint.cost / 1000; // Constraints with higher costs should affect score
		const entertainmentImpactScore = entertainment.impact * 3; // Entertainment has higher weight on guest experience
		const cateringImpactScore = catering.impact * 3; // Catering has higher weight on guest experience

		// Combine all scores
		rawScore =
			budgetEfficiencyScore +
			venueScore +
			conceptScore +
			constraintImpactScore +
			constraintCostScore +
			entertainmentImpactScore +
			cateringImpactScore;

		// Apply strategy multiplier
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

		// Scale raw score to final score range (1-20)
		const MIN_POSSIBLE_SCORE = 0;
		const MAX_POSSIBLE_SCORE = 300; // Adjusted for new factors
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
