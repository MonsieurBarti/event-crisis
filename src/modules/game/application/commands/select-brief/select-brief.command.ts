import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { BriefRepository } from "@/modules/game/domain/brief/brief.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import { NotFoundError, ZodValidationError } from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectBriefPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	briefId: z.string().uuid("Brief ID must be a valid UUID"),
});

export type SelectBriefCommandProps = z.infer<typeof selectBriefPropsSchema>;

export class SelectBriefCommand {
	constructor(public readonly props: SelectBriefCommandProps) {}
}

@CommandHandler(SelectBriefCommand)
export class SelectBriefCommandHandler implements ICommandHandler<SelectBriefCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.BRIEF_REPOSITORY)
		private readonly briefRepository: BriefRepository,
	) {}

	async execute(command: SelectBriefCommand): Promise<Game> {
		let validProps: SelectBriefCommandProps;

		try {
			validProps = selectBriefPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		const brief = await this.briefRepository.findById(validProps.briefId);
		if (!brief) {
			throw new NotFoundError("Brief", validProps.briefId);
		}

		const gameWithBrief = game.selectBrief(validProps.briefId);
		const updatedGame = gameWithBrief.adjustBudget(brief.budget - gameWithBrief.currentBudget);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
