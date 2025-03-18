import { Game } from "./game";

export interface GameRepository {
	findById(id: string): Promise<Game | null>;
	findActiveByPlayerId(playerId: string): Promise<Game | null>;
	save(game: Game): Promise<Game>;
	delete(id: string): Promise<void>;
}
