const fs = require('fs');
const {IntComputer} = require('../lib/int-computer');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

// part 01
let pointers_01 = integers.slice();
const boost_01 = new IntComputer(pointers_01, () => 1);
const part01Answer = boost_01.run();
console.log(`part 01 answer: ${part01Answer}`);

// part 02
let pointers_02 = integers.slice();
const boost_02 = new IntComputer(pointers_02, () => 2);
const part02Answer = boost_02.run();
console.log(`part 02 answer: ${part02Answer}`);
