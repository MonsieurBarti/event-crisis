import { Entertainment } from "./entertainment";

export interface EntertainmentRepository {
	findById(id: string): Promise<Entertainment | null>;
	findAll(): Promise<Entertainment[]>;
	findRandom(count: number): Promise<Entertainment[]>;
}
