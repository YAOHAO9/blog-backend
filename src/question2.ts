const array = [
  { id: 1 },
  { id: 2, before: 1 },
  { id: 3, after: 1 },
  { id: 5, first: true },
  { id: 6, last: true },
  { id: 7, after: 8 },
  { id: 8 },
  { id: 9 },
];
const arrayObj = {};

// tslint:disable-next-line:one-variable-per-declaration
let first, last;

// init and find out the first and last
array.forEach((item) => {
  if (item.first === true) {
    first = item;
    if (first.before) {
      throw new Error(`The first item can't have a before item.`);
    }
  }
  if (item.last === true) {
    last = item;
    if (last.after) {
      throw new Error(`The last item can't have an after item.`);
    }
  }
  arrayObj[item.id] = Object.assign({ item }, item);
});

// find the after item
array.forEach((item) => {
  if (item.before) {
    const before = arrayObj[item.before];
    if (!before) {
      throw new Error(`Can't find the before item of ${item.id}`);
    }
    if (before.after && before.after !== item.id) {
      throw new Error(`Confilct chain between ${item.id} and ${before.id}`);
    }
    before.after = item.id;
  }
  if (item.after) {
    const after = arrayObj[item.after];
    if (!after) {
      throw new Error(`Can't find the after item of ${item.id}`);
    }
    if (after.before && after.before !== item.id) {
      throw new Error(`Confilct chain between ${item.id} and ${after.id}`);
    }
    after.before = item.id;
  }
});

const chain = [];
// order
array.forEach((_, index) => {
  if (index === 0) {
    chain[0] = first;
    return;
  }
  const beforeId = chain[index - 1].id;
  const currentId = arrayObj[beforeId].after;
  if (currentId) {
    const currentItem = arrayObj[currentId].item;
    chain[index] = currentItem;
    if (index === (array.length - 1)) {
      if (currentItem !== last) {
        throw new Error('Invalid chain.');
      }
      console.dir(chain);
    }
    return;
  }
  throw new Error('Invalid chain.');
});
