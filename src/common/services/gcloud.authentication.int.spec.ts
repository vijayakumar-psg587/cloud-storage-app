import { GcloudAuthenticationInstance } from "./gcloud.authentication";
import { Storage } from "@google-cloud/storage";
import * as path from "path";

describe('Test suite for Gcloud authentication storage', () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });
  test('Test for creatingGcloudAutnInstanceStorage', async(done) => {
    jest.spyOn(GcloudAuthenticationInstance, 'createGcloudAuthenticationBucket')
      .mockImplementation(() => {
        return new Storage({
          projectId: 'testId',
          keyFilename: path.resolve(process.cwd(), './tests/cloud-storage/sample-read.txt'),
          scopes: ['testScope'],
          autoRetry: false
        });
      });
    const res = GcloudAuthenticationInstance.createGcloudAuthenticationBucket();
    await expect(res).toBeInstanceOf(Storage);
    done();
  });
});
