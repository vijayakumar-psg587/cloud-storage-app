import * as path from 'path';
import {
	APP_DEFAULT_TIMESTAMP_FORMAT,
	APP_SERVER_ZONE,
	CHAR_COLON,
	CHAR_HYPEN,
	CHAR_ZERO,
	ENV_NAME_DEV,
	GCLOUD_CONN_MAX_RETRIES,
	GCLOUD_KEY_FILE,
	GCLOUD_PRJ_ID,
	GCLOUD_STROAGE_SCOPE,
} from '../util/app.constants';
import  moment from 'moment';
import momentTime from 'moment-timezone';
import { AuthenticationModel } from '../models/authentication.model';


class GcloudAuthenticationModel implements AuthenticationModel {
	keyFile?: string;
	keyFilename?: string;
	autoRetry?: boolean;
	projectId?: string;
	apiEndpoint?: string;
	maxRetries?: number;
	client_id?: string;
	client_secret?: string;
	scope?: string[];
	email?: string;
}

export class AppUtilService {
	getCurrentLocaleTimeZone = (): string => {
		// always construct to a timezone of server. lets have UTC as the timestamp
		// now get the UNIX timestamo
		const timestampUNIX: number = Date.now();
		// convert that to UTC
		const timestampUTC = new Date(timestampUNIX * 1000);
		const month =
			timestampUTC.getMonth() < 10
				? CHAR_ZERO + timestampUTC.getUTCMonth()
				: '' + timestampUTC.getUTCMonth();
		const day =
			timestampUTC.getUTCDay() < 10
				? CHAR_ZERO + timestampUTC.getUTCDay()
				: '' + timestampUTC.getUTCDay();
		const hours =
			timestampUTC.getUTCHours() < 10
				? CHAR_ZERO + timestampUTC.getUTCHours()
				: '' + timestampUTC.getUTCHours();
		const minutes =
			timestampUTC.getUTCMinutes() < 10
				? CHAR_ZERO + timestampUTC.getUTCMinutes()
				: '' + timestampUTC.getUTCMinutes();
		const secs =
			timestampUTC.getUTCSeconds() < 10
				? CHAR_ZERO + timestampUTC.getUTCSeconds()
				: '' + timestampUTC.getUTCSeconds();
		const milliSec =
			timestampUTC.getUTCMilliseconds() < 10
				? CHAR_ZERO + timestampUTC.getUTCMilliseconds()
				: '' + timestampUTC.getUTCMilliseconds();
		return (
			timestampUTC.getUTCFullYear() +
			CHAR_HYPEN +
			month +
			CHAR_HYPEN +
			day +
			' ' +
			hours +
			CHAR_COLON +
			minutes +
			CHAR_COLON +
			secs +
			CHAR_COLON +
			milliSec
		);
	};

	getUTCTimeStamp(serverZone:string): string {
		serverZone = serverZone === null ? APP_SERVER_ZONE: serverZone;

		return momentTime().tz(serverZone)
			.format(APP_DEFAULT_TIMESTAMP_FORMAT);
	}

	getGeneralUTCTimeStamp(): string {
		return momentTime()
			.format(APP_DEFAULT_TIMESTAMP_FORMAT);
	}

	isNullOrUndefined(object: any) {
		if (object != null && object != undefined) return false;
		else return true;
	}

	getFileName(fileNameString: string) {
		if (fileNameString) {
			return fileNameString.substring(
				fileNameString.lastIndexOf(path.sep) + 1,
				fileNameString.length - 3
			);
		} else {
			return 'Unnamed file';
		}
	}

	isDevEnv() {
		let flag;
		this.isNullOrUndefined(process.env.NODE_ENV)
			? (flag = false)
			: (flag = process.env.NODE_ENV === ENV_NAME_DEV);
		return flag;
	}

	getGcloudAuthModel(): AuthenticationModel {
		const authModel: GcloudAuthenticationModel = new GcloudAuthenticationModel();
		authModel.autoRetry = true;
		authModel.keyFilename = GCLOUD_KEY_FILE;
		authModel.projectId = GCLOUD_PRJ_ID;
		authModel.scope = GCLOUD_STROAGE_SCOPE;
		authModel.maxRetries = GCLOUD_CONN_MAX_RETRIES;
		return authModel;
	}
}
export const AppUtilServiceInstance = new AppUtilService();
