import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

const ENDPOINT_LOGIN = `${ENDPOINT_BASE}/auth/login`;
const ENDPOINT_REGISTER = `${ENDPOINT_BASE}/auth/register`;
const ENDPOINT_VERIFY = `${ENDPOINT_BASE}/auth/verify`;

export function login(phoneNumber) {
  return YNetwork.post(ENDPOINT_LOGIN, {
    phoneNumber
  });
}

export function register(phoneNumber, firstName, lastName) {
  return YNetwork.post(ENDPOINT_REGISTER, {
    phoneNumber,
    firstName,
    lastName
  });
}

export function verify(phoneNumber, verificationCode) {
  return YNetwork.post(ENDPOINT_VERIFY, {
    phoneNumber,
    verificationCode
  });
}
