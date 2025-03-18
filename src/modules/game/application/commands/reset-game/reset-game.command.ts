import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import { NotFoundError, ZodValidationError } from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const resetGamePropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
});

export type ResetGameCommandProps = z.infer<typeof resetGamePropsSchema>;

export class ResetGameCommand {
	constructor(public readonly props: ResetGameCommandProps) {}
}

@CommandHandler(ResetGameCommand)
export class ResetGameCommandHandler implements ICommandHandler<ResetGameCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
	) {}

	async execute(command: ResetGameCommand): Promise<Game> {
		let validProps: ResetGameCommandProps;

		try {
			validProps = resetGamePropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		const resetGame = game.reset();

		await this.gameRepository.save(resetGame);

		return resetGame;
	}
}
