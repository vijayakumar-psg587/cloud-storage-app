import * as pino from 'pino';
import * as _ from 'lodash';
import { PinoLoggerServiceInstance } from "./pino.logger.service";
import exp from "constants";
describe('Test suite for pino logging service', () => {
  test('testing getLogger', () => {
    const pinoLoggerInstance = PinoLoggerServiceInstance.getLogger('/test/path/sampleLogger.ts');
    console.dir(Object.getPrototypeOf(pinoLoggerInstance));
    _.map(Object.getOwnPropertySymbols(pinoLoggerInstance), (mapItems:any) => {
      if(mapItems.toString().includes('Symbol')) {
        if(mapItems.toString().includes('pino.level')) {
          expect(pinoLoggerInstance[mapItems]).toEqual(30);
        }
      }
      if(mapItems.toString().includes('pino.chindings')) {
        const childInstance = pinoLoggerInstance[mapItems].toString().substr(1);
        const jsonString  = '{'+ childInstance+ '}';
        const expectedObj = Object.create(JSON.parse(jsonString));
        expect(expectedObj.fileName).toEqual('sampleLogger');
        expect(expectedObj.appName).toEqual('CLOUD_AUTHENTICATOR');
        expect(expectedObj.connectorReqId).toContain('CLOUD_AUTHENTICATOR');
        expect(expectedObj.connectorReqId).toEqual(expect.objectContaining(new String('CLOUD_AUTHENTICATOR')));
      }
    });
  });
});
