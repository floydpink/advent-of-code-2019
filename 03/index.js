const fs = require('fs');

const inputPath = 'input.txt';

const RIGHT = [0, 1];
const UP = [-1, 0];
const LEFT = [0, -1];
const DOWN = [1, 0];

const DIRECTION = {
  'R': RIGHT,
  'U': UP,
  'L': LEFT,
  'D': DOWN
};

class Corner {
  constructor(direction, steps) {
    this.direction = direction;
    this.steps = steps;
  }
}

const wireJunctions = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(w => w.split(',').map(p => new Corner(p.substr(0, 1), Number(p.substr(1)))));

// part 01
const map01 = new Map();
for (let i = 0; i < 2; i++) {
  const wire = wireJunctions[i];
  let current = [0, 0];
  for (let j = 0; j < wire.length; j++) {
    const point = wire[j];
    const offset = DIRECTION[point.direction];
    for (let k = 0; k < point.steps; k++) {
      current = [current[0] + offset[0], current[1] + offset[1]];
      const key = `${current[0]}|${current[1]}`;
      if (!map01.has(key)) {
        map01.set(key, new Set());
      }
      map01.get(key).add(i);
    }
  }
}

const intersectionPoints = [...map01.entries()].filter(p => p[1].size > 1).map(k => k[0]);
const distances = intersectionPoints.map(p => p.split('|').map(Number).reduce((p, c) => Math.abs(p) + Math.abs(c)));
const minDistance = Math.min(...distances);

console.log(`part 01 answer: ${minDistance}`);

// part 02

class Point {
  constructor(position) {
    this.position = position;
    this.wire1Distance = Number.POSITIVE_INFINITY;
    this.wire2Distance = Number.POSITIVE_INFINITY;
  }

  get key() {
    return `${this.position[0]}|${this.position[1]}`;
  }
}

const map02 = new Map();
for (let i = 0; i < 2; i++) {
  const wire = wireJunctions[i];
  let distance = 0;
  let current = [0, 0];
  for (let j = 0; j < wire.length; j++) {
    const position = wire[j];
    const offset = DIRECTION[position.direction];
    for (let k = 0; k < position.steps; k++) {
      current = [current[0] + offset[0], current[1] + offset[1]];
      const key = `${current[0]}|${current[1]}`;

      distance++;
      if (!map02.has(key)) {
        map02.set(key, new Point(current));
      }
      const point = map02.get(key);
      if (i === 0) {
        point.wire1Distance = Math.min(point.wire1Distance, distance);
      } else {
        point.wire2Distance = Math.min(point.wire2Distance, distance);
      }
    }
  }
}

const intersectionPoints02 = [...map02.entries()].filter(p => p.wire1Distance !== Number.POSITIVE_INFINITY && p.wire2Distance !== Number.POSITIVE_INFINITY).map(p => p[1]);
const distances02 = intersectionPoints02.map(p => p.wire1Distance + p.wire2Distance);
const minDistance02 = distances02.sort()[0];

console.log(`part 02 answer: ${minDistance02}`);
