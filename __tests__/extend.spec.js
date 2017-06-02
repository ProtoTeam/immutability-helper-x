import update from '../src/';
import obj from './obj';
import { reservedNames } from '../src/chainable';

test('extend method', () => {
  update.extend('$increment', function (key, original) {
    const newData = Object.assign({}, original);
    newData[key]++;
    return newData;
  });
  expect(update.$increment(obj, 'a.b', 'c')).toEqual({
    a: {
      b: {
        c: 2,
        d: 2,
        e: [3, 2, 1],
      }
    },
    f: 4,
  });

  reservedNames.forEach(name => {
    expect(() => update.extend(name, () => 1)).toThrowError(`update extend error: ${name} is reserved`);
  });
});
