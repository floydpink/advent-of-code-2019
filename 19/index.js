const fs = require('fs');
const {IntComputer} = require('../lib/int-computer');
const {Node, Graph} = require('../lib/graph');

const inputPath = 'input.txt';
const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

/**
 * Gets the drone's status at co-ordinate ('left', 'top') => 0 === 'stationary', 1 === 'being pulled'
 * @param left {number}
 * @param top {number}
 * @returns {number}
 */
const getTractorBeamStatus = (left, top) => {
  let counter = 0;
  const droneSystem = new IntComputer(integers.slice(),
    () => {
      counter++;
      return counter % 2 !== 0 ? left : top;
    });

  return droneSystem.run();
};

// part 01
const graph = new Graph();
for (let top = 0; top < 50; top++) {
  for (let left = 0; left < 50; left++) {
    const status = getTractorBeamStatus(left, top);
    const node = new Node(left, top, graph, status);
    graph.add(node);
  }
}

console.log(`part 01 answer: ${graph.nodes.filter(n => n.content === 1).length}`);

// part 02
// WAS STUMPED (AGAIN!) - and replicated the solution here:
//   https://www.reddit.com/r/adventofcode/comments/ecogl3/2019_day_19_solutions/fbdmn5n/
let top = 0;
let left = 0;
while (getTractorBeamStatus(left + 99, top) !== 1) {
  top += 1;
  while (getTractorBeamStatus(left, top + 99) !== 1) {
    left += 1;
  }
}

console.log(`part 02 answer: ${left * 10000 + top}`);