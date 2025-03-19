import { Brief } from "@/modules/game/domain/brief/brief";
import { Prisma } from "@/modules/shared/database";

type DatabaseBrief = Prisma.BriefGetPayload<true>;

export class BriefMapper {
	static toDomain(prismaBrief: DatabaseBrief): Brief {
		return Brief.create({
			id: prismaBrief.id,
			name: prismaBrief.name,
			description: prismaBrief.description,
			budget: prismaBrief.budget,
		});
	}

	static toPersistence(brief: Brief): DatabaseBrief {
		return {
			id: brief.id,
			name: brief.name,
			description: brief.description,
			budget: brief.budget,
		};
	}
}
