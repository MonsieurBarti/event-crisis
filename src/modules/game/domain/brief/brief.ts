export interface BriefProps {
	id: string;
	name: string;
	description: string;
	budget: number;
}

export class Brief {
	private _id: string;
	private _name: string;
	private _description: string;
	private _budget: number;

	constructor(props: BriefProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._budget = props.budget;
	}

	static create(props: BriefProps): Brief {
		if (!props.id) throw new Error("Brief id is required");
		if (!props.name) throw new Error("Brief name is required");
		if (!props.description) throw new Error("Brief description is required");
		if (props.budget <= 0) throw new Error("Brief budget must be greater than 0");

		return new Brief(props);
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

	get budget(): number {
		return this._budget;
	}
}
