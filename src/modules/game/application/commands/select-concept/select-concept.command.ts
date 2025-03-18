import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { ConceptRepository } from "@/modules/game/domain/concept/concept.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectConceptPropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	conceptId: z.string().uuid("Concept ID must be a valid UUID"),
});

export type SelectConceptCommandProps = z.infer<typeof selectConceptPropsSchema>;

export class SelectConceptCommand {
	constructor(public readonly props: SelectConceptCommandProps) {}
}

@CommandHandler(SelectConceptCommand)
export class SelectConceptCommandHandler implements ICommandHandler<SelectConceptCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.CONCEPT_REPOSITORY)
		private readonly conceptRepository: ConceptRepository,
	) {}

	async execute(command: SelectConceptCommand): Promise<Game> {
		let validProps: SelectConceptCommandProps;

		try {
			validProps = selectConceptPropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError("A brief must be selected before selecting a concept");
		}

		if (!game.selectedVenueId) {
			throw new PrerequisiteError("A venue must be selected before selecting a concept");
		}

		const concept = await this.conceptRepository.findById(validProps.conceptId);
		if (!concept) {
			throw new NotFoundError("Concept", validProps.conceptId);
		}

		// Pass the cost directly to the selectConcept method
		const updatedGame = game.selectConcept(validProps.conceptId, concept.cost);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
