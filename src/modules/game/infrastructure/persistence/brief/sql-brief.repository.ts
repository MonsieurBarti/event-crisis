import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { BriefMapper } from "./brief.mapper";
import { BriefRepository } from "@/modules/game/domain/brief/brief.repository";
import { Brief } from "@/modules/game/domain/brief/brief";

@Injectable()
export class SqlBriefRepository implements BriefRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Brief | null> {
		const brief = await this.prisma.brief.findUnique({
			where: { id },
		});

		if (!brief) {
			return null;
		}

		return BriefMapper.toDomain(brief);
	}

	async findAll(): Promise<Brief[]> {
		const briefs = await this.prisma.brief.findMany();
		return briefs.map(BriefMapper.toDomain);
	}

	async findRandom(): Promise<Brief | null> {
		const briefsCount = await this.prisma.brief.count();

		if (briefsCount === 0) {
			return null;
		}

		const skip = Math.floor(Math.random() * briefsCount);
		const [randomBrief] = await this.prisma.brief.findMany({
			take: 1,
			skip: skip,
		});

		if (!randomBrief) {
			return null;
		}

		return BriefMapper.toDomain(randomBrief);
	}

	async save(brief: Brief): Promise<Brief> {
		const persistenceBrief = BriefMapper.toPersistence(brief);

		const savedBrief = await this.prisma.brief.upsert({
			where: { id: persistenceBrief.id },
			update: persistenceBrief,
			create: persistenceBrief,
		});

		return BriefMapper.toDomain(savedBrief);
	}
}
