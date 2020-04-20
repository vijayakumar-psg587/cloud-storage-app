import { Stream } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as BucketOperations from './bucket.operations';

const globalAny: any = global;
describe('Test suite for bucket functionality', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		// resetting will take the mocking done for the module;
		//jest.resetAllMocks();
	});
	afterAll(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		jest.resetAllMocks();
		jest.resetModules();
	});
	test('test upload by just stubs', async (done) => {
		const uploadSpy = jest
			.spyOn(BucketOperations, 'uploadEnvFiles')
			.mockImplementationOnce((any) => {
				return Promise.resolve('Done');
			});
		const result = BucketOperations.uploadEnvFiles('dev');
		expect(uploadSpy).toHaveBeenCalledTimes(1);
		await expect(result).resolves.toBeDefined();
		done();
	});
	test('test upload by just stubs -throw error', async (done) => {
		const uploadSpy = jest
			.spyOn(BucketOperations, 'uploadEnvFiles')
			.mockImplementationOnce((any) => {
				return Promise.reject('Cannot upload file');
			});
		const result = BucketOperations.uploadEnvFiles('dev');
		expect(uploadSpy).toHaveBeenCalledTimes(1);
		await expect(result).rejects.toBeDefined();
		done();
	});

	test('test download - stub the call', async (done) => {
		const downloadEnvSpy = jest
			.spyOn(BucketOperations, 'downloadEnvFiles')
			.mockImplementationOnce(() => {
				return Promise.resolve(
					fs.createReadStream(
						path.resolve(process.cwd(), './tests/cloud-storage/sample-read.txt')
					)
				);
			});
		const res = await BucketOperations.downloadEnvFiles('dev');
		expect(res).toBeDefined();
		expect(res).toBeInstanceOf(Stream);
		done();
	});
});
