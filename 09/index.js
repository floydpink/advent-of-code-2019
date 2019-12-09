const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

const runProgram = (pointers, input) => {
  let step = 0;
  let relativeBase = 0;
  let output = null;
  let counter = 0;
  while (pointers[step] !== 99) {

    counter++;

    let instruction = pointers[step] || 0;
    const operationStr = instruction.toString().padStart(5, '0');
    const [mode3, mode2, mode1, _, operation] = operationStr.split('').map(Number);

    let position1 = pointers[step + 1] || 0;
    let position2 = pointers[step + 2] || 0;
    let position3 = pointers[step + 3] || 0;

    if (mode1 === 2) {
      position1 = relativeBase + position1;
    }
    if (mode2 === 2) {
      position2 = relativeBase + position2;
    }
    if (mode3 === 2) {
      position3 = relativeBase + position3;
    }

    let parameter1 = mode1 === 1 ? position1 : (pointers[position1] || 0);
    let parameter2 = mode2 === 1 ? position2 : (pointers[position2] || 0);
    if (operation === 1) {
      pointers[position3] = parameter1 + parameter2;
      step = step + 4;
    } else if (operation === 2) {
      pointers[position3] = parameter1 * parameter2;
      step = step + 4;
    } else if (operation === 3) {
      pointers[position1] = input;
      step = step + 2;
    } else if (operation === 4) {
      // console.log(`Output: ${parameter1}`);
      output = parameter1;
      step = step + 2;
    } else if (operation === 5) {
      if (parameter1 !== 0) {
        step = parameter2;
      } else {
        step = step + 3;
      }
    } else if (operation === 6) {
      if (parameter1 === 0) {
        step = parameter2;
      } else {
        step = step + 3;
      }
    } else if (operation === 7) {
      if (parameter1 < parameter2) {
        pointers[position3] = 1
      } else {
        pointers[position3] = 0
      }
      step = step + 4;
    } else if (operation === 8) {
      if (parameter1 === parameter2) {
        pointers[position3] = 1
      } else {
        pointers[position3] = 0
      }
      step = step + 4;
    } else if (operation === 9) {
      relativeBase = relativeBase + parameter1;
      step = step + 2;
    } else {
      throw new Error('Invalid input');
    }

  }

  return output;
};

// part 01
let pointers_01 = integers.slice();
const part01Answer = runProgram(pointers_01, 1);
console.log(`part 01 answer: ${part01Answer}`);

// part 02
let pointers_02 = integers.slice();
const part02Answer = runProgram(pointers_02, 2);
console.log(`part 02 answer: ${part02Answer}`);
