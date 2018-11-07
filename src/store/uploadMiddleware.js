/* global File */
import buffer from 'buffer';
import crypto from 'crypto';
import Evaporate from 'evaporate';
import uuid from 'uuid/v1';
import { getToken, getTokenUserId } from '../utils/tokens';
import stacMapper from '../utils/stacMapper';
import { setHasValidToken } from '../actions/authActions';
import { uploadProgress } from '../actions/uploadActions';
import { SEND_UPLOAD } from '../constants/action_types';

const renameImageFile = (imageFile, id) => {
  const extension = imageFile.name.split('.').pop();
  const idFileName = `${id}.${extension}`;
  const idFile = new File([imageFile], idFileName, { type: imageFile.type });
  return idFile;
};

const createStacFile = (values, id, bucket, image, userid) => {
  const updatedValues = Object.assign({}, values, {
    id,
    userid,
    self: `s3://${bucket}/${id}.json`,
    imageUrl: `s3://${bucket}/${image.name}`,
    type: image.type
  });
  const stacItem = stacMapper(updatedValues);
  const stacItemString = JSON.stringify(stacItem, null, 2);
  const stacItemFile = new File([stacItemString], `${id}.json`,
    { type: 'application/json' });
  return stacItemFile;
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
      Authorization: `Bearer ${token}`
    },
    progressIntervalMS: 1000
  });
  try {
    const id = uuid();
    const imageFile = renameImageFile(values.file, id);
    const userid = getTokenUserId(token);
    const stacFile = createStacFile(values, id, bucket, imageFile, userid);
    await evaporate.add({
      name: imageFile.name,
      file: imageFile,
      progress: (progress) => {
        const p = progress * 100;
        store.dispatch(uploadProgress(id, p));
      },
    });

    await evaporate.add({
      name: stacFile.name,
      file: stacFile
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
      returnValue = upload(values, token, store);
    }
  }
  return returnValue;
};

export default uploadMiddleware;
