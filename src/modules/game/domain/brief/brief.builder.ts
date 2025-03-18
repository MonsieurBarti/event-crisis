import { faker } from "@faker-js/faker";
import { Brief } from "./brief";

export class BriefBuilder {
	private id: string;
	private name: string;
	private description: string;
	private budget: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.company.buzzPhrase();
		this.description = faker.lorem.paragraph();
		this.budget = faker.number.int({ min: 30000, max: 100000 });
	}

	withId(id: string): BriefBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): BriefBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): BriefBuilder {
		this.description = description;
		return this;
	}

	withBudget(budget: number): BriefBuilder {
		this.budget = budget;
		return this;
	}

	build(): Brief {
		return new Brief({
			id: this.id,
			name: this.name,
			description: this.description,
			budget: this.budget,
		});
	}
}
