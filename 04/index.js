const candidates01 = [];
for (let i = 138241; i <= 674034; i++) {
  const digits = i.toString().split('').map(Number);
  if (digits[1] < digits[0] || digits[2] < digits[1] || digits[3] < digits[2] || digits[4] < digits[3] || digits[5] < digits[4]) {
    continue;
  }
  if (digits[1] !== digits[0] && digits[2] !== digits[1] && digits[3] !== digits[2] && digits[4] !== digits[3] && digits[5] !== digits[4]) {
    continue;
  }
  candidates01.push(i);
}

console.log(`part 01 answer: ${candidates01.length}`);

const candidates02 = [];
for (let i of candidates01) {
  const map = new Map();
  const digits = i.toString().split('').map(Number);
  for (let d of digits) {
    if (!map.has(d)) {
      map.set(d, 0);
    }
    map.set(d, map.get(d) + 1);
  }
  if ([...map.values()].filter(v => v === 2).length === 0) {
    continue;
  }
  candidates02.push(i);
}

console.log(`part 02 answer: ${candidates02.length}`);
