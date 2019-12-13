const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

class IntComputer {
  constructor(instructions, getInput = () => null) {
    this.instructions = instructions;
    this.step = 0;
    this.relativeBase = 0;
    this.input = null;
    this.output = null;
    this.getInput = getInput;
    this.halted = false;
  }

  run() {
    this.input = this.getInput();
    this.output = null;
    while (!this.halted && this.output == null) {
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

const TILE = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4
};

const isValidTile = (tile) => tile === TILE.EMPTY ||
  tile === TILE.WALL ||
  tile === TILE.BLOCK ||
  tile === TILE.PADDLE ||
  tile === TILE.BALL;

const mapPixels = (pixels, paint = false) => {
  const map = new Map();
  const screen = [];
  for (let i = 0; i < pixels.length; i++) {
    const tileId = pixels[i + 2];
    if (!map.has(tileId)) {
      map.set(tileId, new Set());
    }
    let x = pixels[i];
    let y = pixels[i + 1];
    map.get(tileId).add(`${x}|${y}`);
    if (screen[y] == null) {
      screen[y] = [];
    }
    screen[y][x] = tileId;
    i += 2;
  }

  if (paint) {
    console.log(' ');
    for (let y = 0; y < screen.length; y++) {
      console.log(screen[y].join('')
        .replace(new RegExp(TILE.EMPTY.toString(), 'g'), ' ')
        .replace(new RegExp(TILE.WALL.toString(), 'g'), '█')
        .replace(new RegExp(TILE.BLOCK.toString(), 'g'), '#')
        .replace(new RegExp(TILE.PADDLE.toString(), 'g'), '-')
        .replace(new RegExp(TILE.BALL.toString(), 'g'), 'O')
      );
    }
  }

  return {
    map: map,
    empty: map.has(TILE.EMPTY) ? map.get(TILE.EMPTY).size : 0,
    wall: map.has(TILE.WALL) ? map.get(TILE.WALL).size : 0,
    block: map.has(TILE.BLOCK) ? map.get(TILE.BLOCK).size : 0,
    paddle: map.has(TILE.PADDLE) ? map.get(TILE.PADDLE).size : 0,
    ball: map.has(TILE.BALL) ? map.get(TILE.BALL).size : 0
  };
};


// part 01
let pointers_01 = integers.slice();
let arcade_01 = new IntComputer(pointers_01);
const pixels_01 = [];
while (true) {
  const output = arcade_01.run();
  if (output == null) break;
  pixels_01.push(output);
}

const screen_01 = mapPixels(pixels_01);
console.log(`part 01 answer: ${screen_01.block}`);

// part 02
let pointers_02 = integers.slice();
pointers_02[0] = 2;
let ballPos = 0, paddlePos = 0, blockCount = Number.POSITIVE_INFINITY;

const changeJoystick = () => {
  if (ballPos > paddlePos) {
    return 1;
  } else if (ballPos < paddlePos) {
    return -1;
  }
  return 0;
};

let arcade_02 = new IntComputer(pointers_02, changeJoystick);

let score = 0;
while (blockCount > 0) {
  let pixels_02 = [];
  while (true) {
    const x = arcade_02.run();
    const y = arcade_02.run();
    const z = arcade_02.run();
    if (x == null || y == null || z == null) {
      break;
    } else {
      if (x === -1 && y === 0 && !isValidTile(z)) {
        score = z;
      } else {
        pixels_02 = pixels_02.concat([x, y, z]);
        if (z === TILE.BALL) {
          ballPos = x;
        }
        if (z === TILE.PADDLE) {
          paddlePos = x;
        }
      }
    }
    /*const screen = mapPixels(pixels_02, true);
    blockCount = screen.block;*/
  }
  const screen = mapPixels(pixels_02);
  blockCount = screen.block;
  arcade_02 = new IntComputer(pointers_02);
}

console.log(`part 02 answer: ${score}`);
