const cache = new Map();

export default {
  has(keys) {
    return cache.has(keys.join('.'));
  },
  set(keys, value) {
    cache.set(keys.join('.'), JSON.parse(JSON.stringify(value)));
  },
  get(keys) {
    return JSON.parse(JSON.stringify(cache.get(keys.join('.'))));
  }
};
