import { Injectable, LoggerService, LogLevel } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppLoggerService implements LoggerService {
	private context?: string;
	private logLevels: LogLevel[];

	constructor(private readonly configService: ConfigService) {
		// Configure log levels based on environment
		this.logLevels = this.getLogLevels();
	}

	setContext(context: string): this {
		this.context = context;
		return this;
	}

	log(message: any, context?: string): void {
		if (this.isLogLevelEnabled("log")) {
			console.log(`[${this.getTimestamp()}] [${this.getContext(context)}] ${message}`);
		}
	}

	error(message: any, trace?: string, context?: string): void {
		if (this.isLogLevelEnabled("error")) {
			console.error(
				`[${this.getTimestamp()}] [${this.getContext(context)}] [ERROR] ${message}`,
				trace ? `\n${trace}` : "",
			);
		}
	}

	warn(message: any, context?: string): void {
		if (this.isLogLevelEnabled("warn")) {
			console.warn(
				`[${this.getTimestamp()}] [${this.getContext(context)}] [WARN] ${message}`,
			);
		}
	}

	debug(message: any, context?: string): void {
		if (this.isLogLevelEnabled("debug")) {
			console.debug(
				`[${this.getTimestamp()}] [${this.getContext(context)}] [DEBUG] ${message}`,
			);
		}
	}

	verbose(message: any, context?: string): void {
		if (this.isLogLevelEnabled("verbose")) {
			console.log(
				`[${this.getTimestamp()}] [${this.getContext(context)}] [VERBOSE] ${message}`,
			);
		}
	}

	private getContext(context?: string): string {
		return context || this.context || "Application";
	}

	private getTimestamp(): string {
		return new Date().toISOString();
	}

	private getLogLevels(): LogLevel[] {
		const env = this.configService.get<string>("NODE_ENV", "development");

		// In production, we might want to exclude debug and verbose logs
		if (env === "production") {
			return ["log", "error", "warn"];
		}

		// In development, we want all logs
		return ["log", "error", "warn", "debug", "verbose"];
	}

	private isLogLevelEnabled(level: LogLevel): boolean {
		return this.logLevels.includes(level);
	}
}
