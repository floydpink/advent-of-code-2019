const fs = require('fs');

const inputPath = 'input.txt';
const trimFunc = i => i.trim();
const reactions = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc);

class Chemical {
  constructor(name, units) {
    this.name = name;
    this.units = units;
  }
}

const ORE = 'ORE';
const FUEL = 'FUEL';

function calculateMinimumOreRequired(fuelsToGenerate = 1) {
  const chemicals = new Map();
  const ingredientCounts = new Map();
  for (let reaction of reactions) {
    const [lhs, rhs] = reaction.split('=>').map(trimFunc);
    const [units, ...name] = rhs.split(' ');
    const rightChemical = new Chemical(...name, +units);
    const leftChemicals = lhs.split(',').map(trimFunc).map(leftChemical => {
      const [units, ...name] = leftChemical.split(' ');
      return new Chemical(...name, +units);
    });
    chemicals.set(rightChemical.name, [rightChemical.units, ...leftChemicals]);
    for (const leftChemical of leftChemicals) {
      let name = leftChemical.name;
      if (!ingredientCounts.has(name)) {
        ingredientCounts.set(name, 0)
      }
      ingredientCounts.set(name, ingredientCounts.get(name) + 1);
    }
  }

  ingredientCounts.set(FUEL, 0); // 'FUEL' is not an ingredient for anything
  const requirementMap = new Map();
  requirementMap.set(FUEL, fuelsToGenerate);

  let amt = 0;
  while (true) {
    for (let name of ingredientCounts.keys()) {
      if (ingredientCounts.get(name) === 0) { // only process leaf-level chemicals
        let requirementCount = requirementMap.get(name);
        if (name === ORE) {
          return requirementCount;
        }
        let [units, ...ingredients] = chemicals.get(name);
        amt = Math.floor((requirementCount + units - 1) / units);

        for (let ingredient of ingredients) {
          if (!requirementMap.has(ingredient.name)) {
            requirementMap.set(ingredient.name, 0);
          }

          // set the requirement count
          requirementMap.set(ingredient.name, requirementMap.get(ingredient.name) + amt * ingredient.units);
          // decrement the ingredient count
          ingredientCounts.set(ingredient.name, ingredientCounts.get(ingredient.name) - 1);
        }

        ingredientCounts.delete(name);
        break;
      }
    }
  }
}

// part 01
const part01Answer = calculateMinimumOreRequired();
console.log(`part 01 answer: ${part01Answer}`);

// part 02
/*
  https://www.reddit.com/r/adventofcode/comments/eafj32/2019_day_14_solutions/faqkkwv/
  For part 2, I used a faster alternative to binary search. If n ore makes m fuel, then
  1e12 ore makes at least (m * 1e12 / n) fuel, and this number is a pretty good guess
  to use at the next iteration. My search found the right amount in just 3 iterations.
*/
let fuel = 1;
let target = 1e12; // 1 trillion
while (true) {
  let ore = calculateMinimumOreRequired(fuel + 1);
  if (ore > target) {
    break;
  } else {
    fuel = Math.max(fuel + 1, Math.floor((fuel + 1) * target / ore));
  }
}

console.log(`part 02 answer: ${fuel}`);
