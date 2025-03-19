import { faker } from "@faker-js/faker";
import { Entertainment } from "./entertainment";

export class EntertainmentBuilder {
	private _id = faker.string.uuid();
	private _name = faker.commerce.productName();
	private _description = faker.commerce.productDescription();
	private _cost = faker.number.int({ min: 1000, max: 5000 });
	private _impact = faker.number.int({ min: 1, max: 10 });

	withId(id: string): EntertainmentBuilder {
		this._id = id;
		return this;
	}

	withName(name: string): EntertainmentBuilder {
		this._name = name;
		return this;
	}

	withDescription(description: string): EntertainmentBuilder {
		this._description = description;
		return this;
	}

	withCost(cost: number): EntertainmentBuilder {
		this._cost = cost;
		return this;
	}

	withImpact(impact: number): EntertainmentBuilder {
		this._impact = impact;
		return this;
	}

	build(): Entertainment {
		return Entertainment.create({
			id: this._id,
			name: this._name,
			description: this._description,
			cost: this._cost,
			impact: this._impact,
		});
	}
}
