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
	finalStrategyType: string | null;
	finalScore: number | null;
	isCompleted: boolean;
}

export class Game {
	private readonly _id: string;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;
	private readonly _currentBudget: number;
	private readonly _initialBudget: number;
	private readonly _playerId: string;
	private readonly _selectedBriefId: string | null;
	private readonly _selectedVenueId: string | null;
	private readonly _selectedConceptId: string | null;
	private readonly _selectedConstraintId: string | null;
	private readonly _selectedEntertainmentId: string | null;
	private readonly _selectedCateringId: string | null;
	private readonly _resolvedIssueIds: string[];
	private readonly _resolvedIssueOptionIds: string[];
	private readonly _finalStrategyType: string | null;
	private readonly _finalScore: number | null;
	private readonly _isCompleted: boolean;

	constructor(props: GameProps) {
		this._id = props.id;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
		this._currentBudget = props.currentBudget;
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

		const currentBudget = props.currentBudget ?? props.initialBudget;

		return new Game({
			...props,
			currentBudget,
		});
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

	get finalStrategyType(): string | null {
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
		return new Game({
			...this.toObject(),
			selectedBriefId: briefId,
			updatedAt: new Date(),
		});
	}

	selectVenue(venueId: string, cost: number = 0): Game {
		if (this._selectedVenueId) {
			throw new Error("Venue already selected");
		}
		return new Game({
			...this.toObject(),
			selectedVenueId: venueId,
			currentBudget: cost > 0 ? this._currentBudget - cost : this._currentBudget,
			updatedAt: new Date(),
		});
	}

	selectConcept(conceptId: string, cost: number = 0): Game {
		if (this._selectedConceptId) {
			throw new Error("Concept already selected");
		}
		return new Game({
			...this.toObject(),
			selectedConceptId: conceptId,
			currentBudget: cost > 0 ? this._currentBudget - cost : this._currentBudget,
			updatedAt: new Date(),
		});
	}

	selectConstraint(constraintId: string): Game {
		if (this._selectedConstraintId) {
			throw new Error("Constraint already selected");
		}
		return new Game({
			...this.toObject(),
			selectedConstraintId: constraintId,
			updatedAt: new Date(),
		});
	}

	selectEntertainment(entertainmentId: string, cost: number): Game {
		if (this._selectedEntertainmentId) {
			throw new Error("Entertainment already selected");
		}
		return new Game({
			...this.toObject(),
			selectedEntertainmentId: entertainmentId,
			currentBudget: cost > 0 ? this._currentBudget - cost : this._currentBudget,
			updatedAt: new Date(),
		});
	}

	selectCatering(cateringId: string, cost: number): Game {
		if (this._selectedCateringId) {
			throw new Error("Catering already selected");
		}
		return new Game({
			...this.toObject(),
			selectedCateringId: cateringId,
			currentBudget: cost > 0 ? this._currentBudget - cost : this._currentBudget,
			updatedAt: new Date(),
		});
	}

	resolveIssue(issueId: string, optionId: string, budgetImpact: number): Game {
		if (this._resolvedIssueIds.length >= 3) {
			throw new Error("Maximum number of issues already resolved");
		}

		if (this._resolvedIssueIds.includes(issueId)) {
			throw new Error("This issue has already been resolved");
		}

		return new Game({
			...this.toObject(),
			resolvedIssueIds: [...this._resolvedIssueIds, issueId],
			resolvedIssueOptionIds: [...this._resolvedIssueOptionIds, optionId],
			currentBudget: this._currentBudget + budgetImpact,
			updatedAt: new Date(),
		});
	}

	selectFinalStrategy(
		strategyType: "gambling" | "marketing" | "profitability",
		budgetImpact: number = 0,
	): Game {
		if (this._finalStrategyType) {
			throw new Error("Final strategy already selected");
		}

		return new Game({
			...this.toObject(),
			finalStrategyType: strategyType,
			currentBudget: this._currentBudget + budgetImpact,
			updatedAt: new Date(),
		});
	}

	adjustBudget(amount: number): Game {
		return new Game({
			...this.toObject(),
			currentBudget: this._currentBudget + amount,
			updatedAt: new Date(),
		});
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

		return new Game({
			...this.toObject(),
			finalScore,
			isCompleted: true,
			updatedAt: new Date(),
		});
	}

	reset(): Game {
		return new Game({
			...this.toObject(),
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
			updatedAt: new Date(),
		});
	}

	private toObject(): GameProps {
		return {
			id: this._id,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
			initialBudget: this._initialBudget,
			currentBudget: this._currentBudget,
			playerId: this._playerId,
			selectedBriefId: this._selectedBriefId,
			selectedVenueId: this._selectedVenueId,
			selectedConceptId: this._selectedConceptId,
			selectedConstraintId: this._selectedConstraintId,
			selectedEntertainmentId: this._selectedEntertainmentId,
			selectedCateringId: this._selectedCateringId,
			resolvedIssueIds: [...this._resolvedIssueIds],
			resolvedIssueOptionIds: [...this._resolvedIssueOptionIds],
			finalStrategyType: this._finalStrategyType,
			finalScore: this._finalScore,
			isCompleted: this._isCompleted,
		};
	}
}
