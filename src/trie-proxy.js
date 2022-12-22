const util = require('@ethereumjs/util');

/**
 * proxy apply trap define this in proxy itself
 * - rebind this inside get trap
 *   so the internal methods of target will functions correctly
 *
 * https://stackoverflow.com/questions/37092179/javascript-proxy-objects-dont-work
 */

const proxyHandler = {
  get: (target, name, receiver) => {
    if (typeof target[name] === 'function') {
      return function (...argumentsList) {
        const thisVal = this === receiver ? target : this;

        // check for get
        if (name === 'get') {
          let transformedKey = argumentsList[0];

          if (!Buffer.isBuffer(transformedKey)) {
            const parsedKey = JSON.stringify(transformedKey);
            argumentsList[0] = Buffer.from(parsedKey);
          }

          return Reflect.apply(target[name], thisVal, argumentsList).then(
            (res) => res && JSON.parse(res.toString())
          );
        }

        // check for put
        if (name === 'put') {
          let transformedKey = argumentsList[0];
          let transformedVal = argumentsList[1];
          if (!transformedKey || !transformedVal)
            throw new Error('Falsy values are not allowed for key and value');

          if (!Buffer.isBuffer(transformedKey)) {
            const parsedKey = JSON.stringify(transformedKey);
            argumentsList[0] = Buffer.from(parsedKey);
          }

          if (!Buffer.isBuffer(transformedVal)) {
            const parsedVal = JSON.stringify(transformedVal);
            argumentsList[1] = Buffer.from(parsedVal);
          }
        }

        return Reflect.apply(target[name], thisVal, argumentsList);
      };
    }
    if (name === 'root') return util.bufferToHex(target[name]);
    return Reflect.get(target, name, receiver);
  },
  set: (target, name, value, receiver) => {
    if (name === 'root') {
      let changedVal = value;
      if (!Buffer.isBuffer(value)) {
        changedVal = Buffer.from(util.stripHexPrefix(value), 'hex');
      }
      return (target[name] = changedVal);
    }
    return Reflect.set(target, name, changedVal, receiver);
  }
};

module.exports = proxyHandler;
