import { Brief } from "./brief";

export interface BriefRepository {
	findById(id: string): Promise<Brief | null>;
	findAll(): Promise<Brief[]>;
	findRandom(): Promise<Brief | null>;
	save(brief: Brief): Promise<Brief>;
}
