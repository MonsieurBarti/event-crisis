import { Injectable } from "@nestjs/common";
import { ConceptRepository } from "@/modules/game/domain/concept/concept.repository";
import { Concept } from "@/modules/game/domain/concept/concept";

@Injectable()
export class InMemoryConceptRepository implements ConceptRepository {
	private concepts: Map<string, Concept> = new Map();

	async findById(id: string): Promise<Concept | null> {
		return this.concepts.get(id) || null;
	}

	async findAll(): Promise<Concept[]> {
		return Array.from(this.concepts.values());
	}

	async findRandom(): Promise<Concept | null> {
		const concepts = Array.from(this.concepts.values());

		if (concepts.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * concepts.length);
		return concepts[randomIndex];
	}

	async save(concept: Concept): Promise<Concept> {
		this.concepts.set(concept.id, concept);
		return concept;
	}

	setConcept(concept: Concept): void {
		this.concepts.set(concept.id, concept);
	}

	setConcepts(concepts: Concept[]): void {
		this.concepts.clear();
		concepts.forEach((concept) => {
			this.concepts.set(concept.id, concept);
		});
	}

	clear(): void {
		this.concepts.clear();
	}
}
