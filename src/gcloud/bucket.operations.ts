import { GcloudAuthenticationInstance } from '../common/services/gcloud.authentication';
import * as fs from 'fs';
import pump from 'pump';
import pino from 'pino';
import * as _ from 'lodash';

import {
	ENV_NAME_DEV,
	GCLOUD_DATABASE_BUCKET_DEV,
	GCLOUD_DATABASE_BUCKET_PROD,
	GCLOUD_ENV_STR_BUCKET_NAME,
	GCLOUD_STORED_FILE_NAME_DEV,
	GCLOUD_STORED_FILE_NAME_PROD,
	GCLOUD_UPLOAD_FILE_DEV_LOCAL_PATH,
	GCLOUD_UPLOAD_FILE_PROD_LOCAL_PATH,
} from '../common/util/app.constants';
import { PinoLoggerServiceInstance } from '../common/services/pino.logger.service';
import { AppUtilServiceInstance } from '../common/services/app.util.service';
export async function uploadEnvFiles(env_name: string) {
	const LOGGER: pino.Logger = PinoLoggerServiceInstance.getLogger(__filename);

	return new Promise(async (res, rej) => {
		const str = GcloudAuthenticationInstance.createGcloudAuthenticationBucket();

		const bucketToUpload = GCLOUD_ENV_STR_BUCKET_NAME;
		let uploadLocalFilePath;
		let destinationBucketPath;
		if (!AppUtilServiceInstance.isNullOrUndefined(env_name)) {
			uploadLocalFilePath =
				ENV_NAME_DEV === env_name
					? GCLOUD_UPLOAD_FILE_DEV_LOCAL_PATH
					: GCLOUD_UPLOAD_FILE_PROD_LOCAL_PATH;
			destinationBucketPath =
				ENV_NAME_DEV === env_name ? GCLOUD_DATABASE_BUCKET_DEV : GCLOUD_DATABASE_BUCKET_PROD;
		}
		LOGGER.info('after authentication');
		pump(
			fs.createReadStream(uploadLocalFilePath),
			str
				.bucket(bucketToUpload)
				.file(destinationBucketPath)
				.createWriteStream({
					gzip: true,
					public: true,
					resumable: true,
				})
		)
			.on('error', (err) => {
				LOGGER.error('Error occured in uploading:', err);
				rej({ status: 'Error', error: err, code: 500 });
			})
			.on('finish', () => {
				LOGGER.info('Successfully uploaded the file');
				res({ status: 'Success', code: 201, error: null });
			});
	});
}

export async function downloadEnvFiles(env_name): Promise<any> {
	const LOGGER: pino.Logger = PinoLoggerServiceInstance.getLogger(__filename);

	return new Promise(async (res, rej) => {
		const str = GcloudAuthenticationInstance.createGcloudAuthenticationBucket();
		try {
			const [files] = await str.bucket(GCLOUD_ENV_STR_BUCKET_NAME).getFiles();
			const filteredFile =
				ENV_NAME_DEV === env_name
					? _.find(files, (file) => {
							return file.name.includes(GCLOUD_STORED_FILE_NAME_DEV);
					  })
					: _.find(files, (file) => {
							return file.name.includes(GCLOUD_STORED_FILE_NAME_PROD);
					  });
			res({
				status: 'Success',
				code: 200,
				error: null,
				stream: str
					.bucket(GCLOUD_ENV_STR_BUCKET_NAME)
					.file(filteredFile.name)
					.createReadStream(),
			});
		} catch (err) {
			LOGGER.error('Error in retrieving files from gcloud', err);
			rej({ status: 'Error', error: err, code: 500 });
		}
	});
}
