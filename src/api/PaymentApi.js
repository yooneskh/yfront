import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from './ApiBaseEndpoints';

export function verifyTicket(ticketId) {
  return YNetwork.post(`${ENDPOINT_BASE}/paytickets/verify/${ticketId}`);
}
