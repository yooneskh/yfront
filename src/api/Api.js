import { YNetwork } from 'ynetwork';

export const ApiHelper = {
  setToken(token) {
    YNetwork.applyHeader('Authorization', token);
  }
};
