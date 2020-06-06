import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

export const ENDPOINT_UPLOAD_PATH = `${ENDPOINT_BASE}/medias/upload`;

export function initUpload(fileName, fileExtension, fileSize) {

  const payload = {
    fileName,
    fileExtension,
    fileSize
  };

  return YNetwork.post( `${ENDPOINT_BASE}/medias/init/upload`, payload);

}

export function loadOne(mediaId) {
  return YNetwork.get(`${ENDPOINT_BASE}/medias/${mediaId}`);
}
