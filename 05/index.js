const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

const runProgram = (pointers, input) => {
  let step = 0;
  let output = null;
  while (pointers[step] !== 99) {

    const operationStr = pointers[step].toString().padStart(4, '0');
    const [mode2, mode1, _, operation] = operationStr.split('').map(Number);

    const position1 = pointers[step + 1];
    const position2 = pointers[step + 2];
    const position3 = pointers[step + 3];

    let parameter1 = mode1 === 0 ? pointers[position1] : position1;
    let parameter2 = mode2 === 0 ? pointers[position2] : position2;
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
const part02Answer = runProgram(pointers_02, 5);
console.log(`part 01 answer: ${part02Answer}`);
