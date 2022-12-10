import Oscilloscope from './Oscilloscope.js';
import NoiseGenerator from './NoiseGenerator.js';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const volume = document.querySelector('.volume');

let noise = null;
let oscilloscope = new Oscilloscope();

playButton.onclick = () => {
  // noise = new NoiseGenerator('white');
  // noise = new NoiseGenerator('pink');
  noise = new NoiseGenerator('brown');
  noise.amplitude = volume.value;
  noise.play();
  oscilloscope = new Oscilloscope(noise.analyserNode);
  oscilloscope.start()
  playButton.style.display = 'none';
  stopButton.style.display = 'block';
};

stopButton.onclick = () => {
  noise.stop();
  oscilloscope.idle();
  playButton.style.display = 'block';
  stopButton.style.display = 'none';
};

volume.oninput = () => {
  if (noise) {
    noise.amplitude = volume.value;
  }
}
