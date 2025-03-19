import { Injectable } from "@nestjs/common";
import { EntertainmentRepository } from "@/modules/game/domain/entertainment/entertainment.repository";
import { Entertainment } from "@/modules/game/domain/entertainment/entertainment";

@Injectable()
export class InMemoryEntertainmentRepository implements EntertainmentRepository {
	private entertainments: Map<string, Entertainment> = new Map();

	setEntertainment(entertainment: Entertainment): void {
		this.entertainments.set(entertainment.id, entertainment);
	}

	clear(): void {
		this.entertainments.clear();
	}

	async save(entertainment: Entertainment): Promise<Entertainment> {
		this.entertainments.set(entertainment.id, entertainment);
		return entertainment;
	}

	async findById(id: string): Promise<Entertainment | null> {
		const entertainment = this.entertainments.get(id);
		return entertainment || null;
	}

	async findAll(): Promise<Entertainment[]> {
		return Array.from(this.entertainments.values());
	}

	async findRandom(count: number): Promise<Entertainment[]> {
		const all = await this.findAll();
		if (all.length <= count) return all;

		const shuffled = [...all].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	}
}
