
const storageBlob = require('@azure/storage-blob');
const originalModule = jest.requireActual('@azure/storage-blob');

storageBlob.BlobServiceClient = {
    fromConnectionString: () => ({
        getContainerClient: () => ({
            getBlockBlobClient: () => ({
                download: jest.fn(() => ({
                    readableStreamBody: {
                        // ...originalModule.readableStreamBody,
                        pipe: jest.fn(()=>'downloadResponse'),
                        on: (event:string, callback:any)=>{callback()},
                        
                    }
                })),
                uploadStream: jest.fn(() => 'uploadResponse'),
                delete: jest.fn()
            }),
            createIfNotExists: jest.fn(),
            deleteIfExists: jest.fn()
        })
    })
};
module.exports = storageBlob;