/**
 * Created by xiaowei.wzw on 17/6/1.
 */
import update, { updateChain } from '../src/';

test('chain api', () => {
  const obj = {
    a: {
      b: {
        c: 1,
        d: 2,
        e: [3, 2, 1],
      },
      f: {g: 4},
      h: {i: 5},
    },
    j: 6,
  };

  const d = updateChain(obj)
    .$set('a.f', 8)
    .$merge('a.b', {
      z: 7,
    })
    .$push('a.b.e', [4])
    .$apply('a.b.d', val => val + 1)
    .value();

  // set a.b
  expect(d).toEqual({
    a: {
      b: {
        c: 1,
        d: 3,
        e: [3, 2, 1, 4],
        z: 7,
      },
      f: 8,
      h: {i: 5},
    },
    j: 6,
  });
});