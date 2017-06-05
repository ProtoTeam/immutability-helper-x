/**
 * Created by xiaowei.wzw on 17/6/5.
 *
 * The test code from https://github.com/kolodny/immutability-helper/blob/master/test.js
 * should be update from upstream Regularly
 */

import update from '../src/';


describe('update', function() {
  describe('$push', function() {
    test('pushes', function() {
      expect(update([1], {$push: [7]})).toEqual([1, 7]);
    });
    test('does not mutate the original object', function() {
      var obj = [1];
      update(obj, {$push: [7]});
      expect(obj).toEqual([1]);
    });
    test('only pushes an array', function() {
      expect(update.bind(null, [], {$push: 7})).toThrow(
        'update(): expected spec of $push to be an array; got 7. Did you ' +
        'forget to wrap your parameter in an array?'
      );
    });
    test('only pushes unto an array', function() {
      expect(update.bind(null, 1, {$push: 7})).toThrow(
        'update(): expected target of $push to be an array; got 1.'
      );
    });
    test('keeps reference equality when possible', function() {
      var original = ['x'];
      expect(update(original, {$push: []})).toBe(original)
    });
  });

  describe('$unshift', function() {
    test('unshifts', function() {
      expect(update([1], {$unshift: [7]})).toEqual([7, 1]);
    });
    test('does not mutate the original object', function() {
      var obj = [1];
      update(obj, {$unshift: [7]});
      expect(obj).toEqual([1]);
    });
    test('only unshifts an array', function() {
      expect(update.bind(null, [], {$unshift: 7})).toThrow(
        'update(): expected spec of $unshift to be an array; got 7. Did you ' +
        'forget to wrap your parameter in an array?'
      );
    });
    test('only unshifts unto an array', function() {
      expect(update.bind(null, 1, {$unshift: 7})).toThrow(
        'update(): expected target of $unshift to be an array; got 1.'
      );
    });
    test('keeps reference equality when possible', function() {
      var original = ['x'];
      expect(update(original, {$unshift: []})).toBe(original)
    });
  });

  describe('$splice', function() {
    test('splices', function() {
      expect(update([1, 4, 3], {$splice: [[1, 1, 2]]})).toEqual([1, 2, 3]);
    });
    test('does not mutate the original object', function() {
      var obj = [1, 4, 3];
      update(obj, {$splice: [[1, 1, 2]]});
      expect(obj).toEqual([1, 4, 3]);
    });
    test('only splices an array of arrays', function() {
      expect(update.bind(null, [], {$splice: 1})).toThrow(
        'update(): expected spec of $splice to be an array of arrays; got 1. ' +
        'Did you forget to wrap your parameters in an array?'
      );
      expect(update.bind(null, [], {$splice: [1]})).toThrow(
        'update(): expected spec of $splice to be an array of arrays; got 1. ' +
        'Did you forget to wrap your parameters in an array?'
      );
    });
    test('only splices unto an array', function() {
      expect(update.bind(null, 1, {$splice: 7})).toThrow(
        'Expected $splice target to be an array; got 1'
      );
    });
    test('keeps reference equality when possible', function() {
      var original = ['x'];
      expect(update(original, {$splice: [[]]})).toBe(original)
    });
  });

  describe('$merge', function() {
    test('merges', function() {
      expect(update({a: 'b'}, {$merge: {c: 'd'}})).toEqual({a: 'b', c: 'd'});
    });
    test('does not mutate the original object', function() {
      var obj = {a: 'b'};
      update(obj, {$merge: {c: 'd'}});
      expect(obj).toEqual({a: 'b'});
    });
    test('only merges with an object', function() {
      expect(update.bind(null, {}, {$merge: 7})).toThrow(
        'update(): $merge expects a spec of type \'object\'; got 7'
      );
    });
    test('only merges with an object', function() {
      expect(update.bind(null, 7, {$merge: {a: 'b'}})).toThrow(
        'update(): $merge expects a target of type \'object\'; got 7'
      );
    });
    test('keeps reference equality when possible', function() {
      var original = {a: {b: {c: true}}};
      expect(update(original, {a: {$merge: {}}})).toBe(original);
      expect(update(original, {a: {$merge: { b: original.a.b }}})).toBe(original);

      // Merging primatives of the same value should return the original.
      expect(update(original, {a: {b: { $merge: {c: true} }}})).toBe(original);

      // Two objects are different values even though they are deeply equal.
      expect(update(original, {a: {$merge: { b: {c: true} }}})).not.toBe(original);
      expect(update(original, {
        a: {$merge: { b: original.a.b, c: false }}
      })).not.toBe(original);
    });

  });

  describe('$set', function() {
    test('sets', function() {
      expect(update({a: 'b'}, {$set: {c: 'd'}})).toEqual({c: 'd'});
    });
    test('does not mutate the original object', function() {
      var obj = {a: 'b'};
      update(obj, {$set: {c: 'd'}});
      expect(obj).toEqual({a: 'b'});
    });
    test('keeps reference equality when possible', function() {
      var original = {a: 1};
      expect(update(original, {a: {$set: 1}})).toBe(original);
      expect(update(original, {a: {$set: 2}})).not.toBe(original);
    });
  });

  describe('$unset', function() {
    test('unsets', function() {
      expect(update({a: 'b'}, {$unset: ['a']}).a).toBe(undefined);
    });
    test('removes the key from the object', function() {
      var removed = update({a: 'b'}, {$unset: ['a']});
      expect('a' in removed).toBe(false);
    });
    test('removes multiple keys from the object', function() {
      var original = {a: 'b', c: 'd', e: 'f'};
      var removed = update(original, {$unset: ['a', 'e']});
      expect('a' in removed).toBe(false);
      expect('a' in original).toBe(true);
      expect('e' in removed).toBe(false);
      expect('e' in original).toBe(true);
    });
    test('does not remove keys from the inherited properties', function() {
      function Parent() { this.foo = 'Parent'; }
      function Child() {}
      Child.prototype = new Parent()
      var child = new Child();
      expect(update(child, {$unset: ['foo']}).foo).toEqual('Parent');
    });
    test('keeps reference equality when possible', function() {
      var original = {a: 1};
      expect(update(original, {$unset: ['b']})).toBe(original);
      expect(update(original, {$unset: ['a']})).not.toBe(original);
    });
  });

  describe('$apply', function() {
    var applier = function(node) {
      return {v: node.v * 2};
    };
    test('applies', function() {
      expect(update({v: 2}, {$apply: applier})).toEqual({v: 4});
    });
    test('does not mutate the original object', function() {
      var obj = {v: 2};
      update(obj, {$apply: applier});
      expect(obj).toEqual({v: 2});
    });
    test('only applies a function', function() {
      expect(update.bind(null, 2, {$apply: 123})).toThrow(
        'update(): expected spec of $apply to be a function; got 123.'
      );
    });
    test('keeps reference equality when possible', function() {
      var original = {a: {b: {}}};
      function identity(val) {
        return val;
      }
      expect(update(original, {a: {$apply: identity}})).toBe(original);
      expect(update(original, {a: {$apply: applier}})).not.toBe(original);
    });
  });

  describe('deep update', function() {
    test('works', function() {
      expect(update({
        a: 'b',
        c: {
          d: 'e',
          f: [1],
          g: [2],
          h: [3],
          i: {j: 'k'},
          l: 4,
        },
      }, {
        c: {
          d: {$set: 'm'},
          f: {$push: [5]},
          g: {$unshift: [6]},
          h: {$splice: [[0, 1, 7]]},
          i: {$merge: {n: 'o'}},
          l: {$apply: function(x) { return x * 2 }},
        },
      })).toEqual({
        a: 'b',
        c: {
          d: 'm',
          f: [1, 5],
          g: [6, 2],
          h: [7],
          i: {j: 'k', n: 'o'},
          l: 8,
        },
      });
    });
    test('keeps reference equality when possible', function() {
      var original = {a: {b: 1}, c: {d: {e: 1}}};

      expect(update(original, {a: {b: {$set: 1}}})).toBe(original);
      expect(update(original, {a: {b: {$set: 1}}}).a).toBe(original.a);

      expect(update(original, {c: {d: {e: {$set: 1}}}})).toBe(original);
      expect(update(original, {c: {d: {e: {$set: 1}}}}).c).toBe(original.c);
      expect(update(original, {c: {d: {e: {$set: 1}}}}).c.d).toBe(original.c.d);

      expect(update(original, {
        a: {b: {$set: 1}},
        c: {d: {e: {$set: 1}}},
      })).toBe(original);
      expect(update(original, {
        a: {b: {$set: 1}},
        c: {d: {e: {$set: 1}}},
      }).a).toBe(original.a);
      expect(update(original, {
        a: {b: {$set: 1}},
        c: {d: {e: {$set: 1}}},
      }).c).toBe(original.c);
      expect(update(original, {
        a: {b: {$set: 1}},
        c: {d: {e: {$set: 1}}},
      }).c.d).toBe(original.c.d);

      expect(update(original, {a: {b: {$set: 2}}})).not.toBe(original);
      expect(update(original, {a: {b: {$set: 2}}}).a).not.toBe(original.a);
      expect(update(original, {a: {b: {$set: 2}}}).a.b).not.toBe(original.a.b);

      expect(update(original, {a: {b: {$set: 2}}}).c).toBe(original.c);
      expect(update(original, {a: {b: {$set: 2}}}).c.d).toBe(original.c.d);
    });
  });

  test('should accept array spec to modify arrays', function() {
    var original = {value: [{a: 0}]};
    var modified = update(original, {value: [{a: {$set: 1}}]});
    expect(modified).toEqual({value: [{a: 1}]});
  });

  test('should accept object spec to modify arrays', function() {
    var original = {value: [{a: 0}]};
    var modified = update(original, {value: {'0': {a: {$set: 1}}}});
    expect(modified).toEqual({value: [{a: 1}]});
  });

  test('should reject arrays except as values of specific commands', function() {
    var specs = [
      [],
      {a: []},
      {a: {$set: []}, b: [[]]},
    ];
    specs.forEach(function(spec) {
      expect(update.bind(null, {a: 'b'}, spec)).toThrow(
        'update(): You provided an invalid spec to update(). The spec ' +
        'may not contain an array except as the value of $set, $push, ' +
        '$unshift, $splice or any custom command allowing an array value.'
      );
    });
  });

  test('should reject non arrays from $unset', function() {
    expect(update.bind(null, {a: 'b'}, {$unset: 'a'})).toThrow(
      'update(): expected spec of $unset to be an array; got a. ' +
      'Did you forget to wrap the key(s) in an array?'
    );
  });

  test('should require a plain object spec containing command(s)', function() {
    var specs = [
      null,
      false,
      {a: 'c'},
      {a: {b: 'c'}},
    ];
    specs.forEach(function(spec) {
      expect(update.bind(null, {a: 'b'}, spec)).toThrow(
        'update(): You provided an invalid spec to update(). The spec ' +
        'and every included key path must be plain objects containing one ' +
        'of the following commands: $push, $unshift, $splice, $set, $unset, ' +
        '$merge, $apply.'
      );
    });
  });

  test('should perform safe hasOwnProperty check', function() {
    expect(update({}, {'hasOwnProperty': {$set: 'a'}})).toEqual({
      'hasOwnProperty': 'a',
    });
  });

});


