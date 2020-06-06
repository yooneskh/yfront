import YNetwork from 'ynetwork';

import * as Auth from './AuthApi';
import * as Media from './MediaApi';
import * as Payment from './PaymentApi';

export default {
  Auth,
  Media,
  Payment,
  setHeader(header, value) {
    if (value === undefined || value === '' || value === null) {
      delete YNetwork.headers[header];
    }
    else {
      YNetwork.headers[header] = value;
    }
  },
  setToken(token) {
    this.setHeader('Authorization', token);
  }
};
