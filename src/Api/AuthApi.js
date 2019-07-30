import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

const ENDPOINT_LOGIN = `${ENDPOINT_BASE}/auth/login`;

export async function login(phoneNumber) {
    
    const payload = {
        phoneNumber
    };

    return YNetwork.post(ENDPOINT_LOGIN, payload);

}