describe('update', function() {
  describe('can extend functionality', function() {
    var myUpdate;
    beforeEach(function() {
      myUpdate = update.newContext();
    });

    test('allows adding new directives', function() {
      myUpdate.extend('$addtax', function(tax, original) {
        return original + (tax * original);
      });
      expect(myUpdate(5, {$addtax: 0.10})).toEqual(5.5);
    });

    test('gets the original object (so be careful about mutations)', function() {
      var obj = {};
      var passedOriginal;
      myUpdate.extend('$foobar', function(prop, original) {
        passedOriginal = original;
      });
      myUpdate(obj, {$foobar: null});
      expect(obj).toBe(passedOriginal);
    });

    test("doesn't touch the original update", function() {
      myUpdate.extend('$addtax', function(tax, original) {
        return original + (tax * original);
      });
      expect(  update.bind(null, {$addtax: 0.10}, {$addtax: 0.10})).toThrow();
      expect(myUpdate.bind(null, {$addtax: 0.10}, {$addtax: 0.10})).not.toThrow();
    });

    test('can handle nibling directives', function() {
      var obj = {a: [1, 2, 3], b: "me"};
      var spec = {
        a: {$splice: [[0, 2]]},
        $merge: {b: "you"},
      };
      expect(update(obj, spec)).toEqual({"a":[3],"b":"you"});
    });

  });

  if (typeof Symbol === 'function' && Symbol('TEST').toString() === 'Symbol(TEST)') {
    describe('works with symbols', function() {
      test('in the source object', function() {
        var obj = {a: 1};
        obj[Symbol.for('b')] = 2;
        expect(update(obj, {c: {$set: 3}})[Symbol.for('b')]).toEqual(2);
      });
      test('in the spec object', function() {
        var obj = {a: 1};
        obj[Symbol.for('b')] = 2;
        var spec = {};
        spec[Symbol.for('b')] = {$set: 2};
        expect(update(obj, spec)[Symbol.for('b')]).toEqual(2);
      });
      test('in the $merge command', function() {
        var obj = {a: 1};
        obj[Symbol.for('b')] = {c: 3};
        obj[Symbol.for('d')] = 4;
        var spec = {};
        spec[Symbol.for('b')] = { $merge: {} };
        spec[Symbol.for('b')].$merge[Symbol.for('e')] = 5;
        var updated = update(obj, spec);
        expect(updated[Symbol.for('b')][Symbol.for('e')]).toEqual(5);
        expect(updated[Symbol.for('d')]).toEqual(4);
      });
    });
  }
});

