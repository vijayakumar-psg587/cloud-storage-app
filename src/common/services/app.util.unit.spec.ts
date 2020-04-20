import { AppUtilServiceInstance } from './app.util.service';
import momentTime from 'moment-timezone';
import mock from "mock-fs";

jest.mock('moment-timezone', () =>
	jest.fn().mockImplementation( ()=> (
		{
			format: () => '2018–01–30 12:34:56.0000'
		})));
const globalAny: any = global;
describe('Test suite for util service', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	// afterAll(() => {
	// 	jest.clearAllMocks();
	// 	jest.resetModules();
	// 	mock.restore();
	// });
	test('testing getCurrentLocalTime', () => {
		const localTime: string = AppUtilServiceInstance.getCurrentLocaleTimeZone();
		const utcString = new Date(Date.now() * 1000).toUTCString();

		expect(localTime).toBeDefined();
		expect(localTime.substr(localTime.lastIndexOf(':') + 1, localTime.length - 1)).toHaveLength(2);
		expect(localTime.substr(0, localTime.indexOf('-'))).toHaveLength(5);
		expect(localTime.substr(localTime.lastIndexOf('-') + 1, 2)).toHaveLength(2);
	});
	test('testing general getUTC time', () => {

		const timestamp = AppUtilServiceInstance.getGeneralUTCTimeStamp();
		expect(timestamp).toMatchSnapshot();
	});

	test('testing isDevEnv', () => {
		process.env.NODE_ENV = 'dev';
		let flag = AppUtilServiceInstance.isDevEnv();
		expect(flag).toBeTruthy();
		process.env.NODE_ENV = globalAny.ENV_JEST;
		flag = AppUtilServiceInstance.isDevEnv();
		expect(flag).toBeFalsy();
	});

	test('testing isNullOrUndefined', () => {
		expect(AppUtilServiceInstance.isNullOrUndefined(null)).toBeTruthy();
		expect(AppUtilServiceInstance.isNullOrUndefined(Object.create({}))).toBeFalsy();
	});
});

