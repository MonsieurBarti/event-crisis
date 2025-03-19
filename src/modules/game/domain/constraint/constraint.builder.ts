import { faker } from "@faker-js/faker";
import { Constraint } from "./constraint";

export class ConstraintBuilder {
	private id: string;
	private name: string;
	private description: string;
	private impact: number;
	private cost: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.commerce.productAdjective() + " " + faker.word.noun();
		this.description = faker.lorem.paragraph();
		this.cost = faker.number.int({ min: 5000, max: 30000 });
		this.impact = faker.number.int({ min: 1, max: 10 });
	}

	withId(id: string): ConstraintBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): ConstraintBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): ConstraintBuilder {
		this.description = description;
		return this;
	}

	withImpact(impact: number): ConstraintBuilder {
		this.impact = impact;
		return this;
	}

	withCost(cost: number): ConstraintBuilder {
		this.cost = cost;
		return this;
	}

	build(): Constraint {
		return Constraint.create({
			id: this.id,
			name: this.name,
			description: this.description,
			impact: this.impact,
			cost: this.cost,
		});
	}
}
