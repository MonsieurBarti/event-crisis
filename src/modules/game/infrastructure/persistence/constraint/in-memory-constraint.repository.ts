import { Injectable } from "@nestjs/common";
import { ConstraintRepository } from "@/modules/game/domain/constraint/constraint.repository";
import { Constraint } from "@/modules/game/domain/constraint/constraint";

@Injectable()
export class InMemoryConstraintRepository implements ConstraintRepository {
	private constraints: Map<string, Constraint> = new Map();

	async findById(id: string): Promise<Constraint | null> {
		return this.constraints.get(id) || null;
	}

	async findAll(): Promise<Constraint[]> {
		return Array.from(this.constraints.values());
	}

	async findRandom(): Promise<Constraint | null> {
		const constraints = Array.from(this.constraints.values());

		if (constraints.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * constraints.length);
		return constraints[randomIndex];
	}

	async save(constraint: Constraint): Promise<Constraint> {
		this.constraints.set(constraint.id, constraint);
		return constraint;
	}

	setConstraint(constraint: Constraint): void {
		this.constraints.set(constraint.id, constraint);
	}

	setConstraints(constraints: Constraint[]): void {
		this.constraints.clear();
		constraints.forEach((constraint) => {
			this.constraints.set(constraint.id, constraint);
		});
	}

	clear(): void {
		this.constraints.clear();
	}
}
