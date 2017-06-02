import update from '../src/';
import obj from './obj';

test('a.b.c', () => {
  // set a.b
  expect(update.$set(obj, ['a', 'b'], { g: 5 })).toEqual({
    a: {
      b: {
        g: 5,
      }
    },
    f: 4,
  });
});
