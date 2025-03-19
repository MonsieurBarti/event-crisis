export interface EntertainmentProps {
	id: string;
	name: string;
	description: string;
	cost: number;
	impact: number;
}

export class Entertainment {
	private readonly _id: string;
	private readonly _name: string;
	private readonly _description: string;
	private readonly _cost: number;
	private readonly _impact: number;

	private constructor(props: EntertainmentProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._cost = props.cost;
		this._impact = props.impact;
	}

	static create(props: EntertainmentProps): Entertainment {
		if (!props.id) throw new Error("Entertainment id is required");
		if (!props.name) throw new Error("Entertainment name is required");
		if (!props.description) throw new Error("Entertainment description is required");
		if (props.cost <= 0) throw new Error("Entertainment cost must be greater than 0");
		if (props.impact < 1 || props.impact > 10)
			throw new Error("Entertainment impact must be between 1 and 10");

		return new Entertainment(props);
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

	get cost(): number {
		return this._cost;
	}

	get impact(): number {
		return this._impact;
	}
}
