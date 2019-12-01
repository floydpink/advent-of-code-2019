const fs = require('fs');

const inputPath = 'input.txt';

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);

const moduleMasses = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(parseIntFunc);

// console.log(moduleMasses.length);

const findModuleFuel = m => {
  const fuel = Math.floor(m / 3) - 2;
  return fuel < 0 ? 0 : fuel;
};

const part01Answer = moduleMasses
  .map(findModuleFuel)
  .reduce((p, c) => p + c, 0);

console.log(`part 01 answer: ${part01Answer}`);

const moduleFuelDictionary = new Map();
const findModuleFuel2 = (moduleMass) => {
  if (!moduleFuelDictionary.has(moduleMass)) {
    moduleFuelDictionary.set(moduleMass, findModuleFuel(moduleMass));
  }
  const moduleFuel = moduleFuelDictionary.get(moduleMass);
  return moduleFuel === 0 ? moduleFuel : moduleFuel + findModuleFuel2(moduleFuel);
};

const part02Answer = moduleMasses
  .map(findModuleFuel2)
  .reduce((p, c) => p + c, 0);

console.log(`part 02 answer: ${part02Answer}`);