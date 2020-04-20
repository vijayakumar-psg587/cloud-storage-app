import { AppUtilServiceInstance } from './app.util.service';
import moment from 'moment';
import mock from 'mock-fs';
import { AuthenticationModel } from '../models/authentication.model';

describe('New Test suite for util service', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	afterAll(() => {
		jest.clearAllMocks();
		jest.resetModules();
		mock.restore();
	});

	test('testing general getUTC time -  actual momentimezone call', () => {
		const timestamp = AppUtilServiceInstance.getUTCTimeStamp('Asia/Calcutta');
		const expectedDateString = moment(new Date(Date.now()).toISOString())
			.tz('Asia/Calcutta')
			.format('YYYY-DD-MM hh:mm:ss.SSSS');
		expect(timestamp).toBeDefined();
		expect(timestamp).toMatchSnapshot(expectedDateString);
	});

	test('testing getGcloudAuthModel method', () => {
		const resultModel: AuthenticationModel = AppUtilServiceInstance.getGcloudAuthModel();
		expect(resultModel).toBeDefined();
	});

	test('testing getFile method with input', () => {
		const result = AppUtilServiceInstance.getFileName('/test/path/fileName.ts');
		const expectedResult = 'fileName';
		expect(result).toEqual(expectedResult);
	});

  test('testing getFile method w/o input', () => {
    const result = AppUtilServiceInstance.getFileName(null);
    const expectedResult = 'Unnamed file';
    expect(result).toEqual(expectedResult);
  });
});
