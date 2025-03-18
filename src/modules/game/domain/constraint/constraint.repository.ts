import { Constraint } from "./constraint";

export interface ConstraintRepository {
	findById(id: string): Promise<Constraint | null>;
	findAll(): Promise<Constraint[]>;
	findRandom(): Promise<Constraint | null>;
	save(constraint: Constraint): Promise<Constraint>;
}
