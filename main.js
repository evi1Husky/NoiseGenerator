import Oscilloscope from './Oscilloscope.js';
import NoiseGenerator from './NoiseGenerator.js';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const volume = document.querySelector('.volume');
const noiseButtons = document.querySelectorAll('.noise-button');

let noiseType = 'white';
let noise = null;
let oscilloscope = new Oscilloscope();

playButton.onclick = () => {
  noise = new NoiseGenerator(noiseType);
  oscilloscope = new Oscilloscope(noise.analyserNode);
  noise.amplitude = volume.value;
  noise.play();
  oscilloscope.start();
  playButton.style.display = 'none';
  stopButton.style.display = 'block';
}

stopButton.onclick = () => {
  noise.stop();
  oscilloscope.stop();
  noise = null;
  oscilloscope = null;
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
