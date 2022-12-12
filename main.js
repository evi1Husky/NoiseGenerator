import NoiseGenerator from './NoiseGenerator.js';
import Oscilloscope from './Oscilloscope.js';
import StaticNoise from './StaticNoise.js';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const volume = document.querySelector('.volume');
const noiseButtons = document.querySelectorAll('.noise-button');

let noiseType = 'white';
let noise = null;
let lineColor = "rgb(187, 230, 230)"
let backgroundColor = "rgb(0, 7, 7)";
// let oscilloscope = new Oscilloscope(undefined, lineColor, backgroundColor);
let staticNoise = null;

playButton.onclick = () => {
  noise = new NoiseGenerator(noiseType);
  staticNoise = new StaticNoise(noise.analyserNode)
  // oscilloscope = new Oscilloscope(noise.analyserNode, lineColor, backgroundColor);
  noise.amplitude = volume.value;
  noise.play();
  staticNoise.start()
  // oscilloscope.start();
  playButton.style.display = 'none';
  stopButton.style.display = 'block';
}

stopButton.onclick = () => {
  noise.stop();
  // oscilloscope.stop();
  staticNoise.idle();
  noise = null;
  staticNoise = null;
  // oscilloscope = null;
  playButton.style.display = 'block';
  stopButton.style.display = 'none';
}

for (let button of noiseButtons) {
  button.onclick = () => {
    noiseType = button.id;
    if (noise) {
      stopButton.click();
      playButton.click();
    }
  }
}

volume.oninput = () => {
  if (noise) {
    noise.amplitude = volume.value;
  }
}
