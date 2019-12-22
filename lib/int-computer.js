class IntComputer {
  constructor(instructions, getInput = () => null, printOutput = (output) => null, onHalted = () => null) {
    this.instructions = instructions;
    this.step = 0;
    this.relativeBase = 0;

    this.input = null;
    this.output = null;
    this.halted = false;

    this.getInput = getInput;
    this.printOutput = printOutput;
    this.onHalted = onHalted;
  }

  run() {
    this.output = null;
    while (!this.halted && this.output == null) {
      if (this.instructions[this.step] === 99) {
        this.halted = true;
      } else {
        let instruction = this.instructions[this.step] || 0;
        const operationStr = instruction.toString().padStart(5, '0');
        const [mode3, mode2, mode1, _, operation] = operationStr.split('').map(Number);

        let position1 = this.instructions[this.step + 1] || 0;
        let position2 = this.instructions[this.step + 2] || 0;
        let position3 = this.instructions[this.step + 3] || 0;

        if (mode1 === 2) {
          position1 = this.relativeBase + position1;
        }
        if (mode2 === 2) {
          position2 = this.relativeBase + position2;
        }
        if (mode3 === 2) {
          position3 = this.relativeBase + position3;
        }

        let parameter1 = mode1 === 1 ? position1 : (this.instructions[position1] || 0);
        let parameter2 = mode2 === 1 ? position2 : (this.instructions[position2] || 0);
        if (operation === 1) {
          this.instructions[position3] = parameter1 + parameter2;
          this.step = this.step + 4;
        } else if (operation === 2) {
          this.instructions[position3] = parameter1 * parameter2;
          this.step = this.step + 4;
        } else if (operation === 3) {
          this.input = this.getInput();
          this.instructions[position1] = this.input;
          this.step = this.step + 2;
        } else if (operation === 4) {
          this.output = parameter1;
          this.printOutput(this.output);
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
        } else if (operation === 9) {
          this.relativeBase = this.relativeBase + parameter1;
          this.step = this.step + 2;
        } else {
          throw new Error('Invalid input');
        }
      }
    }

    if (this.halted) {
      this.onHalted();
    }

    return this.halted ? null : this.output;
  }
}

module.exports = {IntComputer};