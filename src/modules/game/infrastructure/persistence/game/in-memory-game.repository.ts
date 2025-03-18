import { Injectable } from "@nestjs/common";
import { Game } from "@/modules/game/domain/game/game";
import { GameRepository } from "@/modules/game/domain/game/game.repository";

@Injectable()
export class InMemoryGameRepository implements GameRepository {
	private games: Map<string, Game> = new Map();

	async findById(id: string): Promise<Game | null> {
		const game = this.games.get(id);
		return game || null;
	}

	async findActiveByPlayerId(playerId: string): Promise<Game | null> {
		const games = Array.from(this.games.values());
		const activeGame = games.find((game) => game.playerId === playerId && !game.isCompleted);
		return activeGame || null;
	}

	async save(game: Game): Promise<Game> {
		this.games.set(game.id, game);
		return game;
	}

	async delete(id: string): Promise<void> {
		this.games.delete(id);
	}

	setActiveGame(game: Game): void {
		this.games.set(game.id, game);
	}

	setGames(games: Game[]): void {
		this.games.clear();
		games.forEach((game) => {
			this.games.set(game.id, game);
		});
	}

	clear(): void {
		this.games.clear();
	}
}
