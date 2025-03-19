import { z } from "zod";
import { InsufficientBudgetError } from "../errors/game-error.base";

export const FinalStrategyTypeSchema = z.enum(["GAMBLING", "MARKETING", "PROFITABILITY"]);
export const FinalStrategyType = {
	GAMBLING: "GAMBLING",
	MARKETING: "MARKETING",
	PROFITABILITY: "PROFITABILITY",
} as const;
export type FinalStrategyType = (typeof FinalStrategyType)[keyof typeof FinalStrategyType];

export interface GameProps {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	initialBudget: number;
	currentBudget: number;
	playerId: string;
	selectedBriefId: string | null;
	selectedVenueId: string | null;
	selectedConceptId: string | null;
	selectedConstraintId: string | null;
	selectedEntertainmentId: string | null;
	selectedCateringId: string | null;
	resolvedIssueIds: string[];
	resolvedIssueOptionIds: string[];
	finalStrategyType: FinalStrategyType | null;
	finalScore: number | null;
	isCompleted: boolean;
}

export class Game {
	private _id: string;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _currentBudget: number;
	private _initialBudget: number;
	private _playerId: string;
	private _selectedBriefId: string | null;
	private _selectedVenueId: string | null;
	private _selectedConceptId: string | null;
	private _selectedConstraintId: string | null;
	private _selectedEntertainmentId: string | null;
	private _selectedCateringId: string | null;
	private _resolvedIssueIds: string[];
	private _resolvedIssueOptionIds: string[];
	private _finalStrategyType: FinalStrategyType | null;
	private _finalScore: number | null;
	private _isCompleted: boolean;

	private constructor(props: GameProps) {
		this._id = props.id;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
		this._currentBudget = props.currentBudget || props.initialBudget;
		this._initialBudget = props.initialBudget;
		this._playerId = props.playerId;
		this._selectedBriefId = props.selectedBriefId || null;
		this._selectedVenueId = props.selectedVenueId || null;
		this._selectedConceptId = props.selectedConceptId || null;
		this._selectedConstraintId = props.selectedConstraintId || null;
		this._selectedEntertainmentId = props.selectedEntertainmentId || null;
		this._selectedCateringId = props.selectedCateringId || null;
		this._resolvedIssueIds = props.resolvedIssueIds || [];
		this._resolvedIssueOptionIds = props.resolvedIssueOptionIds || [];
		this._finalStrategyType = props.finalStrategyType || null;
		this._finalScore = props.finalScore || null;
		this._isCompleted = props.isCompleted || false;
	}

	static create(props: GameProps): Game {
		if (!props.id) throw new Error("Game id is required");
		if (!props.createdAt) throw new Error("Game createdAt is required");
		if (!props.updatedAt) throw new Error("Game updatedAt is required");
		if (!props.initialBudget) throw new Error("Game initialBudget is required");
		if (!props.playerId) throw new Error("Game playerId is required");

		return new Game(props);
	}

	get id(): string {
		return this._id;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get initialBudget(): number {
		return this._initialBudget;
	}

	get currentBudget(): number {
		return this._currentBudget;
	}

	get playerId(): string {
		return this._playerId;
	}

	get selectedBriefId(): string | null {
		return this._selectedBriefId;
	}

	get selectedVenueId(): string | null {
		return this._selectedVenueId;
	}

	get selectedConceptId(): string | null {
		return this._selectedConceptId;
	}

	get selectedConstraintId(): string | null {
		return this._selectedConstraintId;
	}

	get selectedEntertainmentId(): string | null {
		return this._selectedEntertainmentId;
	}

	get selectedCateringId(): string | null {
		return this._selectedCateringId;
	}

	get resolvedIssueIds(): string[] {
		return [...this._resolvedIssueIds];
	}

	get resolvedIssueOptionIds(): string[] {
		return [...this._resolvedIssueOptionIds];
	}

	get finalStrategyType(): FinalStrategyType | null {
		return this._finalStrategyType;
	}

	get finalScore(): number | null {
		return this._finalScore;
	}

	get isCompleted(): boolean {
		return this._isCompleted;
	}

	selectBrief(briefId: string): Game {
		if (this._selectedBriefId) {
			throw new Error("Brief already selected");
		}
		this._selectedBriefId = briefId;
		this._updatedAt = new Date();
		return this;
	}

	selectVenue(venueId: string, cost: number = 0): Game {
		if (this._selectedVenueId) {
			throw new Error("Venue already selected");
		}

		if (cost > 0 && cost > this._currentBudget) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this venue (required: ${cost}, available: ${this._currentBudget})`,
			);
		}

		this._selectedVenueId = venueId;
		this._currentBudget = cost > 0 ? this._currentBudget - cost : this._currentBudget;
		this._updatedAt = new Date();
		return this;
	}

	selectConcept(conceptId: string, cost: number = 0): Game {
		if (this._selectedConceptId) {
			throw new Error("Concept already selected");
		}

		if (cost > 0 && cost > this._currentBudget) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this concept (required: ${cost}, available: ${this._currentBudget})`,
			);
		}

