export interface CateringProps {
	id: string;
	name: string;
	description: string;
	cost: number;
	guestSatisfaction: number;
}

export class Catering {
	private readonly _id: string;
	private readonly _name: string;
	private readonly _description: string;
	private readonly _cost: number;
	private readonly _guestSatisfaction: number;

	private constructor(props: CateringProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._cost = props.cost;
		this._guestSatisfaction = props.guestSatisfaction;
	}

	static create(props: CateringProps): Catering {
		if (!props.id) throw new Error("Catering id is required");
		if (!props.name) throw new Error("Catering name is required");
		if (!props.description) throw new Error("Catering description is required");
		if (props.cost <= 0) throw new Error("Catering cost must be greater than 0");
		if (props.guestSatisfaction < 1 || props.guestSatisfaction > 10)
			throw new Error("Catering guest satisfaction must be between 1 and 10");

		return new Catering(props);
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

	get guestSatisfaction(): number {
		return this._guestSatisfaction;
	}
}
