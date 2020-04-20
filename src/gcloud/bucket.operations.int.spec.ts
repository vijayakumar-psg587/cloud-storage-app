import { GcloudAuthenticationInstance } from '../common/services/gcloud.authentication';
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
import * as path from 'path';
import pump from 'pump';
import * as BucketOperations from './bucket.operations';
const { PassThrough } = require('stream');
const fsMock = jest.mock('fs');

const mockedFile = {
  name: 'dev.txt',
  createWriteStream: jest.fn().mockImplementation(() => {
    return fs.createWriteStream(path.resolve(process.cwd(), './tests/cloud-storage/sample-write.txt'));
  }),
  createReadStream: jest.fn().mockImplementation(() => {
    return fs.createReadStream(path.resolve(process.cwd(), './tests/cloud-storage/sample-read.txt'));
  }),
};
jest.mock('lodash', () => {
  return {
    find: jest.fn().mockImplementation(() => {
      return mockedFile;
    })
  };

});
const mockedBucket = {
  file: jest.fn(() => mockedFile),
  getFiles: jest.fn().mockImplementation(() => {
    const fileArray = new Array();
    fileArray.push(mockedFile);
    return fileArray;
  })
};

const mockedStorage = {
  bucket: jest.fn(() => mockedBucket)
};


jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn(() => mockedStorage)
  };
});

jest.mock('pump', () => {
  const mPump = { on: jest.fn() };
  return jest.fn(() => mPump);
});

describe('Test suite for testing bucket operations', () => {

  function cancelCloudStorageMock() {
    jest.unmock('@google-cloud/storage');
    jest.requireActual('@google-cloud/storage');
  }

  function cancelFsMock() {
    jest.unmock('fs');
    jest.requireActual('fs');
  }

  afterEach(() => {
    jest.clearAllMocks();
    //jest.restoreAllMocks();
  });
  test('test for uploadfiles - success', async (done) => {

    pump().on = jest.fn(function(this: any, event, callback) {
      if (event === 'finish') {
        callback();
      }
      return this;
    });
    const actual = await BucketOperations.uploadEnvFiles('dev');

    expect(actual).toEqual(
      expect.objectContaining({
        status: 'Success',
        code: 201,
      })
    );
    done();
  });


  test('test downloadEnvFiles  - success', async (done) => {
    jest.unmock('fs');
    const downloadRes =  await BucketOperations.downloadEnvFiles('dev');
    expect(downloadRes).toBeDefined();
    expect(downloadRes).toEqual(expect.objectContaining({code:200, status: 'Success'}));
    done();
  });

  test('test for uploadfiles- failure', async (done) => {
    cancelCloudStorageMock();
    const bucketStorageSpy = jest
      .spyOn(GcloudAuthenticationInstance, 'createGcloudAuthenticationBucket')
      .mockImplementation(() => {
        return new Storage({
          projectId: 'testId',
          keyFilename: path.resolve(process.cwd(), './tests/cloud-storage/sample-read.txt'),
          scopes: ['testScope'],
          autoRetry: false,
        });
      });

    const mockReadable = new PassThrough();
    const mockWritable = new PassThrough();
    fs.createWriteStream = jest.fn().mockReturnValue(mockWritable);
    fs.createReadStream = jest.fn().mockReturnValue(mockReadable);
    pump().on = jest.fn(function(this: any, event, callback) {
      if (event === 'error') {
        callback();
      }
      return this;
    });
    const actual = BucketOperations.uploadEnvFiles('prod');
    expect(actual).rejects.toEqual(
      expect.objectContaining({
        status: 'Error',
        code: 500,
      })
    );
    expect(bucketStorageSpy).toHaveBeenCalledTimes(1);
    done();
  });

  test('test download - make the actual call - rej with auth error', async (done) => {
    cancelCloudStorageMock();
    console.dir(Storage);
    const mockReadable = new PassThrough();
    const mockWritable = new PassThrough();
    fs.createWriteStream = jest.fn().mockReturnValue(mockWritable);
    fs.createReadStream = jest.fn().mockReturnValue(mockReadable);
    const createGcloudAuthenticationBucketSpy = jest
      .spyOn(GcloudAuthenticationInstance, 'createGcloudAuthenticationBucket')
      .mockImplementation(() => {
        return new Storage();
      });
    try {
      await BucketOperations.downloadEnvFiles('dev');
    } catch (err) {
      expect(err.code).toBe(500);
      expect(err.status).toBe('Error');
    }

    expect(createGcloudAuthenticationBucketSpy).toHaveBeenCalledTimes(1);
    createGcloudAuthenticationBucketSpy.mockReset();
    done();
  });
});
