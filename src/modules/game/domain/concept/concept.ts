export interface ConceptProps {
	id: string;
	name: string;
	description: string;
	cost: number;
}

export class Concept {
	private _id: string;
	private _name: string;
	private _description: string;
	private _cost: number;

	constructor(props: ConceptProps) {
		this._id = props.id;
		this._name = props.name;
		this._description = props.description;
		this._cost = props.cost;
	}

	static create(props: ConceptProps): Concept {
		if (!props.id) throw new Error("Concept id is required");
		if (!props.name) throw new Error("Concept name is required");
		if (!props.description) throw new Error("Concept description is required");
		if (props.cost <= 0) throw new Error("Concept cost must be greater than 0");

		return new Concept(props);
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
