/**
 * @file expand the immutability-helper, to support update by path string, like the get/set in lodash
 * **********************************
 * update.$set(object, 'a.b', newValue);
 * // for the array methods like $push/$unshift, you can update it with two forms
 * update.$push(object, 'arr', ['car', 'bus']);
 * update.$apply(object, 'a.b', value => ++value);
 * **********************************
 * // also support extend method
 * // step 1
 * update.extend('$addtax', function(tax, original) {
 *   return original + (tax * original);
 * });
 * // step 2
 * update.$addtax(object, 'price', 0.8);
 * // or
 * update(object, {
 *   price: { $addtax: 0.8 },
 * });
 * **********************************
 * // chain api
 * const d = updateChain(data)
 * .$set('a.b.c', 444)
 * .$merge('a.b', {
 *   d: 555,
 * })
 * .$push('a.e', [4])
 * .$unshift('a.e', [0])
 * .$splice('a.e', [[1, 0, 8]])
 * .$apply('a.b.d', val => val + 100)
 * .value();
 */
import update from 'immutability-helper';
import chainable, {
  addChainMethod,
  reservedNames,
} from './chainable';

const isUndefined = v => (typeof v === 'undefined');
const isString = v => (typeof v === 'string');
const isArray = Array.isArray;

const createUpdatable = (methodName, path, value) => {
  const obj = { [methodName]: value };
  let realPath = path;
  if (!isString(realPath) && !isArray(realPath)) {
    throw new Error(`update's path param: Expected to be an array or string. Instead got ${typeof realPath}`);
  }
  if (isString(realPath)) {
    if (realPath.trim() === '') { return obj; }
    // [n] => .n
    realPath = realPath.replace(/(\[\d+\])/g, s => `.${s.slice(1, -1)}`);
    realPath = realPath.split('.');
  }
  return realPath.reduceRight((prev, node) => ({ [node]: prev }), obj);
};

const funcFactory = methodName => {
  reservedNames.forEach(name => {
    if (methodName === name) {
      throw new Error(`update extend error: ${methodName} is reserved`);
    }
  });
  update[methodName] = function (object, path, value) {
    if (arguments.length < 3 || isUndefined(object)) {
      throw new Error('update: params are not valid');
    }
    const updatable = createUpdatable(methodName, path, value);
    return update(object, updatable);
  };
  addChainMethod(methodName);
};

// inject
const methods = ['$set', '$merge', '$apply', '$splice', '$push', '$unshift'];
methods.forEach(funcFactory);

// override extend
const extendFunc = update.extend;
update.extend = (methodName, callback) => {
  extendFunc(methodName, callback);
  funcFactory(methodName);
};

const ChainableUpdate = chainable(update);

export function updateChain(data) {
  return new ChainableUpdate(data);
}

export default update;
