import { Concept } from "./concept";

export interface ConceptRepository {
	findById(id: string): Promise<Concept | null>;
	findAll(): Promise<Concept[]>;
	findRandom(): Promise<Concept | null>;
	save(concept: Concept): Promise<Concept>;
}
