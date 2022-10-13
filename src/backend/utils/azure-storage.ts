import { BlobServiceClient } from '@azure/storage-blob';
import { PassThrough } from 'stream';

let blobServiceClient: BlobServiceClient;
/** Returns the blobServiceClient. If it does not exist, the blobServiceClient will be created and returned. */
export const getBlobServiceClient = () => {
    if (blobServiceClient) {
        return blobServiceClient;
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING as string
    );
    return blobServiceClient;
}

/** Gets a container by sepID if it exists. If the container does not exist, this function will create the container and return it. */
export const getContainer = async (sepID: number) => {
    const blobServiceClient = getBlobServiceClient();
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(`sep-${sepID}`);
    // Container does not exist, create it!
    await containerClient.createIfNotExists();
    return containerClient;
};

/** Returns a blob by attachment id and sep id */
export const downloadBlob = async (sepID: number, attachmentID: number) => {
    const containerClient = await getContainer(sepID);
    const blockBlobClient = containerClient.getBlockBlobClient(attachmentID.toString());
    const downloadBlockBlobResponse = await blockBlobClient.download();
    return downloadBlockBlobResponse;
}

/** Deletes a container by sep id */
export const deleteContainer = async (sepID: number) => {
    const container = await getContainer(sepID);
    await container.deleteIfExists();
    return sepID;
}

/** Returns a writeable stream to upload a blob to a container for a given sepID and attachment id */
export const getUploadStream = async (sepID: number, attachmentID: number) => {
    const container = await getContainer(sepID);
    const blockBlobClient = container.getBlockBlobClient(attachmentID.toString());
    const stream = new PassThrough()
    blockBlobClient.uploadStream(stream);
    return stream;
}

/** Deletes a blob for a given sepID and attachment id */
export const deleteBlob = async (sepID: number, attachmentID: number) => {
    const container = await getContainer(sepID);
    const blockBlobClient = container.getBlockBlobClient(attachmentID.toString());
    await blockBlobClient.delete();
    return attachmentID;
}
