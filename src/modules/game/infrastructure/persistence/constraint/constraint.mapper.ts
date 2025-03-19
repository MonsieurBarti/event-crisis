import { Constraint } from "@/modules/game/domain/constraint/constraint";
import { Prisma } from "@/modules/shared/database";

type DatabaseConstraint = Prisma.ConstraintGetPayload<true>;

export class ConstraintMapper {
	static toDomain(prismaConstraint: DatabaseConstraint): Constraint {
		return Constraint.create({
			id: prismaConstraint.id,
			name: prismaConstraint.name,
			description: prismaConstraint.description,
			impact: prismaConstraint.impact,
		});
	}

	static toPersistence(constraint: Constraint): DatabaseConstraint {
		return {
			id: constraint.id,
			name: constraint.name,
			description: constraint.description,
			impact: constraint.impact,
		};
	}
}
