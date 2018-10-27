import * as types from '../constants/action_types';

export function sendUpload(metadataFile, imageFile) {
  return {
    type: types.SEND_UPLOAD,
    payload: {
      metadataFile,
      imageFile
    }
  };
}
