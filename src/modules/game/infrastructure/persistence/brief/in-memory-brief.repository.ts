import { Injectable } from "@nestjs/common";
import { Brief } from "@/modules/game/domain/brief/brief";
import { BriefRepository } from "@/modules/game/domain/brief/brief.repository";

@Injectable()
export class InMemoryBriefRepository implements BriefRepository {
	private briefs: Map<string, Brief> = new Map();

	async findById(id: string): Promise<Brief | null> {
		const brief = this.briefs.get(id);
		return brief || null;
	}

	async findAll(): Promise<Brief[]> {
		return Array.from(this.briefs.values());
	}

	async findRandom(): Promise<Brief | null> {
		const briefs = Array.from(this.briefs.values());
		if (briefs.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * briefs.length);
		return briefs[randomIndex];
	}

	async save(brief: Brief): Promise<Brief> {
		this.briefs.set(brief.id, brief);
		return brief;
	}

	setBrief(brief: Brief): void {
		this.briefs.set(brief.id, brief);
	}

	setBriefs(briefs: Brief[]): void {
		this.briefs.clear();
		briefs.forEach((brief) => {
			this.briefs.set(brief.id, brief);
		});
	}

	clear(): void {
		this.briefs.clear();
	}
}
