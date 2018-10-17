const input = '(1, 2), (5, 3), (3, 1), (1, 2), (2, 4), (1, 6), (2, 3), (3, 4), (5, 6)';

const stones = input.split('), (');

const items = stones.map((stone) => {
  let [first, last] = stone.replace('(', '').replace(')', '').split(', ');
  first = first.trim();
  last = last.trim();
  return [first, last];
});

const findStone = (items) => {
  const randomIndex = Math.floor(Math.random() * items.length);
  const firstItem = items[randomIndex];
  items.splice(randomIndex, 1);
  const result = [firstItem];

  const connectStone = (val) => {
    items.find((item, index) => {
      if (item.includes(val)) {
        const first = item[0] === val ? item[0] : item[1];
        const last = item[0] === val ? item[1] : item[0];
        result.push([first, last]);
        items.splice(index, 1);
        connectStone(last);
        return true;
      }
      return false;
    });
  };
  connectStone(firstItem[1]);
  if (result.length === 1) {
    throw new Error('Invalid input');
  }
  if (result[0][0] !== result[result.length - 1][1]) {
    throw new Error('Invalid input');
  }
  if (items.length !== 0) {
    const subResult = findStone(items);
    return [result, ...subResult];
  }
  return [result];
};

const childChains = findStone(items);
const toOneChain = (childChains) => {
  if (childChains.length === 1) {
    let chainItems = childChains[0];
    chainItems = chainItems.map((chainItem) => {
      return chainItem.join(', ');
    });
    console.log(`(${chainItems.join('), (')})`);
  } else {
    const firstChain = childChains.pop();
    const found = childChains.find((childChain) => {
      let found = firstChain.find((firstChainItem, index) => {
        const childChainFirstNum = childChain[0][0];
        if (firstChainItem[1] === childChainFirstNum) {
          firstChain.splice(index, 0, ...childChain);
          return true;
        }
        return false;
      });
      if (found) {
        return true;
      }
      found = childChain.find((childChainItem, index) => {
        const firstChainFirstNum = firstChain[0][0];
        if (childChainItem[1] === firstChainFirstNum) {
          childChain.splice(index + 1, 0, ...firstChain);
          return true;
        }
        return false;
      });
      return found;
    });
    if (found) {
      toOneChain(childChains);
    } else {
      throw new Error('Invalid input');
    }
  }
};
toOneChain(childChains);
