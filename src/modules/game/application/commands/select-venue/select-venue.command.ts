import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { z } from "zod";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { VenueRepository } from "@/modules/game/domain/venue/venue.repository";
import { Inject } from "@nestjs/common";
import { GAME_TOKENS } from "@/modules/game/game.tokens";
import {
	NotFoundError,
	PrerequisiteError,
	ZodValidationError,
} from "@/modules/game/domain/errors/game-error.base";
import { Game } from "@/modules/game/domain/game/game";

export const selectVenuePropsSchema = z.object({
	gameId: z.string().uuid("Game ID must be a valid UUID"),
	venueId: z.string().uuid("Venue ID must be a valid UUID"),
});

export type SelectVenueCommandProps = z.infer<typeof selectVenuePropsSchema>;

export class SelectVenueCommand {
	constructor(public readonly props: SelectVenueCommandProps) {}
}

@CommandHandler(SelectVenueCommand)
export class SelectVenueCommandHandler implements ICommandHandler<SelectVenueCommand> {
	constructor(
		@Inject(GAME_TOKENS.GAME_REPOSITORY)
		private readonly gameRepository: GameRepository,
		@Inject(GAME_TOKENS.VENUE_REPOSITORY)
		private readonly venueRepository: VenueRepository,
	) {}

	async execute(command: SelectVenueCommand): Promise<Game> {
		let validProps: SelectVenueCommandProps;

		try {
			validProps = selectVenuePropsSchema.parse(command.props);
		} catch (error) {
			throw new ZodValidationError(error);
		}

		const game = await this.gameRepository.findById(validProps.gameId);
		if (!game) {
			throw new NotFoundError("Game", validProps.gameId);
		}

		if (!game.selectedBriefId) {
			throw new PrerequisiteError("A brief must be selected before selecting a venue");
		}

		const venue = await this.venueRepository.findById(validProps.venueId);
		if (!venue) {
			throw new NotFoundError("Venue", validProps.venueId);
		}

		const updatedGame = game.selectVenue(validProps.venueId, venue.cost);

		await this.gameRepository.save(updatedGame);

		return updatedGame;
	}
}
