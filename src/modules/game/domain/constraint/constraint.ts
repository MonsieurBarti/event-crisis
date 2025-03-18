export interface ConstraintProps {
	id: string;
	name: string;
	description: string;
	impact: string;
}

export class Constraint {
	private _id: string;
	private _name: string;
	private _description: string;
	private _impact: string;

	constructor(props: ConstraintProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._impact = props.impact;
	}

	static create(props: ConstraintProps): Constraint {
		if (!props.id) throw new Error("Constraint id is required");
		if (!props.name) throw new Error("Constraint name is required");
		if (!props.description) throw new Error("Constraint description is required");
		if (!props.impact) throw new Error("Constraint impact is required");

		return new Constraint(props);
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

	get impact(): string {
		return this._impact;
	}
}
