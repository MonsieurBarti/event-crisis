import { Entertainment } from "@/modules/game/domain/entertainment/entertainment";
import { Prisma } from "@/modules/shared/database";

type DatabaseEntertainment = Prisma.EntertainmentGetPayload<true>;

export class EntertainmentMapper {
	static toDomain(dbModel: DatabaseEntertainment): Entertainment {
		return Entertainment.create({
			id: dbModel.id,
			name: dbModel.name,
			description: dbModel.description,
			cost: dbModel.cost,
			impact: dbModel.impact,
		});
	}

	static toInfrastructure(domain: Entertainment): DatabaseEntertainment {
		return {
			id: domain.id,
			name: domain.name,
			description: domain.description,
			cost: domain.cost,
			impact: domain.impact,
		};
	}
}
