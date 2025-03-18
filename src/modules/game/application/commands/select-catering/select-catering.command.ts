import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { CateringRepository } from "@/modules/game/domain/catering/catering.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectCateringPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	cateringId: z.string().uuid("Catering ID must be a valid UUID"),
});

export type SelectCateringCommandProps = z.infer<typeof selectCateringPropsSchema>;

export class SelectCateringCommand {
	constructor(public readonly props: SelectCateringCommandProps) {}
}

@CommandHandler(SelectCateringCommand)
export class SelectCateringCommandHandler implements ICommandHandler<SelectCateringCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.CATERING_REPOSITORY)
		private readonly cateringRepository: CateringRepository,
	) {}

	async execute(command: SelectCateringCommand): Promise<Game> {
		let validProps: SelectCateringCommandProps;

		try {
			validProps = selectCateringPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError("A brief must be selected before selecting catering");
		}

		if (!game.selectedVenueId) {
			throw new PrerequisiteError("A venue must be selected before selecting catering");
		}

		if (!game.selectedConceptId) {
			throw new PrerequisiteError("A concept must be selected before selecting catering");
		}

		if (!game.selectedConstraintId) {
			throw new PrerequisiteError("A constraint must be selected before selecting catering");
		}

		if (!game.selectedEntertainmentId) {
			throw new PrerequisiteError("Entertainment must be selected before selecting catering");
		}

		const catering = await this.cateringRepository.findById(validProps.cateringId);
		if (!catering) {
			throw new NotFoundError("Catering", validProps.cateringId);
		}

		if (game.currentBudget < catering.cost) {
			throw new PrerequisiteError(
				`Not enough budget to select this catering. Cost: ${catering.cost}, Available: ${game.currentBudget}`,
			);
		}

		const updatedGame = game.selectCatering(validProps.cateringId, catering.cost);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
