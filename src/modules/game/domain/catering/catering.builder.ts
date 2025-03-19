import { faker } from "@faker-js/faker";
import { Catering } from "./catering";

export class CateringBuilder {
	private id: string;
	private name: string;
	private description: string;
	private cost: number;
	private impact: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.commerce.productName();
		this.description = faker.commerce.productDescription();
		this.cost = faker.number.int({ min: 500, max: 5000 });
		this.impact = faker.number.int({ min: 1, max: 10 });
	}

	withId(id: string): CateringBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): CateringBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): CateringBuilder {
		this.description = description;
		return this;
	}

	withCost(cost: number): CateringBuilder {
		this.cost = cost;
		return this;
	}

	withImpact(impact: number): CateringBuilder {
		this.impact = impact;
		return this;
	}

	build(): Catering {
		return Catering.create({
			id: this.id,
			name: this.name,
			description: this.description,
			cost: this.cost,
			impact: this.impact,
		});
	}
}
