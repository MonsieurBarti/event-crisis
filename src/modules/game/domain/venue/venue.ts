export interface VenueProps {
	id: string;
	name: string;
	description: string;
	cost: number;
}

export class Venue {
	private _id: string;
	private _name: string;
	private _description: string;
	private _cost: number;

	constructor(props: VenueProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._cost = props.cost;
	}

	static create(props: VenueProps): Venue {
		if (!props.id) throw new Error("Venue id is required");
		if (!props.name) throw new Error("Venue name is required");
		if (!props.description) throw new Error("Venue description is required");
		if (props.cost <= 0) throw new Error("Venue cost must be greater than 0");

		return new Venue(props);
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
}
