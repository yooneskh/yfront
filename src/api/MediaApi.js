import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

const ENDPOINT_INIT_UPLOAD = `${ENDPOINT_BASE}/medias/init/upload`;
export const ENDPOINT_UPLOAD_PATH = `${ENDPOINT_BASE}/medias/upload`;

export function initUpload(token, fileName, fileExtension, fileSize) {

  const payload = {
    token,
    fileName,
    fileExtension,
    fileSize
  };

  return YNetwork.post(ENDPOINT_INIT_UPLOAD, payload);

}