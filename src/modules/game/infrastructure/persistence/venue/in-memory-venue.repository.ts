import { Injectable } from "@nestjs/common";
import { VenueRepository } from "@/modules/game/domain/venue/venue.repository";
import { Venue } from "@/modules/game/domain/venue/venue";

@Injectable()
export class InMemoryVenueRepository implements VenueRepository {
	private venues: Map<string, Venue> = new Map();

	async findById(id: string): Promise<Venue | null> {
		return this.venues.get(id) || null;
	}

	async findAll(): Promise<Venue[]> {
		return Array.from(this.venues.values());
	}

	async findRandom(): Promise<Venue | null> {
		const venues = Array.from(this.venues.values());

		if (venues.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * venues.length);
		return venues[randomIndex];
	}

	async save(venue: Venue): Promise<Venue> {
		this.venues.set(venue.id, venue);
		return venue;
	}

	setVenue(venue: Venue): void {
		this.venues.set(venue.id, venue);
	}

	setVenues(venues: Venue[]): void {
		this.venues.clear();
		venues.forEach((venue) => {
			this.venues.set(venue.id, venue);
		});
	}

	clear(): void {
		this.venues.clear();
	}
}