		this._selectedConceptId = conceptId;
		this._currentBudget = cost > 0 ? this._currentBudget - cost : this._currentBudget;
		this._updatedAt = new Date();
		return this;
	}

	selectConstraint(constraintId: string, cost: number = 0): Game {
		if (this._selectedConstraintId) {
			throw new Error("Constraint already selected");
		}

		if (cost > 0 && cost > this._currentBudget) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this constraint (required: ${cost}, available: ${this._currentBudget})`,
			);
		}

		this._selectedConstraintId = constraintId;
		this._currentBudget = cost > 0 ? this._currentBudget - cost : this._currentBudget;
		this._updatedAt = new Date();
		return this;
	}

	selectEntertainment(entertainmentId: string, cost: number): Game {
		if (this._selectedEntertainmentId) {
			throw new Error("Entertainment already selected");
		}

		if (cost > 0 && cost > this._currentBudget) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this entertainment (required: ${cost}, available: ${this._currentBudget})`,
			);
		}

		this._selectedEntertainmentId = entertainmentId;
		this._currentBudget = cost > 0 ? this._currentBudget - cost : this._currentBudget;
		this._updatedAt = new Date();

		return this;
	}

	selectCatering(cateringId: string, cost: number): Game {
		if (this._selectedCateringId) {
			throw new Error("Catering already selected");
		}

		if (cost > 0 && cost > this._currentBudget) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this catering (required: ${cost}, available: ${this._currentBudget})`,
			);
		}

		this._selectedCateringId = cateringId;

		this._currentBudget = cost > 0 ? this._currentBudget - cost : this._currentBudget;
		this._updatedAt = new Date();

		return this;
	}

	resolveIssue(issueId: string, optionId: string, budgetImpact: number): Game {
		if (this._resolvedIssueIds.length >= 3) {
			throw new Error("Maximum number of issues already resolved");
		}

		if (this._resolvedIssueIds.includes(issueId)) {
			throw new Error("This issue has already been resolved");
		}

		if (budgetImpact < 0 && this._currentBudget + budgetImpact < 0) {
			throw new InsufficientBudgetError(
				`Not enough budget to resolve this issue (impact: ${budgetImpact}, available: ${this._currentBudget})`,
			);
		}

		this._resolvedIssueIds.push(issueId);
		this._resolvedIssueOptionIds.push(optionId);
		this._currentBudget += budgetImpact;
		this._updatedAt = new Date();

		return this;
	}

	selectFinalStrategy(strategyType: FinalStrategyType, budgetImpact: number = 0): Game {
		if (this._finalStrategyType) {
			throw new Error("Final strategy already selected");
		}

		if (budgetImpact < 0 && this._currentBudget + budgetImpact < 0) {
			throw new InsufficientBudgetError(
				`Not enough budget to select this strategy (impact: ${budgetImpact}, available: ${this._currentBudget})`,
			);
		}

		this._finalStrategyType = strategyType;
		this._currentBudget += budgetImpact;
		this._updatedAt = new Date();

		return this;
	}

	adjustBudget(amount: number): Game {
		if (amount < 0 && this._currentBudget + amount < 0) {
			throw new InsufficientBudgetError(
				`Cannot adjust budget: would result in negative balance (adjustment: ${amount}, available: ${this._currentBudget})`,
			);
		}

		this._currentBudget += amount;
		this._updatedAt = new Date();
		return this;
	}

	complete(finalScore: number): Game {
		if (this._isCompleted) {
			throw new Error("Game already completed");
		}

		if (
			!this._selectedBriefId ||
			!this._selectedVenueId ||
			!this._selectedConceptId ||
			!this._selectedConstraintId ||
			!this._selectedEntertainmentId ||
			!this._selectedCateringId ||
			this._resolvedIssueIds.length === 0 ||
			!this._finalStrategyType
		) {
			throw new Error("Cannot complete game: missing required selections");
		}

		this._finalScore = finalScore;
		this._isCompleted = true;
		this._updatedAt = new Date();

		return this;
	}

	reset(): Game {
		this._currentBudget = this._initialBudget;
		this._selectedBriefId = null;
		this._selectedVenueId = null;
		this._selectedConceptId = null;
		this._selectedConstraintId = null;
		this._selectedEntertainmentId = null;
		this._selectedCateringId = null;
		this._resolvedIssueIds = [];
		this._resolvedIssueOptionIds = [];
		this._finalStrategyType = null;
		this._finalScore = null;
		this._isCompleted = false;
		this._updatedAt = new Date();
		return this;
	}
}
