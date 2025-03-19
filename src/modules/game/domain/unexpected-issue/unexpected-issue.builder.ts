import { faker } from "@faker-js/faker";
import {
	UnexpectedIssue,
	UnexpectedIssueOption,
	UnexpectedIssueOptionProps,
} from "./unexpected-issue";

export class UnexpectedIssueOptionBuilder {
	private id: string;
	private name: string;
	private description: string;
	private budgetImpact: number;

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.commerce.productName();
		this.description = faker.lorem.paragraph();
		this.budgetImpact = faker.number.int({ min: -10000, max: 5000 });
	}

	withId(id: string): UnexpectedIssueOptionBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): UnexpectedIssueOptionBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): UnexpectedIssueOptionBuilder {
		this.description = description;
		return this;
	}

	withBudgetImpact(budgetImpact: number): UnexpectedIssueOptionBuilder {
		this.budgetImpact = budgetImpact;
		return this;
	}

	build(): UnexpectedIssueOption {
		return UnexpectedIssueOption.create({
			id: this.id,
			name: this.name,
			description: this.description,
			budgetImpact: this.budgetImpact,
		});
	}
}

export class UnexpectedIssueBuilder {
	private id: string;
	private name: string;
	private description: string;
	private options: UnexpectedIssueOption[];

	constructor() {
		this.id = faker.string.uuid();
		this.name = faker.commerce.productName();
		this.description = faker.lorem.paragraph();
		this.options = [];
	}

	withId(id: string): UnexpectedIssueBuilder {
		this.id = id;
		return this;
	}

	withName(name: string): UnexpectedIssueBuilder {
		this.name = name;
		return this;
	}

	withDescription(description: string): UnexpectedIssueBuilder {
		this.description = description;
		return this;
	}

	withOption(option: UnexpectedIssueOptionProps): UnexpectedIssueBuilder {
		this.options.push(UnexpectedIssueOption.create(option));
		return this;
	}

	withOptions(options: UnexpectedIssueOptionProps[]): UnexpectedIssueBuilder {
		this.options = options.map(UnexpectedIssueOption.create);
		return this;
	}

	build(): UnexpectedIssue {
		return UnexpectedIssue.create({
			id: this.id,
			name: this.name,
			description: this.description,
			options: this.options,
		});
	}
}
