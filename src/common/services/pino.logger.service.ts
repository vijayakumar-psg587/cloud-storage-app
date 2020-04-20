import pino from "pino";
import { AppUtilServiceInstance } from "./app.util.service";
import { APP_LOG_CENSOR, APP_LOG_REDACT, APP_NAME, APP_SERVER_ZONE } from "../util/app.constants";
import * as uuid from "uuid";

export class PinoLoggerService {
	getLogger(fileName: string):pino.Logger {
		return pino({
			level: 'info',
			base: {
				pid: process.pid,
				platform: process.platform,
				fileName: AppUtilServiceInstance.getFileName(fileName),
				appName: APP_NAME,
				timestamp: AppUtilServiceInstance.getUTCTimeStamp(APP_SERVER_ZONE),
			},
			// timestamp: true,
			messageKey: JSON.stringify({ appName: APP_NAME }),
			useOnlyCustomLevels: false,
			redact: {
				paths: APP_LOG_REDACT,
				censor: APP_LOG_CENSOR,
			},
			prettyPrint: AppUtilServiceInstance.isDevEnv()
		}).child({
			connectorReqId: (APP_NAME === null ? 'local': APP_NAME)
				+uuid.v4().toString()
		});
	}
}

export const PinoLoggerServiceInstance = new PinoLoggerService();
