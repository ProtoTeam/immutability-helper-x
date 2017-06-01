/**
 * Created by xiaowei.wzw on 17/6/1.
 */
import update, { updateChain } from '../src/';

test('a.b.c', () => {
  const obj = {
    a: {
      b: {
        c: 1,
        d: 2,
        e: [3, 2, 1],
      }
    },
    f: 4,
  };

  // set a.b
  expect(update.$set(obj, 'a.b', { g: 5 })).toEqual({
    a: {
      b: {
        g: 5,
      }
    },
    f: 4,
  });

  // update.$push(object, 'arr', ['car', 'bus']);
  expect(update.$push(obj, 'a.b.e', ['car', 'bus'])).toEqual({
    a: {
      b: {
        c: 1,
        d: 2,
        e: [3, 2, 1, 'car', 'bus'],
      }
    },
    f: 4,
  });

  // update.$push(object, 'arr', 'car', 'bus');
  expect(update.$push(obj, 'a.b.e', 'car', 'bus')).toEqual({
    a: {
      b: {
        c: 1,
        d: 2,
        e: [3, 2, 1, 'car', 'bus'],
      }
    },
    f: 4,
  });

  //update.$apply(object, 'a.b', value => ++value);
  expect(update.$apply(obj, 'a.b.c', value => ++value)).toEqual({
    a: {
      b: {
        c: 2,
        d: 2,
        e: [3, 2, 1],
      }
    },
    f: 4,
  });
});