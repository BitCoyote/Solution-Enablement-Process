import { PassThrough } from 'stream';
import * as azureStorageUtils from './azure-storage';
describe('azure storage utils', () => {
  describe('getBlobServiceClient', () => {
    it('should return a new instance of BlobServiceClient when one does not exist yet', async () => {
      const result = azureStorageUtils.getBlobServiceClient();
      expect(result.getContainerClient).toBeDefined();
    });
    it('should return an existing instance of BlobServiceClient when one already exists', async () => {
      azureStorageUtils.getBlobServiceClient();
      const result = azureStorageUtils.getBlobServiceClient();
      expect(result.getContainerClient).toBeDefined();
    });
  });

  describe('getContainer', () => {
    it('should return an instance of ContainerClient ', async () => {
      const result = await azureStorageUtils.getContainer(1);
      expect(result.getBlockBlobClient).toBeDefined();
      expect(result.createIfNotExists).toBeDefined();
    });
  });
  describe('downloadBlob', () => {
    it('should download a blob ', async () => {
      const result = await azureStorageUtils.downloadBlob(1, 1);
      expect(result.readableStreamBody).toBeDefined();
    });
  });
  describe('deleteContainer', () => {
    it('should delete a container ', async () => {
      const result = await azureStorageUtils.deleteContainer(1);
      expect(result).toEqual(1);
    });
  });
  describe('getUploadStream', () => {
    it('should return an upload stream', async () => {
      const result = await azureStorageUtils.getUploadStream(1, 1);
      expect(result instanceof PassThrough).toBeTruthy();
    });
  });
  describe('deleteBlob', () => {
    it('should delete a blob', async () => {
      const result = await azureStorageUtils.deleteBlob(1, 1);
      expect(result).toEqual(1);
    });
  });
});
