import YNetwork from 'ynetwork';

YNetwork.debug = true;

import * as Auth from './AuthApi';
import * as Media from './MediaApi';

export default {
  Auth,
  Media,
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
