import React from 'react';
import { useUploadNewAttachmentMutation } from '../../services/attachmentSlice/attachmentSlice';
import './styles.css';

/*  HEY FRONTEND DEVELOPER. :)
** This is just a component Jordan built to make sure his backend for uploading attachments works.
** Feel free to rework this component for the real Attachment uploading functionality
*/
const AttachmentUpload = () => {
  const [uploadAttachmentMutation] = useUploadNewAttachmentMutation();
  const uploadAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isFileSizeValid = file.size <= 20971520; // This is exactly 20MB. (1KB == 1024B and 1MB == 1024 KB)
      if (isFileSizeValid) {
        const data = new FormData();
        data.append('file', file);
        const sepID = 1;
        // task ID is optional
        uploadAttachmentMutation({ sepID, data });
      }
    }
  }
  return (
    <>
      <input onChange={uploadAttachment} type="file" name="attachment" />
      <div id="input-area">Click here or drag a file to upload</div>
    </>
  );
};

export default AttachmentUpload;
