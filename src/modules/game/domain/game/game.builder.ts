import { faker } from "@faker-js/faker";
import { Game } from "./game";

export class GameBuilder {
	private id: string;
	private createdAt: Date;
	private updatedAt: Date;
	private initialBudget: number;
	private currentBudget: number;
	private playerId: string;
	private selectedBriefId: string | null;
	private selectedVenueId: string | null;
	private selectedConceptId: string | null;
	private selectedConstraintId: string | null;
	private selectedEntertainmentId: string | null;
	private selectedCateringId: string | null;
	private resolvedIssueIds: string[];
	private resolvedIssueOptionIds: string[];
	private finalStrategyType: string | null;
	private finalScore: number | null;
	private isCompleted: boolean;

	constructor() {
		this.id = faker.string.uuid();
		this.createdAt = faker.date.recent();
		this.updatedAt = faker.date.recent();
		this.initialBudget = faker.number.int({ min: 10000, max: 100000 });
		this.currentBudget = faker.number.int({ min: 10000, max: 100000 });
		this.playerId = faker.string.uuid();
		this.selectedBriefId = null;
		this.selectedVenueId = null;
		this.selectedConceptId = null;
		this.selectedConstraintId = null;
		this.selectedEntertainmentId = null;
		this.selectedCateringId = null;
		this.resolvedIssueIds = [];
		this.resolvedIssueOptionIds = [];
		this.finalStrategyType = null;
		this.finalScore = null;
		this.isCompleted = false;
	}

	withId(id: string): GameBuilder {
		this.id = id;
		return this;
	}

	withCreatedAt(createdAt: Date): GameBuilder {
		this.createdAt = createdAt;
		return this;
	}

	withUpdatedAt(updatedAt: Date): GameBuilder {
		this.updatedAt = updatedAt;
		return this;
	}

	withInitialBudget(initialBudget: number): GameBuilder {
		this.initialBudget = initialBudget;
		return this;
	}

	withCurrentBudget(currentBudget: number): GameBuilder {
		this.currentBudget = currentBudget;
		return this;
	}

	withPlayerId(playerId: string): GameBuilder {
		this.playerId = playerId;
		return this;
	}

	withSelectedBriefId(selectedBriefId: string | null): GameBuilder {
		this.selectedBriefId = selectedBriefId;
		return this;
	}

	withSelectedVenueId(selectedVenueId: string | null): GameBuilder {
		this.selectedVenueId = selectedVenueId;
		return this;
	}

	withSelectedConceptId(selectedConceptId: string | null): GameBuilder {
		this.selectedConceptId = selectedConceptId;
		return this;
	}

	withSelectedConstraintId(selectedConstraintId: string | null): GameBuilder {
		this.selectedConstraintId = selectedConstraintId;
		return this;
	}

	withSelectedEntertainmentId(selectedEntertainmentId: string | null): GameBuilder {
		this.selectedEntertainmentId = selectedEntertainmentId;
		return this;
	}

	withSelectedCateringId(selectedCateringId: string | null): GameBuilder {
		this.selectedCateringId = selectedCateringId;
		return this;
	}

	withResolvedIssueIds(resolvedIssueIds: string[]): GameBuilder {
		this.resolvedIssueIds = resolvedIssueIds;
		return this;
	}

	withResolvedIssueOptionIds(resolvedIssueOptionIds: string[]): GameBuilder {
		this.resolvedIssueOptionIds = resolvedIssueOptionIds;
		return this;
	}

	withFinalStrategyType(finalStrategyType: string | null): GameBuilder {
		this.finalStrategyType = finalStrategyType;
		return this;
	}

	withFinalScore(finalScore: number | null): GameBuilder {
		this.finalScore = finalScore;
		return this;
	}

	withIsCompleted(isCompleted: boolean): GameBuilder {
		this.isCompleted = isCompleted;
		return this;
	}

	// Helper methods for backward compatibility
	withResolvedIssueId(resolvedIssueId: string | null): GameBuilder {
		if (resolvedIssueId) {
			this.resolvedIssueIds = [resolvedIssueId];
		}
		return this;
	}

	withResolvedIssueOptionId(resolvedIssueOptionId: string | null): GameBuilder {
		if (resolvedIssueOptionId) {
			this.resolvedIssueOptionIds = [resolvedIssueOptionId];
		}
		return this;
	}

	build(): Game {
		return new Game({
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			initialBudget: this.initialBudget,
			currentBudget: this.currentBudget,
			playerId: this.playerId,
			selectedBriefId: this.selectedBriefId,
			selectedVenueId: this.selectedVenueId,
			selectedConceptId: this.selectedConceptId,
			selectedConstraintId: this.selectedConstraintId,
			selectedEntertainmentId: this.selectedEntertainmentId,
			selectedCateringId: this.selectedCateringId,
			resolvedIssueIds: this.resolvedIssueIds,
			resolvedIssueOptionIds: this.resolvedIssueOptionIds,
			finalStrategyType: this.finalStrategyType,
			finalScore: this.finalScore,
			isCompleted: this.isCompleted,
		});
	}
}
