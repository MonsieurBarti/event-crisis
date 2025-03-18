import { Concept } from "@/modules/game/domain/concept/concept";
import { Prisma } from "@/modules/shared/database";

type DatabaseConcept = Prisma.ConceptGetPayload<true>;

export class ConceptMapper {
	static toDomain(prismaConcept: DatabaseConcept): Concept {
		return new Concept({
			id: prismaConcept.id,
			name: prismaConcept.name,
			description: prismaConcept.description,
			cost: prismaConcept.cost,
		});
	}

	static toPersistence(concept: Concept): DatabaseConcept {
		return {
			id: concept.id,
			name: concept.name,
			description: concept.description,
			cost: concept.cost,
		};
	}
}
