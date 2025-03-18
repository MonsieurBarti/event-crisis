import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { VenueMapper } from "./venue.mapper";
import { VenueRepository } from "@/modules/game/domain/venue/venue.repository";
import { Venue } from "@/modules/game/domain/venue/venue";

@Injectable()
export class SqlVenueRepository implements VenueRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Venue | null> {
		const venue = await this.prisma.venue.findUnique({
			where: { id },
		});

		if (!venue) {
			return null;
		}

		return VenueMapper.toDomain(venue);
	}

	async findAll(): Promise<Venue[]> {
		const venues = await this.prisma.venue.findMany();
		return venues.map(VenueMapper.toDomain);
	}

	async findRandom(): Promise<Venue | null> {
		const venuesCount = await this.prisma.venue.count();

		if (venuesCount === 0) {
			return null;
		}

		const skip = Math.floor(Math.random() * venuesCount);
		const [randomVenue] = await this.prisma.venue.findMany({
			take: 1,
			skip: skip,
		});

		if (!randomVenue) {
			return null;
		}

		return VenueMapper.toDomain(randomVenue);
	}

	async save(venue: Venue): Promise<Venue> {
		const persistenceVenue = VenueMapper.toPersistence(venue);

		const savedVenue = await this.prisma.venue.upsert({
			where: { id: persistenceVenue.id },
			update: persistenceVenue,
			create: persistenceVenue,
		});

		return VenueMapper.toDomain(savedVenue);
	}
}
