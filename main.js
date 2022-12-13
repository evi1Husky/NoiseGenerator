import NoiseGenerator from './NoiseGenerator.js';
import Oscilloscope from './Oscilloscope.js';
import StaticNoise from './StaticNoise.js';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const volume = document.querySelector('.volume');
const noiseButtons = document.querySelectorAll('.noise-button');
const displayButtons = document.querySelectorAll('.display-button');

let noiseType = 'white';
let displayType = 'waveform';
let noise = null;
let visualizer = new Oscilloscope(undefined);

playButton.onclick = () => {
  noise = new NoiseGenerator(noiseType);
  switch (displayType) {
    case 'waveform':
      visualizer = new Oscilloscope(noise.analyserNode);
      break;
    case 'static':
      visualizer = new StaticNoise(noise.analyserNode);
      break;
  }
  noise.amplitude = volume.value;
  noise.play();
  visualizer.start();
  playButton.style.display = 'none';
  stopButton.style.display = 'block';
}

stopButton.onclick = () => {
  noise.stop();
  visualizer.idle();
  noise = null;
  visualizer = null;
  playButton.style.display = 'block';
  stopButton.style.display = 'none';
}

for (let button of noiseButtons) {
  button.onclick = () => {
    noiseType = button.value;
    if (noise) {
      stopButton.click();
      playButton.click();
    }
  }
}

for (let button of displayButtons) {
  button.onclick = () => {
    displayType = button.value;
    if (noise) {
      stopButton.click();
      playButton.click();
    }
    console.log(displayType)
  }
}

volume.oninput = () => {
  if (noise) {
    noise.amplitude = volume.value;
  }
}
