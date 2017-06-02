/**
 * Created by xiaowei.wzw on 17/6/1.
 */
import update, { updateChain } from '../src/';
import obj from './obj';

test('chain api', () => {
  const newData = updateChain(obj)
    .$set('a.g', 8)
    .$merge('a.b', {
      z: 7,
    })
    .$push('a.b.e', [4])
    .$apply('a.b.d', val => val + 1)
    .value();

  expect(newData).toEqual({
    a: {
      b: {
        c: 1,
        d: 3,
        e: [3, 2, 1, 4],
        z: 7,
      },
      g: 8,
    },
    f: 4,
  });
});
