import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

const ENDPOINT_ROOT = `${ENDPOINT_BASE}/paytickets`;

export function verifyTicket(ticketId) {
  return YNetwork.post(`${ENDPOINT_ROOT}/verify/${ticketId}`);
}
