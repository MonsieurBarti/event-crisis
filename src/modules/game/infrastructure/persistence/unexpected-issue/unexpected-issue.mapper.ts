import {
	UnexpectedIssue,
	UnexpectedIssueOption,
} from "@/modules/game/domain/unexpected-issue/unexpected-issue";
import { Prisma } from "@/modules/shared/database";

type DatabaseUnexpectedIssue = Prisma.UnexpectedIssueGetPayload<{
	include: { options: true };
}>;

type DatabaseUnexpectedIssueOption = Prisma.UnexpectedIssueOptionGetPayload<true>;

export class UnexpectedIssueMapper {
	static toDomain(prismaUnexpectedIssue: DatabaseUnexpectedIssue): UnexpectedIssue {
		return UnexpectedIssue.create({
			id: prismaUnexpectedIssue.id,
			name: prismaUnexpectedIssue.name,
			description: prismaUnexpectedIssue.description,
			options: prismaUnexpectedIssue.options.map((option) =>
				UnexpectedIssueOption.create({
					id: option.id,
					name: option.name,
					description: option.description,
					budgetImpact: option.budgetImpact,
				}),
			),
		});
	}

	static toPersistence(unexpectedIssue: UnexpectedIssue): {
		issue: Omit<DatabaseUnexpectedIssue, "options">;
		options: DatabaseUnexpectedIssueOption[];
	} {
		return {
			issue: {
				id: unexpectedIssue.id,
				name: unexpectedIssue.name,
				description: unexpectedIssue.description,
			},
			options: unexpectedIssue.options.map((option) => ({
				id: option.id,
				name: option.name,
				description: option.description,
				budgetImpact: option.budgetImpact,
				unexpectedIssueId: unexpectedIssue.id,
			})),
		};
	}
}
