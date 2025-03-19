import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { Game } from "@/modules/game/domain/game/game";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import { ZodValidationError } from "@/modules/game/domain/errors/game-error.base";
import { v4 as uuidv4 } from "uuid";

export const initializeGamePropsSchema = z.object({
	playerId: z.string().uuid("Player ID must be a valid UUID"),
	initialBudget: z.number().int().positive(),
});

export type InitializeGameCommandProps = z.infer<typeof initializeGamePropsSchema>;

export class InitializeGameCommand {
	constructor(public readonly props: InitializeGameCommandProps) {}
}

@CommandHandler(InitializeGameCommand)
export class InitializeGameCommandHandler implements ICommandHandler<InitializeGameCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
	) {}

	async execute(command: InitializeGameCommand): Promise<Game> {
		let validProps: InitializeGameCommandProps;

		try {
			validProps = initializeGamePropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const existingGame = await this.gameRepository.findActiveByPlayerId(validProps.playerId);
		if (existingGame) {
			return existingGame;
		}

		const game = Game.create({
			id: uuidv4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			initialBudget: validProps.initialBudget,
			currentBudget: validProps.initialBudget,
			playerId: validProps.playerId,
			selectedBriefId: null,
			selectedVenueId: null,
			selectedConceptId: null,
			selectedConstraintId: null,
			selectedEntertainmentId: null,
			selectedCateringId: null,
			resolvedIssueIds: [],
			resolvedIssueOptionIds: [],
			finalStrategyType: null,
			finalScore: null,
			isCompleted: false,
		});

		return this.gameRepository.save(game);
	}
}
