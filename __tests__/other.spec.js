/**
 * Created by xiaowei.wzw on 17/6/1.
 */
import update, { updateChain } from '../src/';
import obj from './obj';

test('other, exceptions', () => {
  expect(() => update.$set(obj, {}))
    .toThrowError('update: params are not valid');

  expect(() => update.$set(obj, {}, { test: 4 }))
    .toThrowError(`update's path param: Expected to be an array or string. Instead got object`);
});
