import { YNetwork } from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

export const AuthService = {
  getCaptcha() {
    return YNetwork.post(`${ENDPOINT_BASE}/captchas/request`);
  },
  login(phoneNumber, captchaId, captchaText) {
    return YNetwork.post(`${ENDPOINT_BASE}/auth/login`, {
      phoneNumber,
      captchaId,
      captchaText
    });
  },
  register(phoneNumber, name, captchaId, captchaText) {
    return YNetwork.post(`${ENDPOINT_BASE}/auth/register`, {
      phoneNumber,
      name,
      captchaId,
      captchaText
    });
  },
  verify(phoneNumber, verificationCode) {
    return YNetwork.post(`${ENDPOINT_BASE}/auth/verify`, {
      phoneNumber,
      verificationCode
    });
  },
  getIdentity() {
    return YNetwork.get(`${ENDPOINT_BASE}/auth/identity`);
  },
  logout() {
    return YNetwork.post(`${ENDPOINT_BASE}/auth/logout`);
  }
};
