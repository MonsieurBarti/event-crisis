import { Venue } from "@/modules/game/domain/venue/venue";
import { Prisma } from "@/modules/shared/database";

type DatabaseVenue = Prisma.VenueGetPayload<true>;

export class VenueMapper {
	static toDomain(prismaVenue: DatabaseVenue): Venue {
		return Venue.create({
			id: prismaVenue.id,
			name: prismaVenue.name,
			description: prismaVenue.description,
			cost: prismaVenue.cost,
		});
	}

	static toPersistence(venue: Venue): DatabaseVenue {
		return {
			id: venue.id,
			name: venue.name,
			description: venue.description,
			cost: venue.cost,
		};
	}
}
