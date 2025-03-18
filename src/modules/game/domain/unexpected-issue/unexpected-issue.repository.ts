import { UnexpectedIssue } from "./unexpected-issue";

export interface UnexpectedIssueRepository {
	findById(id: string): Promise<UnexpectedIssue | null>;
	findAll(): Promise<UnexpectedIssue[]>;
	findRandom(): Promise<UnexpectedIssue | null>;
	save(unexpectedIssue: UnexpectedIssue): Promise<UnexpectedIssue>;
}
