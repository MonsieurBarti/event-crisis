import { Catering } from "./catering";

export interface CateringRepository {
	findById(id: string): Promise<Catering | null>;
	findAll(): Promise<Catering[]>;
	findRandom(count: number): Promise<Catering[]>;
}
