import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

const ENDPOINT_LOGIN = `${ENDPOINT_BASE}/auth/login`;
const ENDPOINT_REGISTER = `${ENDPOINT_BASE}/auth/register`;
const ENDPOINT_VERIFY = `${ENDPOINT_BASE}/auth/verify`;

export async function login(phoneNumber) {
    
  const payload = {
    phoneNumber
  };

  return YNetwork.post(ENDPOINT_LOGIN, payload);

}

export async function register(phoneNumber, firstName, lastName) {
  
  const payload = {
    phoneNumber,
    firstName,
    lastName
  };
  
  return YNetwork.post(ENDPOINT_REGISTER, payload);

}

export async function verify(phoneNumber, verificationCode) {
    
  const payload = {
    phoneNumber,
    verificationCode
  };

  return YNetwork.post(ENDPOINT_VERIFY, payload);

}
