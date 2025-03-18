import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { ConceptMapper } from "./concept.mapper";
import { ConceptRepository } from "@/modules/game/domain/concept/concept.repository";
import { Concept } from "@/modules/game/domain/concept/concept";

@Injectable()
export class SqlConceptRepository implements ConceptRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Concept | null> {
		const concept = await this.prisma.concept.findUnique({
			where: { id },
		});

		if (!concept) {
			return null;
		}

		return ConceptMapper.toDomain(concept);
	}

	async findAll(): Promise<Concept[]> {
		const concepts = await this.prisma.concept.findMany();
		return concepts.map(ConceptMapper.toDomain);
	}

	async findRandom(): Promise<Concept | null> {
		const conceptsCount = await this.prisma.concept.count();

		if (conceptsCount === 0) {
			return null;
		}

		const skip = Math.floor(Math.random() * conceptsCount);
		const [randomConcept] = await this.prisma.concept.findMany({
			take: 1,
			skip: skip,
		});

		if (!randomConcept) {
			return null;
		}

		return ConceptMapper.toDomain(randomConcept);
	}

	async save(concept: Concept): Promise<Concept> {
		const persistenceConcept = ConceptMapper.toPersistence(concept);

		const savedConcept = await this.prisma.concept.upsert({
			where: { id: persistenceConcept.id },
			update: persistenceConcept,
			create: persistenceConcept,
		});

		return ConceptMapper.toDomain(savedConcept);
	}
}
