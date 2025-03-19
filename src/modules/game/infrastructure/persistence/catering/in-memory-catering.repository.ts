import { Injectable } from "@nestjs/common";
import { CateringRepository } from "@/modules/game/domain/catering/catering.repository";
import { Catering } from "@/modules/game/domain/catering/catering";

@Injectable()
export class InMemoryCateringRepository implements CateringRepository {
	private caterings: Map<string, Catering> = new Map();

	setCatering(catering: Catering): void {
		this.caterings.set(catering.id, catering);
	}

	clear(): void {
		this.caterings.clear();
	}

	async save(catering: Catering): Promise<Catering> {
		this.caterings.set(catering.id, catering);
		return catering;
	}

	async findById(id: string): Promise<Catering | null> {
		const catering = this.caterings.get(id);
		return catering || null;
	}

	async findAll(): Promise<Catering[]> {
		return Array.from(this.caterings.values());
	}

	async findRandom(count: number): Promise<Catering[]> {
		const all = await this.findAll();
		if (all.length <= count) return all;

		const shuffled = [...all].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	}
}
