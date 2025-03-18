import { Venue } from "./venue";

export interface VenueRepository {
	findById(id: string): Promise<Venue | null>;
	findAll(): Promise<Venue[]>;
	findRandom(): Promise<Venue | null>;
	save(venue: Venue): Promise<Venue>;
}
