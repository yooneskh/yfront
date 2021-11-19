import { YNetwork } from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

export const AuthService = {
  getCaptcha() {
    return YNetwork.get(`${ENDPOINT_BASE}/captcha-tokens/generate/new`);
  },
  login(phoneNumber, captchaId, captchaText) {
    return YNetwork.post(
      `${ENDPOINT_BASE}/authentication/login`,
      {
        provider: 'phoneNumber',
        phoneNumber
      },
      {
        'captcha-id': captchaId,
        'captcha-text': captchaText
      }
    );
  },
  register(phoneNumber, name, captchaId, captchaText) {
    return YNetwork.post(
      `${ENDPOINT_BASE}/authentication/register`,
      {
        provider: 'phoneNumber',
        phoneNumber,
        name
      },
      {
        'captcha-id': captchaId,
        'captcha-text': captchaText
      }
    );
  },
  verify(verificationToken, verificationCode) {
    return YNetwork.post(`${ENDPOINT_BASE}/authentication/verify`, {
      provider: 'phoneNumber',
      verificationToken,
      verificationCode
    });
  },
  getIdentity(token) {
    return YNetwork.get(`${ENDPOINT_BASE}/authentication/identity`, undefined, token ? { Authorization: token } : undefined);
  },
  logout() {
    return YNetwork.post(`${ENDPOINT_BASE}/authentication/logout`);
  }
};
