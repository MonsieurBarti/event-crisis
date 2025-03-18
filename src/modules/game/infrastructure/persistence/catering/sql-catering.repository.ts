import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/shared/prisma/prisma.service";
import { CateringRepository } from "@/modules/game/domain/catering/catering.repository";
import { Catering } from "@/modules/game/domain/catering/catering";
import { CateringMapper } from "./catering.mapper";

@Injectable()
export class SqlCateringRepository implements CateringRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Catering | null> {
		const cateringDb = await this.prisma.catering.findUnique({
			where: { id },
		});

		if (!cateringDb) {
			return null;
		}

		return CateringMapper.toDomain(cateringDb);
	}

	async findAll(): Promise<Catering[]> {
		const cateringsDb = await this.prisma.catering.findMany();
		return cateringsDb.map(CateringMapper.toDomain);
	}

	async findRandom(count: number): Promise<Catering[]> {
		const cateringsDb = await this.prisma.catering.findMany();

		if (cateringsDb.length <= count) {
			return cateringsDb.map(CateringMapper.toDomain);
		}

		const shuffled = [...cateringsDb].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count).map(CateringMapper.toDomain);
	}
}
