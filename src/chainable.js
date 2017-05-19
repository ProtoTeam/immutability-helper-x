class Chain {
  constructor(obj) {
    this.chain = [];
    this.data = obj;
  }

  value() {
    return this.chain.reduce((result, item) => {
      let res = result;
      res = this.update[item.methodName].apply(null, [result, item.path].concat(item.args));
      return res;
    }, this.data);
  }
}

export const reservedNames = ['data', 'value', 'update'];

export function addChainMethod(methodName) {
  Chain.prototype[methodName] = function (...args) {
    this.chain.push({
      methodName,
      path: args[0],
      args: args.slice(1),
    });
    return this;
  };
}

export default function chainable(update) {
  const methods = Object.keys(update);
  methods.forEach(methodName => addChainMethod(methodName));
  Chain.prototype.update = update;
  return Chain;
}
