import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { ConstraintMapper } from "./constraint.mapper";
import { ConstraintRepository } from "@/modules/game/domain/constraint/constraint.repository";
import { Constraint } from "@/modules/game/domain/constraint/constraint";

@Injectable()
export class SqlConstraintRepository implements ConstraintRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Constraint | null> {
		const constraint = await this.prisma.constraint.findUnique({
			where: { id },
		});

		if (!constraint) {
			return null;
		}

		return ConstraintMapper.toDomain(constraint);
	}

	async findAll(): Promise<Constraint[]> {
		const constraints = await this.prisma.constraint.findMany();
		return constraints.map(ConstraintMapper.toDomain);
	}

	async findRandom(): Promise<Constraint | null> {
		const constraintsCount = await this.prisma.constraint.count();

		if (constraintsCount === 0) {
			return null;
		}

		const skip = Math.floor(Math.random() * constraintsCount);
		const [randomConstraint] = await this.prisma.constraint.findMany({
			take: 1,
			skip: skip,
		});

		if (!randomConstraint) {
			return null;
		}

		return ConstraintMapper.toDomain(randomConstraint);
	}

	async save(constraint: Constraint): Promise<Constraint> {
		const persistenceConstraint = ConstraintMapper.toPersistence(constraint);

		const savedConstraint = await this.prisma.constraint.upsert({
			where: { id: persistenceConstraint.id },
			update: persistenceConstraint,
			create: persistenceConstraint,
		});

		return ConstraintMapper.toDomain(savedConstraint);
	}
}
