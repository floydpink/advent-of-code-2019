const fs = require('fs');

const inputPath = 'input.txt';

const trimFunc = i => i.trim();

class Moon {
  constructor(position) {
    this.position = position;
    this.velocity = [0, 0, 0];
  }

  get potentialEnergy() {
    return this.position.map(Math.abs).reduce((p, c) => p + c);
  }

  get kineticEnergy() {
    return this.velocity.map(Math.abs).reduce((p, c) => p + c);
  }

  get totalEnergy() {
    return this.potentialEnergy * this.kineticEnergy;
  }

  applyGravity(other) {
    for (let i = 0; i < 3; i++) {
      if (this.position[i] !== other.position[i]) {
        const delta = this.position[i] > other.position[i] ? -1 : 1;
        this.velocity[i] += delta;
        const otherDelta = -1 * delta;
        other.velocity[i] += otherDelta;
      }
    }
  }

  applyVelocity() {
    for (let i = 0; i < 3; i++) {
      this.position[i] += this.velocity[i];
    }
  }

  toString() {
    return `${this.position} | ${this.velocity} | ${this.potentialEnergy} | ${this.kineticEnergy} | ${this.totalEnergy}`;
  }
}

// https://stackoverflow.com/a/31302607/218882
const LCM = (array) => {
  const arr = array.sort();
  const gcd = (x, y) => {
    return x === 0 ? y : gcd(y % x, x);
  };

  const lcm = (x, y) => {
    return (x * y) / gcd(x, y);
  };

  let multiple = arr[0];
  arr.forEach(n => {
    multiple = lcm(multiple, n);
  });

  return multiple;
};

const timeStep = (moons) => {
  const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  for (let p of pairs) {
    const moon1 = moons[p[0]], moon2 = moons[p[1]];
    moon1.applyGravity(moon2);
  }
  for (const moon of moons) {
    moon.applyVelocity();
  }
};

function paintMoons(n, moons) {
  console.log(`After ${n} time steps:`);
  for (const moon of moons) {
    console.log(`${moon}`);
  }
  console.log();
}

// part 01
const moons_01 = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(l => l
    .replace(/[<>]/g, '')
    .replace(/[xyz]=/g, '')
    .split(',').map(trimFunc).map(Number)
  )
  .map(p => new Moon(p));
let n = 0;
// paintMoons(n, moons_01);
while (n < 1000) {
  n++;
  timeStep(moons_01);
  // paintMoons(n, moons_01);
}

let totalEnergy = 0;
for (const moon of moons_01) {
  totalEnergy += moon.totalEnergy;
}
console.log(`part 01 answer: ${totalEnergy}`);

// part 02
/*
* was stuck again on this one!
*  - this is what helped: https://www.reddit.com/r/adventofcode/comments/e9j0ve/2019_day_12_solutions/faja0lj/
*   1. The axes (x,y,z) are totally independent. So it suffices to find the period for each axis separately.
*      Then the answer is the lcm of these.
*   2. Each axis will repeat "relatively quickly" (fast enough to brute force)*
*   3. Since each state has a unique parent, the first repeat must be a repeat of state 0.
* */
const moons_02 = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(l => l
    .replace(/[<>]/g, '')
    .replace(/[xyz]=/g, '')
    .split(',').map(trimFunc).map(Number)
  )
  .map(p => new Moon(p));

let matched = [false, false, false];
let periods = [-1, -1, -1];
const maps = [new Set(), new Set(), new Set()];
const checkForMatch = (moons, n) => {
  for (let i = 0; i < 3; i++) {
    const string = moons.map(m => `${m.position[i]}|${m.velocity[i]}`).join(':');
    if (!matched[i]) {
      if (maps[i].has(string)) {
        matched[i] = true;
        periods[i] = n;
      } else {
        maps[i].add(string);
      }
    }
  }
};

n = 0;
// paintMoons(n, moons_02);
while (true) {
  checkForMatch(moons_02, n);
  n++;
  if (matched.every(m => m)) {
    break;
  }
  timeStep(moons_02);
  // paintMoons(n, moons_02);
}

console.log(`part 02 answer: ${LCM(periods)}`);
