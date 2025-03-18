import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GameModule } from "./modules/game/game.module";
import { LoggerModule } from "./modules/shared/logger/logger.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		LoggerModule,
		GameModule,
	],
})
export class AppModule {}
