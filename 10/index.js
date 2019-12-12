const fs = require('fs');

const inputPath = 'input.txt';

const map = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(l => l.split(''));

class Point {
  constructor(top, left) {
    this.top = top;
    this.left = left;
    this.canSee = new Set();
  }

  get score() {
    return this.canSee.size;
  }

  get key() {
    return Point.makeKey(this.top, this.left);
  }

  static makeKey(top, left) {
    return `${top}|${left}`;
  }
}

const mapMap = new Map();
for (let top = 0; top < map.length; top++) {
  for (let left = 0; left < map[top].length; left++) {
    if (map[top][left] === '#') {
      const point = new Point(top, left);
      mapMap.set(point.key, point);
    }
  }
}

// WAS COMPLETELY CLUELESS ABOUT THIS ONE - LEARNT (AND PLAGIARIZED) A LOT FROM THIS SOLUTION:
//    https://www.reddit.com/r/adventofcode/comments/e8m1z3/2019_day_10_solutions/fad63tw/

const gcd = (x, y) => {
  return x === 0 ? y : gcd(y % x, x);
};

// part 01
const points = [...mapMap.values()];
for (let start of points) {
  for (let end of points) {
    if (start.key !== end.key) {
      const rise = end.top - start.top;
      const run = end.left - start.left;

      const g = Math.abs(gcd(rise, run));
      start.canSee.add(Point.makeKey(-1 * Math.trunc(rise / g), Math.trunc(run / g)));
    }
  }
}

let scores = points.map(p => p.score);
const part01Answer = Math.max.apply(null, scores);
console.log(`part 01 answer: ${part01Answer}`);

// part 02
const station = [...mapMap.entries()].find(p => p[1].score === part01Answer);
const [rise, run] = station[0].split('|').map(Number);
let toSort = [];
for (const key of station[1].canSee.values()) {
  const [dr, dc] = key.split('|').map(Number);
  let newKey = Math.atan2(dr, dc);
  if (newKey > Math.PI / 2) { // adjust for starting from UP rather than RIGHT
    newKey -= Math.PI * 2;
  }
  toSort.push({newKey, value: [dr, dc]});
}
toSort = toSort.sort((a, b) => a.newKey - b.newKey).reverse();
const winner = toSort[199];
let winnerTop = rise - winner.value[0];
let winnerLeft = run + winner.value[1];
while (map[winnerTop][winnerLeft] !== '#') {
  winnerTop -= winner.value[0];
  winnerLeft += winnerLeft;
}
console.log(`part 02 answer: ${winnerLeft * 100 + winnerTop}`);