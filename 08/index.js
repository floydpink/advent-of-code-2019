const fs = require('fs');

const inputPath = 'input.txt';
const layerSize = 150;
const layersCount = 100;

const pixels = fs.readFileSync(inputPath)
  .toString()
  .split('');

const layers = [];
let pixelsInLayers = pixels.slice();
for (let i = 0; i < layersCount; i++) {
  layers.push(pixelsInLayers.slice(0, layerSize));
  pixelsInLayers = pixelsInLayers.slice(layerSize);
}

// part 01
const layerStats = layers.map(l => {
  return {
    zero: l.filter(e => e === '0').length,
    one: l.filter(e => e === '1').length,
    two: l.filter(e => e === '2').length
  };
});

const fewestZeroes = Math.min(...layerStats.map(l => l.zero));
const fewestZeroLayer = layerStats.find(l => l.zero === fewestZeroes);
console.log(`part 01 answer: ${fewestZeroLayer.one * fewestZeroLayer.two}`);

// part 02
const finishedImage = [];
for (let i = 0; i < layerSize; i++) {
  for (let layer = 0; layer < layersCount; layer++) {
    if (layers[layer][i] !== '2') {
      finishedImage[i] = layers[layer][i];
      break;
    }
  }
}

let messageArray = finishedImage.join('')
  .replace(/0/g,' ')
  .replace(/1/g,'█')
  .match(/.{1,25}/g);
console.log(`part 02 answer:`);
console.log(messageArray); // => 'GKCKH'
