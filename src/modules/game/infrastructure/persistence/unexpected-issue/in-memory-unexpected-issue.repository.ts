import { Injectable } from "@nestjs/common";
import { UnexpectedIssueRepository } from "@/modules/game/domain/unexpected-issue/unexpected-issue.repository";
import {
	UnexpectedIssue,
	UnexpectedIssueOption,
} from "@/modules/game/domain/unexpected-issue/unexpected-issue";

@Injectable()
export class InMemoryUnexpectedIssueRepository implements UnexpectedIssueRepository {
	private unexpectedIssues: Map<string, UnexpectedIssue> = new Map();

	async findById(id: string): Promise<UnexpectedIssue | null> {
		return this.unexpectedIssues.get(id) || null;
	}

	async findAll(): Promise<UnexpectedIssue[]> {
		return Array.from(this.unexpectedIssues.values());
	}

	async findRandom(): Promise<UnexpectedIssue | null> {
		const issues = Array.from(this.unexpectedIssues.values());

		if (issues.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * issues.length);
		return issues[randomIndex];
	}

	async save(unexpectedIssue: UnexpectedIssue): Promise<UnexpectedIssue> {
		this.unexpectedIssues.set(unexpectedIssue.id, unexpectedIssue);
		return unexpectedIssue;
	}

	setUnexpectedIssue(unexpectedIssue: UnexpectedIssue): void {
		this.unexpectedIssues.set(unexpectedIssue.id, unexpectedIssue);
	}

	clear(): void {
		this.unexpectedIssues.clear();
	}
}
