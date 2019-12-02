const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

const runProgram = (pointers) => {
  let step = 0;
  while (pointers[step] !== 99) {
    const operation = pointers[step];
    const op1 = pointers[step + 1];
    const op2 = pointers[step + 2];
    const result = pointers[step + 3];
    if (operation === 1) {
      pointers[result] = pointers[op1] + pointers[op2];
    } else if (operation === 2) {
      pointers[result] = pointers[op1] * pointers[op2];
    } else {
      throw new Error('Invalid input');
    }
    step = step + 4;
  }
  return pointers[0];
};

// part 01
let pointers_01 = integers.slice();
pointers_01[1] = 12;
pointers_01[2] = 2;
const part01Answer = runProgram(pointers_01);
console.log(`part 01 answer: ${part01Answer}`);

// part 02
let output = 0;
let part02Answer = 0;
for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++) {
    const pointers_02 = integers.slice();
    pointers_02[1] = noun;
    pointers_02[2] = verb;
    output = runProgram(pointers_02);
    part02Answer = 100 * noun + verb;
    if (output === 19690720) {
      break;
    }
  }
  if (output === 19690720) {
    break;
  }
}

console.log(`part 02 answer: ${part02Answer}`);