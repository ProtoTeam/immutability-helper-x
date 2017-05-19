# immutability-helper-x
-------------

this lib extends the [kolodny/immutability-helper](https://github.com/kolodny/immutability-helper) to support update by path string, like the get/set in lodash

## install

```
npm install -S immutability-helper-x
```

## example

```
update.$set(data, 'a.b', newValue);

// for the array methods like $push/$unshift, you can update it with two forms
update.$push(data, 'arr', ['car', 'bus']);
update.$push(data, 'arr', 'car', 'bus');

update.$apply(data, 'a.b', value => ++value);

// **********************************
// also support extend method
// step 1
update.extend('$addtax', function(tax, original) {
  return original + (tax * original);
});
// step 2 
update.$addtax(data, 'price', 0.8);
// or
update(data, {
  price: { $addtax: 0.8 },
});

// **********************************
// chain api
const d = updateChain(data)
  .$set('a.b.c', 444)
  .$merge('a.b', {
    d: 555,
  })
  .$push('a.e', [4])
  .$unshift('a.e', [0])
  .$splice('a.e', [[1, 0, 8]])
  .$apply('a.b.d', val => val + 100)
  .value();

```
