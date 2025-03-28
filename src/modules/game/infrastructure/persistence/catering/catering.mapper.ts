import { Catering } from "@/modules/game/domain/catering/catering";
import { Prisma } from "@/modules/shared/database";

type DatabaseCatering = Prisma.CateringGetPayload<true>;

export class CateringMapper {
	static toDomain(dbModel: DatabaseCatering): Catering {
		return Catering.create({
			id: dbModel.id,
			name: dbModel.name,
			description: dbModel.description,
			cost: dbModel.cost,
			impact: dbModel.impact,
		});
	}

	static toInfrastructure(domain: Catering): DatabaseCatering {
		return {
			id: domain.id,
			name: domain.name,
			description: domain.description,
			cost: domain.cost,
			impact: domain.impact,
		};
	}
}
