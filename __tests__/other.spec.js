/**
 * Created by xiaowei.wzw on 17/6/1.
 */
import update, { updateChain } from '../src/';

test('other, exceptions', () => {
  const obj = [1, 2, 3];
  expect(() => update.$set(obj, {})).toThrowError(`update: params are not valid`);

  // TODO need to update
});