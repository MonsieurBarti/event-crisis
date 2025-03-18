import { faker } from "@faker-js/faker";
import { Catering } from "./catering";

export class CateringBuilder {
	private id = faker.string.uuid();
	private name = faker.commerce.productName();
	private description = faker.commerce.productDescription();
	private cost = faker.number.int({ min: 500, max: 5000 });
	private guestSatisfaction = faker.number.int({ min: 1, max: 10 });

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

	withGuestSatisfaction(guestSatisfaction: number): CateringBuilder {
		this.guestSatisfaction = guestSatisfaction;
		return this;
	}

	build(): Catering {
		return new Catering({
			id: this.id,
			name: this.name,
			description: this.description,
			cost: this.cost,
			guestSatisfaction: this.guestSatisfaction,
		});
	}
}
