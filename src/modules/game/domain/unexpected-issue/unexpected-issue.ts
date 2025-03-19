export interface UnexpectedIssueOptionProps {
	id: string;
	name: string;
	description: string;
	budgetImpact: number;
}

export class UnexpectedIssueOption {
	private _id: string;
	private _name: string;
	private _description: string;
	private _budgetImpact: number;

	private constructor(props: UnexpectedIssueOptionProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._budgetImpact = props.budgetImpact;
	}

	static create(props: UnexpectedIssueOptionProps): UnexpectedIssueOption {
		if (!props.id) throw new Error("UnexpectedIssueOption id is required");
		if (!props.name) throw new Error("UnexpectedIssueOption name is required");
		if (!props.description) throw new Error("UnexpectedIssueOption description is required");

		return new UnexpectedIssueOption(props);
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get budgetImpact(): number {
		return this._budgetImpact;
	}
}

export interface UnexpectedIssueProps {
	id: string;
	name: string;
	description: string;
	options: UnexpectedIssueOption[];
}

export class UnexpectedIssue {
	private _id: string;
	private _name: string;
	private _description: string;
	private _options: UnexpectedIssueOption[];

	private constructor(props: UnexpectedIssueProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._options = props.options;
	}

	static create(props: UnexpectedIssueProps): UnexpectedIssue {
		if (!props.id) throw new Error("UnexpectedIssue id is required");
		if (!props.name) throw new Error("UnexpectedIssue name is required");
		if (!props.description) throw new Error("UnexpectedIssue description is required");
		if (!props.options || props.options.length === 0) {
			throw new Error("UnexpectedIssue must have at least one option");
		}

		return new UnexpectedIssue(props);
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get options(): UnexpectedIssueOption[] {
		return this._options;
	}

	getOptionById(optionId: string): UnexpectedIssueOption | undefined {
		return this._options.find((option) => option.id === optionId);
	}
}
