import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { AppLoggerService } from "./modules/shared/logger/app-logger.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const logger = app.get(AppLoggerService).setContext("Bootstrap");
	const port = configService.get<number>("APP_PORT", 3000);

	await app.listen(port);
	logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
