const fs = require('fs');

const inputPath = 'input.txt';

const integers = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(Number);

const permute = function (nums) {
  const result = [];
  const len = nums.length;

  if (len === 0) {
    result.push([]);
    return result;
  }

  for (let i = 0; i < len; i++) {
    const before = nums.slice(0, i);
    const after = nums.slice(i + 1, len);
    const partials = permute(before.concat(after));

    for (let j = 0; j < partials.length; j++) {
      const perm = partials[j].slice();
      perm.unshift(nums[i]);
      result.push(perm);
    }
  }
  return result;
};

const runProgram = (pointers, inputs) => {
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
      pointers[position1] = inputs.shift();
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

const amplify = (sequence) => {
  let prevOutput = 0;
  const phaseSequence = sequence.slice();
  for (const phase of phaseSequence) {
    const pointers = integers.slice();
    prevOutput = runProgram(pointers, [phase, prevOutput]);
  }
  return prevOutput;
};

// part 01
const phaseSequences01 = permute([0, 1, 2, 3, 4]);
const signals_01 = new Map();
for (const phaseSequence of phaseSequences01) {
  const signal = amplify(phaseSequence);
  signals_01.set(phaseSequence.join(''), signal);
}
console.log(`part 01 answer: ${Math.max(...[...signals_01.values()])}`);

class Amplifier {
  constructor(phase, instructions, input = null) {
    this.phase = phase;
    this.instructions = instructions;
    this.step = 0;
    this.hasProcessedPhaseAsInput = false;
    this.input = input;
    this.output = null;
    this.waiting = false;
    this.halted = false;
  }

  runStep() {
    if (this.instructions[this.step] === 99) {
      this.halted = true;
    } else {
      const operationStr = this.instructions[this.step].toString().padStart(4, '0');
      const [mode2, mode1, _, operation] = operationStr.split('').map(Number);

      const position1 = this.instructions[this.step + 1];
      const position2 = this.instructions[this.step + 2];
      const position3 = this.instructions[this.step + 3];

      let parameter1 = mode1 === 0 ? this.instructions[position1] : position1;
      let parameter2 = mode2 === 0 ? this.instructions[position2] : position2;
      if (operation === 1) {
        this.instructions[position3] = parameter1 + parameter2;
        this.step = this.step + 4;
      } else if (operation === 2) {
        this.instructions[position3] = parameter1 * parameter2;
        this.step = this.step + 4;
      } else if (operation === 3) {
        if (!this.hasProcessedPhaseAsInput) {
          this.instructions[position1] = this.phase;
          this.hasProcessedPhaseAsInput = true;
          this.step = this.step + 2;
        } else if (this.input != null) {
          this.instructions[position1] = this.input;
          this.input = null;
          this.step = this.step + 2;
          this.waiting = false;
        } else {
          this.waiting = true;
        }
      } else if (operation === 4) {
        // console.log(`Output: ${parameter1}`);
        this.output = parameter1;
        this.step = this.step + 2;
      } else if (operation === 5) {
        if (parameter1 !== 0) {
          this.step = parameter2;
        } else {
          this.step = this.step + 3;
        }
      } else if (operation === 6) {
        if (parameter1 === 0) {
          this.step = parameter2;
        } else {
          this.step = this.step + 3;
        }
      } else if (operation === 7) {
        if (parameter1 < parameter2) {
          this.instructions[position3] = 1
        } else {
          this.instructions[position3] = 0
        }
        this.step = this.step + 4;
      } else if (operation === 8) {
        if (parameter1 === parameter2) {
          this.instructions[position3] = 1
        } else {
          this.instructions[position3] = 0
        }
        this.step = this.step + 4;
      }
    }

  }

}

// part 02
const phaseSequences02 = permute([5, 6, 7, 8, 9]);
const signals_02 = new Map();
for (const sequence of phaseSequences02) {
  const amplifiersMap = new Map();
  const phaseSequence = sequence.slice();
  // initialize amplifiersMap
  for (let i = 0; i < phaseSequence.length; i++) {
    const pointers = integers.slice();
    const phase = phaseSequence[i];
    const input = i === 0 ? 0 : null;
    amplifiersMap.set(phase, new Amplifier(phase, pointers, input))
  }
  // run amplifiersMap
  const amplifierQueue = [...amplifiersMap.values()];
  let prevOutput = 0;
  while (amplifierQueue.some(a => !a.halted)) {
    let currentAmplifier = amplifierQueue.shift();
    currentAmplifier.input = prevOutput;
    while (currentAmplifier.output === null && !currentAmplifier.waiting && !currentAmplifier.halted) {
      currentAmplifier.runStep();
    }
    if (currentAmplifier.output != null) {
      prevOutput = currentAmplifier.output;
    }
    currentAmplifier.output = null;
    if (!currentAmplifier.halted) {
      amplifierQueue.push(currentAmplifier);
    }
  }

  signals_02.set(phaseSequence.join(''), prevOutput);
}
console.log(`part 02 answer: ${Math.max(...[...signals_02.values()])}`);
