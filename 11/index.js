const fs = require('fs');
const {IntComputer} = require('../lib/int-computer');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

let LL = Number.POSITIVE_INFINITY;
let DD = Number.POSITIVE_INFINITY;
let RR = Number.NEGATIVE_INFINITY;
let UU = Number.NEGATIVE_INFINITY;
let map = new Map();


let isFirstTile = true;
const getColor = (row, cell, isPart02) => {
  const key = `${row}|${cell}`;
  let defaultPaintColor = 0;
  if (isPart02 && isFirstTile) {
    isFirstTile = false;
    defaultPaintColor = 1;
  }
  return map.get(key) || defaultPaintColor;
};

const setColor = (row, cell, color) => {
  LL = Math.min(LL, cell);
  DD = Math.min(DD, row);
  RR = Math.max(RR, cell);
  UU = Math.max(UU, row);
  const key = `${row}|${cell}`;
  map.set(key, color);
};

const paintTheShip = (pointers, isPart02 = false) => {
  LL = Number.POSITIVE_INFINITY;
  DD = Number.POSITIVE_INFINITY;
  RR = Number.NEGATIVE_INFINITY;
  UU = Number.NEGATIVE_INFINITY;
  map = new Map();
  let current = [0, 0];

  const DIRS = {'U': [-1, 0], 'D': [1, 0], 'L': [0, -1], 'R': [0, 1]};
  let direction = DIRS.U;

  const robot = new IntComputer(pointers, () => {
    return getColor(current[0], current[1], isPart02);
  });

  while (true) {
    const newColor = robot.run();
    if (newColor == null) {
      break;
    }
    setColor(current[0], current[1], newColor);
    const turnRight = robot.run();
    if (turnRight == null) {
      break;
    }
    if (direction === DIRS.U) {
      direction = turnRight ? DIRS.R : DIRS.L;
    } else if (direction === DIRS.R) {
      direction = turnRight ? DIRS.D : DIRS.U;
    } else if (direction === DIRS.D) {
      direction = turnRight ? DIRS.L : DIRS.R;
    } else if (direction === DIRS.L) {
      direction = turnRight ? DIRS.U : DIRS.D;
    }
    current = [current[0] + direction[0], current[1] + direction[1]];
  }
};

// part 01
let pointers_01 = integers.slice();
paintTheShip(pointers_01);

console.log(`part 01 answer: ${[...map.keys()].length}`);

// part 02
let pointers_02 = integers.slice();
paintTheShip(pointers_02, true);

console.log(`part 02 answer:`);
for (let row = DD; row <= UU; row++) {
  let line = '';
  for (let cell = LL; cell <= RR; cell++) {
    line += getColor(row, cell) === 0 ? ' ' : '█';
  }
  console.log(line);
}
