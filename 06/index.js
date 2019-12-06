const fs = require('fs');

const inputPath = 'input.txt';

const edges = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(e => e.split(')'));

// console.log(edges);

class Object {
  constructor(node) {
    this.node = node;
    this.neighbors = new Set();
    this.parent = null;
    this.totalOrbits = null;
    this.hasSantaBelow = false;
  }
}

const map = new Map();

for (let edge of edges) {
  let start = edge[0];
  let end = edge[1];
  if (!map.has(start)) {
    map.set(start, new Object(start));
  }
  if (!map.has(end)) {
    map.set(end, new Object(end));
  }
  map.get(start).neighbors.add(map.get(end));
  map.get(end).parent = map.get(start);
}

const startNode = [...map.values()].find(n => n.parent == null);
let queue = [startNode];
while (queue.length > 0) {
  let current = queue.shift();
  if (current.totalOrbits == null) {
    current.totalOrbits = current.parent ? current.parent.totalOrbits + 1 : 0;
    [...current.neighbors.values()].forEach(n => queue.push(n));
  }
}

// part 01
const part01Answer = [...map.values()].map(p => p.totalOrbits).reduce((p, c) => p + c);
console.log(`part 01 answer: ${part01Answer}`);

// part 02
// set hasSantaBelow on all of SAN's ancestors
const santa = map.get('SAN');
let current = santa;
while (current != null) {
  current.hasSantaBelow = true;
  current = current.parent;
}

// find distance from 'YOU' to 'SAN'
let distance = 0;
current = map.get('YOU');
while (current.node !== 'SAN') {
  if (current.hasSantaBelow) {
    current = [...current.neighbors.values()].find(n => n.hasSantaBelow);
  } else {
    current = current.parent;
  }
  distance++;
}
console.log(`part 02 answer: ${distance - 2}`);