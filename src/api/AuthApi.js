import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

export function login(phoneNumber) {
  return YNetwork.post(`${ENDPOINT_BASE}/auth/login`, {
    phoneNumber
  });
}

export function register(phoneNumber, name) {
  return YNetwork.post(`${ENDPOINT_BASE}/auth/register`, {
    phoneNumber,
    name
  });
}

export function verify(phoneNumber, verificationCode) {
  return YNetwork.post(`${ENDPOINT_BASE}/auth/verify`, {
    phoneNumber,
    verificationCode
  });
}
