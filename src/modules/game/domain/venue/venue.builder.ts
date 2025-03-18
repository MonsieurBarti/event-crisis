import { faker } from "@faker-js/faker";
import { Venue } from "./venue";

export class VenueBuilder {
	private id: string;
	private name: string;
	private description: string;
	private cost: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.location.streetAddress();
		this.description = faker.lorem.paragraph();
		this.cost = faker.number.int({ min: 5000, max: 50000 });
	}

	withId(id: string): VenueBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): VenueBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): VenueBuilder {
		this.description = description;
		return this;
	}

	withCost(cost: number): VenueBuilder {
		this.cost = cost;
		return this;
	}

	build(): Venue {
		return new Venue({
			id: this.id,
			name: this.name,
			description: this.description,
			cost: this.cost,
		});
	}
}
