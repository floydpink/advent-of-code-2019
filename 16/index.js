const fs = require('fs');

const inputPath = 'input.txt';
const numbers = fs.readFileSync(inputPath)
  .toString();

const basePattern = [0, 1, 0, -1];

const getMultipliers = (position, totalLength) => {
  let pattern = [];
  const currentPositionPattern = basePattern
    .map(d => Array(position).fill(d))
    .flat();
  while (pattern.length < totalLength + 1) {
    pattern = pattern.concat(currentPositionPattern);
  }

  return pattern.slice(1, totalLength + 1);
};

const calculateNextPhase = (inputStr) => {
  const input = inputStr.split('').map(Number);
  const lhs = input.slice();
  return input
    .map((d, position) => {
      const rhs = getMultipliers(position + 1, input.length);
      return Number(Math.abs(lhs
        .map((l, idx) => {
          return l * rhs[idx];
        })
        .reduce((a, b) => a + b))
        .toString()
        .split('')
        .pop());
    })
    .join('');
};

// Did not spend the time to observe the patterns - the insights mentioned here is what helped... :(
//  https://www.reddit.com/r/adventofcode/comments/ebai4g/2019_day_16_solutions/fb3l4v2/
const calculateNextPhasePart02 = (inputStr, offset, left) => {
  const input = inputStr.split('').map(Number);
  const copy = input.slice();
  let rightInput = copy.slice(offset);
  const map = new Map();
  for (let i = rightInput.length - 1; i >= 0; i--) {
    if (i === rightInput.length - 1) {
      map.set(i, rightInput[i]);
    } else {
      map.set(i, rightInput[i] + map.get(i + 1));
    }
  }
  const right = [];
  for (let j = 0; j < rightInput.length; j++) {
    right.push(Number(map.get(j).toString().split('').pop()));
  }
  return left.concat(right).join('');
};

// part 01
let i = 0;
let output = numbers;
let times = inputPath === 'input1.txt' ? 4 : 100;
while (i < times) {
  i++;
  output = calculateNextPhase(output);
  // console.log(`After ${i} phases: ${output}`);
}

console.log(`part 01 answer: ${output.substr(0, 8)}`);

// part 02
i = 0;
const offset = Number(numbers.substr(0, 7));
let input = numbers.split('').map(Number);
let part02input = [];
const left = Array(offset).fill(0);
while (i < 10000) {
  part02input = part02input.concat(input);
  i++;
}

i = 0;
output = part02input.join('');
times = inputPath === 'input1.txt' ? 4 : 100;
while (i < times) {
  i++;
  output = calculateNextPhasePart02(output, offset, left);
  // console.log(`After ${i} phases: ${output}`);
}

console.log(`part 02 answer: ${output.substr(offset, 8)}`);

// took 3 minutes and 9 seconds !