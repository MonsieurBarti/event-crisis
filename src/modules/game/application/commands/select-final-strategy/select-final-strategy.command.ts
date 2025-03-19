import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { FinalStrategyTypeSchema, Game } from "@/modules/game/domain/game/game";

export const selectFinalStrategyPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	strategyType: FinalStrategyTypeSchema,
});

export type SelectFinalStrategyCommandProps = z.infer<typeof selectFinalStrategyPropsSchema>;

export class SelectFinalStrategyCommand {
	constructor(public readonly props: SelectFinalStrategyCommandProps) {}
}

@CommandHandler(SelectFinalStrategyCommand)
export class SelectFinalStrategyCommandHandler
	implements ICommandHandler<SelectFinalStrategyCommand>
{
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
	) {}

	async execute(command: SelectFinalStrategyCommand): Promise<Game> {
		let validProps: SelectFinalStrategyCommandProps;

		try {
			validProps = selectFinalStrategyPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError(
				"A brief must be selected before selecting a final strategy",
			);
		}

		if (!game.selectedVenueId) {
			throw new PrerequisiteError(
				"A venue must be selected before selecting a final strategy",
			);
		}

		if (!game.selectedConceptId) {
			throw new PrerequisiteError(
				"A concept must be selected before selecting a final strategy",
			);
		}

		if (!game.selectedConstraintId) {
			throw new PrerequisiteError(
				"A constraint must be selected before selecting a final strategy",
			);
		}

		if (!game.selectedEntertainmentId) {
			throw new PrerequisiteError(
				"Entertainment must be selected before selecting a final strategy",
			);
		}

		if (!game.selectedCateringId) {
			throw new PrerequisiteError(
				"Catering must be selected before selecting a final strategy",
			);
		}

		if (game.resolvedIssueIds.length === 0) {
			throw new PrerequisiteError(
				"At least one unexpected issue must be resolved before selecting a final strategy",
			);
		}

		const updatedGame = game.selectFinalStrategy(validProps.strategyType);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
