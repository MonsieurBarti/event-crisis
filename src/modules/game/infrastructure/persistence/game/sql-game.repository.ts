import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/game/../shared/prisma/prisma.service";
import { GameMapper } from "./game.mapper";
import { GameRepository } from "@/modules/game/domain/game/game.repository";
import { Game } from "@/modules/game/domain/game/game";

@Injectable()
export class SqlGameRepository implements GameRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Game | null> {
		const game = await this.prisma.game.findUnique({
			where: { id },
		});

		if (!game) {
			return null;
		}

		return GameMapper.toDomain(game);
	}

	async findActiveByPlayerId(playerId: string): Promise<Game | null> {
		const game = await this.prisma.game.findFirst({
			where: {
				playerId,
				isCompleted: false,
			},
		});

		if (!game) {
			return null;
		}

		return GameMapper.toDomain(game);
	}

	async save(game: Game): Promise<Game> {
		const persistenceGame = GameMapper.toPersistence(game);

		const savedGame = await this.prisma.game.upsert({
			where: { id: persistenceGame.id },
			update: persistenceGame,
			create: persistenceGame,
		});

		return GameMapper.toDomain(savedGame);
	}

	async delete(id: string): Promise<void> {
		await this.prisma.game.delete({
			where: { id },
		});
	}
}
