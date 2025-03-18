import { Module } from "@nestjs/common";
import { GameApplicationModule } from "./application/game.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule, GameApplicationModule],
})
export class GameModule {}
