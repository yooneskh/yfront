import YNetwork from 'ynetwork';

export const ApiHelper = {
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
