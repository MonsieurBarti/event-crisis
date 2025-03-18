import { faker } from "@faker-js/faker";
import { Concept } from "./concept";

export class ConceptBuilder {
	private id: string;
	private name: string;
	private description: string;
	private cost: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.company.catchPhrase();
		this.description = faker.lorem.paragraph();
		this.cost = faker.number.int({ min: 5000, max: 30000 });
	}

	withId(id: string): ConceptBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): ConceptBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): ConceptBuilder {
		this.description = description;
		return this;
	}

	withCost(cost: number): ConceptBuilder {
		this.cost = cost;
		return this;
	}

	build(): Concept {
		return new Concept({
			id: this.id,
			name: this.name,
			description: this.description,
			cost: this.cost,
		});
	}
}
