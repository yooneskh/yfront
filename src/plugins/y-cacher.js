const cache = new Map();
const preempts = new Map();

function clone(thing) {
  return JSON.parse(JSON.stringify(thing));
}

export const YCacher = {
  has(keys) {
    return cache.has(keys.join('.')) || preempts.has(keys.join('.'));
  },
  set(keys, value) {
    cache.set(keys.join('.'), clone(value));
  },
  async get(keys) {
    if (cache.has(keys.join('.'))) {
      return clone( cache.get(keys.join('.')) );
    }
    else if (preempts.has(keys.join('.'))) {
      return clone( await preempts.get(keys.join('.')) );
    }
  },
  delete(keys) {
    cache.delete(keys.join('.'));
  },
  preempt(keys, promise) {

    if (cache.has(keys.join('.'))) {
      return this.get(keys.join('.'));
    }

    if (preempts.has(keys.join('.'))) {
      return preempts.get(keys.join('.'));
    }

    const preemptPromise = new Promise(resolve => {
      promise().then(result => {

        this.set(keys, result);
        preempts.delete(keys);

        resolve(this.get(keys));

      });
    });

    preempts.set(keys.join('.'), preemptPromise);
    return preemptPromise;

  }
};
