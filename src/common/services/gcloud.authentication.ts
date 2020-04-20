import {Storage} from '@google-cloud/storage';
import { AuthenticationModel } from '../models/authentication.model';
import { AppUtilServiceInstance } from './app.util.service';
import * as pino from 'pino';
import { PinoLoggerServiceInstance } from './pino.logger.service';

export class GcloudAuthentication {
	private gcloudAuthModel: AuthenticationModel;
	private LOGGER: pino.Logger;
	constructor() {
		this.gcloudAuthModel = AppUtilServiceInstance.getGcloudAuthModel();
		this.LOGGER = PinoLoggerServiceInstance.getLogger(__filename);
	}

	createGcloudAuthenticationBucket():Storage {
		// @ts-ignore
		console.log(this.gcloudAuthModel);
		return new Storage({
			autoRetry: this.gcloudAuthModel.autoRetry,
			keyFilename: this.gcloudAuthModel.keyFilename,
			maxRetries: this.gcloudAuthModel.maxRetries,
			projectId: this.gcloudAuthModel.projectId,
			scopes: this.gcloudAuthModel.scope,
		});
	};
}
export const GcloudAuthenticationInstance = new GcloudAuthentication();
