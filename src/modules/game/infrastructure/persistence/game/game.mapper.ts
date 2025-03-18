import { Game } from "@/modules/game/domain/game/game";
import { Prisma } from "@/modules/shared/database";

type DatabaseGame = Prisma.GameGetPayload<true>;

export class GameMapper {
	static toDomain(prismaGame: DatabaseGame): Game {
		return new Game({
			id: prismaGame.id,
			createdAt: prismaGame.createdAt,
			updatedAt: prismaGame.updatedAt,
			initialBudget: prismaGame.initialBudget,
			currentBudget: prismaGame.currentBudget,
			playerId: prismaGame.playerId,
			selectedBriefId: prismaGame.selectedBriefId,
			selectedVenueId: prismaGame.selectedVenueId,
			selectedConceptId: prismaGame.selectedConceptId,
			selectedConstraintId: prismaGame.selectedConstraintId,
			selectedEntertainmentId: prismaGame.selectedEntertainmentId,
			selectedCateringId: prismaGame.selectedCateringId,
			resolvedIssueIds: prismaGame.resolvedIssueIds
				? JSON.parse(prismaGame.resolvedIssueIds)
				: [],
			resolvedIssueOptionIds: prismaGame.resolvedIssueOptionIds
				? JSON.parse(prismaGame.resolvedIssueOptionIds)
				: [],
			finalStrategyType: prismaGame.finalStrategyType,
			finalScore: prismaGame.finalScore,
			isCompleted: prismaGame.isCompleted,
		});
	}

	static toPersistence(game: Game): DatabaseGame {
		return {
			id: game.id,
			createdAt: game.createdAt,
			updatedAt: game.updatedAt,
			initialBudget: game.initialBudget,
			currentBudget: game.currentBudget,
			playerId: game.playerId,
			selectedBriefId: game.selectedBriefId,
			selectedVenueId: game.selectedVenueId,
			selectedConceptId: game.selectedConceptId,
			selectedConstraintId: game.selectedConstraintId,
			selectedEntertainmentId: game.selectedEntertainmentId,
			selectedCateringId: game.selectedCateringId,
			resolvedIssueIds: JSON.stringify(game.resolvedIssueIds),
			resolvedIssueOptionIds: JSON.stringify(game.resolvedIssueOptionIds),
			finalStrategyType: game.finalStrategyType,
			finalScore: game.finalScore,
			isCompleted: game.isCompleted,
		};
	}
}
