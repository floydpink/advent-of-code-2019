const fs = require('fs');
const {IntComputer} = require('../lib/int-computer');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

const TYPE = {
  EMPTY: '.',
  SCAFFOLD: '#',
  UP: '^',
  DOWN: 'v',
  LEFT: '<',
  RIGHT: '>',
  TUMBLING: 'X',
};

let pointId = 0;

class Position {
  constructor(left, top, type, view) {
    this.id = pointId++;
    this.left = left;
    this.top = top;
    this.type = type;
    this.view = view;
  }

  get key() {
    return `${this.left}|${this.top}`;
  }

  get upNeighborKey() {
    return `${this.left}|${this.top - 1}`;
  }

  get downNeighborKey() {
    return `${this.left}|${this.top + 1}`;
  }

  get leftNeighborKey() {
    return `${this.left - 1}|${this.top}`;
  }

  get rightNeighborKey() {
    return `${this.left + 1}|${this.top}`;
  }

  get upNeighbor() {
    return this.view.get(this.upNeighborKey);
  }

  get downNeighbor() {
    return this.view.get(this.downNeighborKey);
  }

  get leftNeighbor() {
    return this.view.get(this.leftNeighborKey);
  }

  get rightNeighbor() {
    return this.view.get(this.rightNeighborKey);
  }

  get allNeighbors() {
    return [this.leftNeighbor, this.rightNeighbor, this.upNeighbor, this.downNeighbor];
  }

  get scaffoldNeighbors() {
    return this.allNeighbors.filter(n => n != null).filter(n => n.type === TYPE.SCAFFOLD);
  }

  get isScaffoldIntersection() {
    return this.type === TYPE.SCAFFOLD && this.scaffoldNeighbors.length === 4;
  }
}

// part 01
let pointers_01 = integers.slice();
let ascii = new IntComputer(pointers_01);

const generateView = (ascii, part02 = false) => {
  const codes = [];
  let prevOutput = null;
  while (true) {
    const output = ascii.run();
    if (output == null) {
      break;
    } else {
      prevOutput = output;
    }
    codes.push(output);
  }

  return part02 ? prevOutput : codes.map(c => String.fromCharCode(c)).join('').split('\n');
};

const viewArray = generateView(ascii, paint = false);

const view = new Map();
for (let top = 0; top < viewArray.length; top++) {
  for (let left = 0; left < viewArray[0].length; left++) {
    const point = new Position(left, top, viewArray[top][left], view);
    view.set(point.key, point);
  }
}

const intersections = [...view.values()].filter(p => p.isScaffoldIntersection);
console.log(`part 01 answer: ${intersections.map(p => p.left * p.top).reduce((a, b) => a + b)}`);

// part 02

/*
solved this one manually by painting the grid on a spreadsheet:

  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|#|#|#|#|#|#|#|#|#|#|#|#|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|.|.|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|.|.|#|.|#|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|#|#|#|#|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|#|.|#|.|#|.|#|.|#|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|#|#|#|#|#|#|#|.|#|.|#|#|#|#|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|#|.|.|.|.|.|.|.|#|.|.|.|#|.|#|.|#|.|#|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  #|#|#|#|#|#|#|#|#|#|#|#|#|.|.|.|#|#|#|#|#|.|#|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|.|.|.|.|.|.|.|.|
  #|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|
  #|.|.|.|#|.|^|#|#|#|#|#|#|#|#|#|#|#|#|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|
  #|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|
  #|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|#|#|.|.|.|.|.|#|#|#|#|#|#|#|#|#|.|.|.|.|
  #|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|
  #|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|#|#|#|#|#|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|#|#|#|#|#|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|#|.|.|.|#|.|.|.|.|.|#|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|#|#|#|#|.|.|.|.|.|#|#|#|#|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|.|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|#|#|#|#|#|#|#|#|#|#|#|#|#|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|#|.|.|.|.|.|.|.|.|.|.|.|.|
  .|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|#|#|#|#|#|#|#|#|#|.|.|.|.|.|.|.|.|.|.|.|.|

R12, L8, L4, L4, L8, R6, L6, R12, L8, L4, L4, L8, R6, L6, L8, L4, R12, L6, L4, R12,
L8, L4, L4, L8, L4, R12, L6, L4, R12, L8, L4, L4, L8, L4, R12, L6, L4, L8, R6, L6

A, B, A, B, C, A, C, A, C, B

A = R12, L8, L4, L4
B = L8, R6, L6
C = L8, L4, R12, L6, L4

*/

const inputs = [
  'A', ',', 'B', ',', 'A', ',', 'B', ',', 'C', ',', 'A', ',', 'C', ',', 'A', ',', 'C', ',', 'B', '\n',
  'R', ',', '1', '2', ',', 'L', ',', '8', ',', 'L', ',', '4', ',', 'L', ',', '4', '\n',
  'L', ',', '8', ',', 'R', ',', '6', ',', 'L', ',', '6', '\n',
  'L', ',', '8', ',', 'L', ',', '4', ',', 'R', ',', '1', '2', ',', 'L', ',', '6', ',', 'L', ',', '4', '\n',
  'N', '\n'
]
  .map(s => s.charCodeAt(0));
let pointers_02 = integers.slice();
pointers_02[0] = 2;
ascii = new IntComputer(pointers_02, () => {
  if (!inputs.length) throw new Error('inputs depleted!');
  return inputs.shift()
});
const part02Answer = generateView(ascii, true);
console.log(`part 02 answer: ${part02Answer}`);