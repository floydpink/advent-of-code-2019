const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

class IntComputer {
  constructor(instructions) {
    this.instructions = instructions;
    this.step = 0;
    this.relativeBase = 0;
    this.input = null;
    this.output = null;
    this.halted = false;
  }

  run(input) {
    this.input = input;
    this.output = null;
    while (this.output == null && !this.halted) {
      if (this.instructions[this.step] === 99) {
        this.halted = true;
      } else {
        let instruction = this.instructions[this.step] || 0;
        const operationStr = instruction.toString().padStart(5, '0');
        const [mode3, mode2, mode1, _, operation] = operationStr.split('').map(Number);

        let position1 = this.instructions[this.step + 1] || 0;
        let position2 = this.instructions[this.step + 2] || 0;
        let position3 = this.instructions[this.step + 3] || 0;

        if (mode1 === 2) {
          position1 = this.relativeBase + position1;
        }
        if (mode2 === 2) {
          position2 = this.relativeBase + position2;
        }
        if (mode3 === 2) {
          position3 = this.relativeBase + position3;
        }

        let parameter1 = mode1 === 1 ? position1 : (this.instructions[position1] || 0);
        let parameter2 = mode2 === 1 ? position2 : (this.instructions[position2] || 0);
        if (operation === 1) {
          this.instructions[position3] = parameter1 + parameter2;
          this.step = this.step + 4;
        } else if (operation === 2) {
          this.instructions[position3] = parameter1 * parameter2;
          this.step = this.step + 4;
        } else if (operation === 3) {
          this.instructions[position1] = this.input;
          this.step = this.step + 2;
        } else if (operation === 4) {
          // console.log(`Output: ${parameter1}`);
          this.output = parameter1;
          this.step = this.step + 2;
        } else if (operation === 5) {
          if (parameter1 !== 0) {
            this.step = parameter2;
          } else {
            this.step = this.step + 3;
          }
        } else if (operation === 6) {
          if (parameter1 === 0) {
            this.step = parameter2;
          } else {
            this.step = this.step + 3;
          }
        } else if (operation === 7) {
          if (parameter1 < parameter2) {
            this.instructions[position3] = 1
          } else {
            this.instructions[position3] = 0
          }
          this.step = this.step + 4;
        } else if (operation === 8) {
          if (parameter1 === parameter2) {
            this.instructions[position3] = 1
          } else {
            this.instructions[position3] = 0
          }
          this.step = this.step + 4;
        } else if (operation === 9) {
          this.relativeBase = this.relativeBase + parameter1;
          this.step = this.step + 2;
        } else {
          throw new Error('Invalid input');
        }
      }
    }
    return this.halted ? null : this.output;
  }
}

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

const paintTheShip = (robot, isPart02 = false) => {
  LL = Number.POSITIVE_INFINITY;
  DD = Number.POSITIVE_INFINITY;
  RR = Number.NEGATIVE_INFINITY;
  UU = Number.NEGATIVE_INFINITY;
  map = new Map();
  let current = [0, 0];

  const DIRS = {'U': [-1, 0], 'D': [1, 0], 'L': [0, -1], 'R': [0, 1]};
  let direction = DIRS.U;

  while (true) {
    let currentColor = getColor(current[0], current[1], isPart02);
    const newColor = robot.run(currentColor);
    if (newColor == null) {
      break;
    }
    setColor(current[0], current[1], newColor);
    const turnRight = robot.run(currentColor);
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
let robot = new IntComputer(pointers_01);
paintTheShip(robot);

console.log(`part 01 answer: ${[...map.keys()].length}`);

// part 02
let pointers_02 = integers.slice();
robot = new IntComputer(pointers_02);
paintTheShip(robot, true);

console.log(`part 02 answer:`);
for (let row = DD; row <= UU; row++) {
  let line = '';
  for (let cell = LL; cell <= RR; cell++) {
    line += getColor(row, cell) === 0 ? ' ' : '█';
  }
  console.log(line);
}
