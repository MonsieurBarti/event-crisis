import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/shared/prisma/prisma.service";
import { EntertainmentRepository } from "@/modules/game/domain/entertainment/entertainment.repository";
import { Entertainment } from "@/modules/game/domain/entertainment/entertainment";
import { EntertainmentMapper } from "./entertainment.mapper";

@Injectable()
export class SqlEntertainmentRepository implements EntertainmentRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Entertainment | null> {
		const entertainmentDb = await this.prisma.entertainment.findUnique({
			where: { id },
		});

		if (!entertainmentDb) {
			return null;
		}

		return EntertainmentMapper.toDomain(entertainmentDb);
	}

	async findAll(): Promise<Entertainment[]> {
		const entertainmentsDb = await this.prisma.entertainment.findMany();
		return entertainmentsDb.map(EntertainmentMapper.toDomain);
	}

	async findRandom(count: number): Promise<Entertainment[]> {
		// For SQL databases, getting truly random records can be implemented differently depending on the database
		// This is a simplified implementation that's less efficient but works across all databases
		const entertainmentsDb = await this.prisma.entertainment.findMany();

		if (entertainmentsDb.length <= count) {
			return entertainmentsDb.map(EntertainmentMapper.toDomain);
		}

		const shuffled = [...entertainmentsDb].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count).map(EntertainmentMapper.toDomain);
	}
}
