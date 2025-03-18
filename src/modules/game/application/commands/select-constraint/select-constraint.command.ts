import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { ConstraintRepository } from "@/modules/game/domain/constraint/constraint.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectConstraintPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	constraintId: z.string().uuid("Constraint ID must be a valid UUID"),
});

export type SelectConstraintCommandProps = z.infer<typeof selectConstraintPropsSchema>;

export class SelectConstraintCommand {
	constructor(public readonly props: SelectConstraintCommandProps) {}
}

@CommandHandler(SelectConstraintCommand)
export class SelectConstraintCommandHandler implements ICommandHandler<SelectConstraintCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.CONSTRAINT_REPOSITORY)
		private readonly constraintRepository: ConstraintRepository,
	) {}

	async execute(command: SelectConstraintCommand): Promise<Game> {
		let validProps: SelectConstraintCommandProps;

		try {
			validProps = selectConstraintPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError("A brief must be selected before selecting a constraint");
		}

		if (!game.selectedVenueId) {
			throw new PrerequisiteError("A venue must be selected before selecting a constraint");
		}

		if (!game.selectedConceptId) {
			throw new PrerequisiteError("A concept must be selected before selecting a constraint");
		}

		const constraint = await this.constraintRepository.findById(validProps.constraintId);
		if (!constraint) {
			throw new NotFoundError("Constraint", validProps.constraintId);
		}

		const updatedGame = game.selectConstraint(validProps.constraintId);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
