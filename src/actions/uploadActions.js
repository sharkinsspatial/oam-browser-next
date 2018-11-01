import * as types from '../constants/action_types';

export function sendUpload(metadataFile, imageFile) {
  return {
    type: types.SEND_UPLOAD,
    payload: {
      metadataFile,
      imageFile,
      types: {
        successType: types.SEND_UPLOAD_SUCCEEDED,
        errorType: types.SEND_UPLOAD_FAILED
      }
    }
  };
}
