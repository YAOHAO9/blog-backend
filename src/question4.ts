const input = '(1, 2), (5, 3), (3, 1), (1, 2), (2, 4), (1, 6), (2, 3), (3, 4), (5, 6)';

const stones = input.split('), (');

const items = stones.map((stone) => {
  const [first, last] = stone.replace('(', '').replace(')', '').split(',');
  return { first, last, item: `(${1}, ${2})` };
});

console.dir(items);
