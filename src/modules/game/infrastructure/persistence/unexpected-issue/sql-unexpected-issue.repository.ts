import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { UnexpectedIssueMapper } from "./unexpected-issue.mapper";
import { UnexpectedIssueRepository } from "@/modules/game/domain/unexpected-issue/unexpected-issue.repository";
import { UnexpectedIssue } from "@/modules/game/domain/unexpected-issue/unexpected-issue";

@Injectable()
export class SqlUnexpectedIssueRepository implements UnexpectedIssueRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<UnexpectedIssue | null> {
		const unexpectedIssue = await this.prisma.unexpectedIssue.findUnique({
			where: { id },
			include: { options: true },
		});

		if (!unexpectedIssue) {
			return null;
		}

		return UnexpectedIssueMapper.toDomain(unexpectedIssue);
	}

	async findAll(): Promise<UnexpectedIssue[]> {
		const unexpectedIssues = await this.prisma.unexpectedIssue.findMany({
			include: { options: true },
		});

		return unexpectedIssues.map(UnexpectedIssueMapper.toDomain);
	}

	async findRandom(): Promise<UnexpectedIssue | null> {
		const issuesCount = await this.prisma.unexpectedIssue.count();

		if (issuesCount === 0) {
			return null;
		}

		const skip = Math.floor(Math.random() * issuesCount);
		const [randomIssue] = await this.prisma.unexpectedIssue.findMany({
			take: 1,
			skip: skip,
			include: { options: true },
		});

		if (!randomIssue) {
			return null;
		}

		return UnexpectedIssueMapper.toDomain(randomIssue);
	}

	async save(unexpectedIssue: UnexpectedIssue): Promise<UnexpectedIssue> {
		const { issue, options } = UnexpectedIssueMapper.toPersistence(unexpectedIssue);

		// Use a transaction to ensure both the issue and its options are saved consistently
		const savedIssue = await this.prisma.$transaction(async (prisma) => {
			await prisma.unexpectedIssue.upsert({
				where: { id: issue.id },
				update: issue,
				create: issue,
			});

			// Delete existing options that might be associated with this issue
			await prisma.unexpectedIssueOption.deleteMany({
				where: { unexpectedIssueId: issue.id },
			});

			// Create all options
			for (const option of options) {
				await prisma.unexpectedIssueOption.create({
					data: option,
				});
			}

			// Return the issue with its options
			return prisma.unexpectedIssue.findUnique({
				where: { id: issue.id },
				include: { options: true },
			});
		});

		if (!savedIssue) {
			throw new Error(`Failed to save unexpected issue with id ${issue.id}`);
		}

		return UnexpectedIssueMapper.toDomain(savedIssue);
	}
}
