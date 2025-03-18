import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { EntertainmentRepository } from "@/modules/game/domain/entertainment/entertainment.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectEntertainmentPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	entertainmentId: z.string().uuid("Entertainment ID must be a valid UUID"),
});

export type SelectEntertainmentCommandProps = z.infer<typeof selectEntertainmentPropsSchema>;

export class SelectEntertainmentCommand {
	constructor(public readonly props: SelectEntertainmentCommandProps) {}
}

@CommandHandler(SelectEntertainmentCommand)
export class SelectEntertainmentCommandHandler
	implements ICommandHandler<SelectEntertainmentCommand>
{
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.ENTERTAINMENT_REPOSITORY)
		private readonly entertainmentRepository: EntertainmentRepository,
	) {}

	async execute(command: SelectEntertainmentCommand): Promise<Game> {
		let validProps: SelectEntertainmentCommandProps;

		try {
			validProps = selectEntertainmentPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError("A brief must be selected before selecting entertainment");
		}

		if (!game.selectedVenueId) {
			throw new PrerequisiteError("A venue must be selected before selecting entertainment");
		}

		if (!game.selectedConceptId) {
			throw new PrerequisiteError(
				"A concept must be selected before selecting entertainment",
			);
		}

		if (!game.selectedConstraintId) {
			throw new PrerequisiteError(
				"A constraint must be selected before selecting entertainment",
			);
		}

		const entertainment = await this.entertainmentRepository.findById(
			validProps.entertainmentId,
		);
		if (!entertainment) {
			throw new NotFoundError("Entertainment", validProps.entertainmentId);
		}

		// Check if we have enough budget for this entertainment
		if (game.currentBudget < entertainment.cost) {
			throw new PrerequisiteError(
				`Not enough budget to select this entertainment. Cost: ${entertainment.cost}, Available: ${game.currentBudget}`,
			);
		}

		const updatedGame = game.selectEntertainment(
			validProps.entertainmentId,
			entertainment.cost,
		);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
