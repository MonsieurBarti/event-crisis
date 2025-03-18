import { PrismaModule } from "@/modules/shared/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GAME_TOKENS } from "../game.tokens";
import { SqlBriefRepository } from "../infrastructure/persistence/brief/sql-brief.repository";
import { SqlConceptRepository } from "../infrastructure/persistence/concept/sql-concept.repository";
import { SqlConstraintRepository } from "../infrastructure/persistence/constraint/sql-constraint.repository";
import { SqlGameRepository } from "../infrastructure/persistence/game/sql-game.repository";
import { SqlUnexpectedIssueRepository } from "../infrastructure/persistence/unexpected-issue/sql-unexpected-issue.repository";
import { SqlVenueRepository } from "../infrastructure/persistence/venue/sql-venue.repository";
import { CalculateFinalScoreCommandHandler } from "./commands/calculate-final-score/calculate-final-score.command";
import { InitializeGameCommandHandler } from "./commands/initialize-game/initialize-game.command";
import { SelectBriefCommandHandler } from "./commands/select-brief/select-brief.command";
import { SelectVenueCommandHandler } from "./commands/select-venue/select-venue.command";
import { SelectConceptCommandHandler } from "./commands/select-concept/select-concept.command";
import { SelectConstraintCommandHandler } from "./commands/select-constraint/select-constraint.command";
import { SelectEntertainmentCommandHandler } from "./commands/select-entertainment/select-entertainment.command";
import { SelectCateringCommandHandler } from "./commands/select-catering/select-catering.command";
import { ResolveUnexpectedIssueCommandHandler } from "./commands/resolve-unexpected-issue/resolve-unexpected-issue.command";
import { SelectFinalStrategyCommandHandler } from "./commands/select-final-strategy/select-final-strategy.command";
import { ResetGameCommandHandler } from "./commands/reset-game/reset-game.command";

const commandHandlers = [
	CalculateFinalScoreCommandHandler,
	InitializeGameCommandHandler,
	ResetGameCommandHandler,
	ResolveUnexpectedIssueCommandHandler,
	SelectBriefCommandHandler,
	SelectCateringCommandHandler,
	SelectConceptCommandHandler,
	SelectConstraintCommandHandler,
	SelectEntertainmentCommandHandler,
	SelectFinalStrategyCommandHandler,
	SelectVenueCommandHandler,
];

@Module({
	imports: [CqrsModule, PrismaModule],
	providers: [
		{
			provide: GAME_TOKENS.BRIEF_REPOSITORY,
			useClass: SqlBriefRepository,
		},
		{
			provide: GAME_TOKENS.CONCEPT_REPOSITORY,
			useClass: SqlConceptRepository,
		},
		{
			provide: GAME_TOKENS.CONSTRAINT_REPOSITORY,
			useClass: SqlConstraintRepository,
		},
		{
			provide: GAME_TOKENS.GAME_REPOSITORY,
			useClass: SqlGameRepository,
		},
		{
			provide: GAME_TOKENS.UNEXPECTED_ISSUE_REPOSITORY,
			useClass: SqlUnexpectedIssueRepository,
		},
		{
			provide: GAME_TOKENS.VENUE_REPOSITORY,
			useClass: SqlVenueRepository,
		},
		...commandHandlers,
	],
})
export class GameApplicationModule {}
