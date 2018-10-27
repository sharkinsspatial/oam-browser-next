import buffer from 'buffer';
import crypto from 'crypto';
import Evaporate from 'evaporate';
import { getToken } from '../utils/tokens';
import { SEND_UPLOAD } from '../constants/action_types';

const upload = async (metadataFile, imageFile) => {
  const token = `Bearer ${getToken()}`;
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
    }
  });
  try {
    await evaporate.add({
      name: imageFile.name,
      file: imageFile
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
  if (action.type !== SEND_UPLOAD) {
    return next(action);
  }
  const { metadataFile, imageFile } = action.payload;

  return upload(metadataFile, imageFile);
};

export default uploadMiddleware;
