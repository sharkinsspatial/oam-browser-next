import * as types from '../constants/action_types';

export function sendUpload(values) {
  return {
    type: types.SEND_UPLOAD,
    payload: {
      values,
      types: {
        successType: types.SEND_UPLOAD_SUCCEEDED,
        errorType: types.SEND_UPLOAD_FAILED
      }
    }
  };
}

export function uploadProgress(id, progress) {
  return {
    type: types.UPLOAD_PROGRESS,
    payload: {
      id,
      progress
    }
  };
}
