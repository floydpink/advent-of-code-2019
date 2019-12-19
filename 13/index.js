const fs = require('fs');
const {IntComputer} = require('../lib/int-computer');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

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
