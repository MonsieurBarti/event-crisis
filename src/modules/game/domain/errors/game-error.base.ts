export class InsufficientBudgetError extends Error {
	constructor(message: string = "Not enough budget available") {
		super(message);
		this.name = "InsufficientBudgetError";
	}
}

export class GameError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends GameError {
	constructor(message: string) {
		super(`Validation Error: ${message}`);
	}
}

export class NotFoundError extends GameError {
	constructor(entityName: string, id: string) {
		super(`${entityName} with id ${id} not found`);
	}
}

export class PrerequisiteError extends GameError {
	constructor(message: string) {
		super(`Prerequisite Error: ${message}`);
	}
}

export class BudgetError extends GameError {
	constructor(message: string) {
		super(`Budget Error: ${message}`);
	}
}

export class StateError extends GameError {
	constructor(message: string) {
		super(`State Error: ${message}`);
	}
}

export class ZodValidationError extends ValidationError {
	constructor(error: unknown) {
		const errorMessage = formatZodError(error);
		super(errorMessage);
	}
}

function formatZodError(error: unknown): string {
	if (
		error &&
		typeof error === "object" &&
		"format" in error &&
		typeof error.format === "function"
	) {
		try {
			return JSON.stringify(error.format());
		} catch (e) {
			return "Invalid input";
		}
	}
	return "Invalid input";
}
