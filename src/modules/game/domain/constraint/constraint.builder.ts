import { faker } from "@faker-js/faker";
import { Constraint } from "./constraint";

export class ConstraintBuilder {
	private id: string;
	private name: string;
	private description: string;
	private impact: string;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.commerce.productAdjective() + " " + faker.word.noun();
		this.description = faker.lorem.paragraph();
		this.impact = faker.lorem.sentence();
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

	withImpact(impact: string): ConstraintBuilder {
		this.impact = impact;
		return this;
	}

	build(): Constraint {
		return Constraint.create({
			id: this.id,
			name: this.name,
			description: this.description,
			impact: this.impact,
		});
	}
}
