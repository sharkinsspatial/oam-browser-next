/* global File */
import buffer from 'buffer';
import crypto from 'crypto';
import Evaporate from 'evaporate';
import uuid from 'uuid/v1';
import { getToken } from '../utils/tokens';
import { setHasValidToken } from '../actions/authActions';
import { startUpload, uploadProgress } from '../actions/uploadActions';
import { SEND_UPLOAD } from '../constants/action_types';

const renameImageFile = (imageFile, id) => {
  const extension = imageFile.name.split('.').pop();
  const idFileName = `${id}.${extension}`;
  const idFile = new File([imageFile], idFileName, { type: imageFile.type });
  return idFile;
};

const createMetadataFile = (values, id) => {
  const metadata = JSON.stringify(values, null, 2);
  const metadataFile = new File([metadata], `${id}.json`,
    { type: 'application/json' });
  return metadataFile;
};

const upload = async (values, token, store) => {
  const signerUrl = `${process.env.REACT_APP_API_URL}/signupload`;
  const bucket = process.env.REACT_APP_UPLOAD_BUCKET;
  const awsKey = process.env.REACT_APP_AWS_KEY;
  const { Buffer } = buffer;
  const evaporate = await Evaporate.create({
    aws_key: awsKey,
    signerUrl,
    bucket,
    computeContentMd5: true,
    cryptoMd5Method: data => (
      crypto.createHash('md5').update(Buffer.from(data)).digest('base64')
    ),
    cryptoHexEncodedHash256: data => (
      crypto.createHash('sha256').update(Buffer.from(data)).digest('hex')
    ),
    cloudfront: false,
    xhrWithCredentials: false,
    signHeaders: {
      Authorization: token
    },
    progressIntervalMS: 3000
  });
  try {
    const id = uuid();
    const imageFile = renameImageFile(values.file, id);
    const metadataFile = createMetadataFile(values, id);
    await evaporate.add({
      name: imageFile.name,
      file: imageFile,
      started: () => {
        const { name } = values.file;
        store.dispatch(startUpload(id, name));
      },
      progress: (progress) => {
        const p = progress * 100;
        store.dispatch(uploadProgress(id, p));
      },
    });

    await evaporate.add({
      name: metadataFile.name,
      file: metadataFile
    });
  } catch (err) {
    console.log(err);
  }
};

const uploadMiddleware = store => next => (action) => {
  let returnValue;
  if (action.type !== SEND_UPLOAD) {
    returnValue = next(action);
  } else {
    const token = getToken();
    if (!token) {
      returnValue = store.dispatch(setHasValidToken(false));
    } else {
      const { values } = action.payload;
      returnValue = upload(values, `Bearer ${token}`, store);
    }
  }
  return returnValue;
};

export default uploadMiddleware;
