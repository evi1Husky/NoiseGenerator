export default

class NoiseGenerator {
  constructor(type) {
    this.audioContext = new window.AudioContext();

    switch (type) {
      case 'white':
        this.noise = this.makeWhiteNoise();
        break;
      case 'pink':
        this.noise = this.makePinkNoise();
        break;
      case 'brown':
        this.noise = this.makeBrownianNoise();
        break;
    }

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(0.1, 0);

    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    this.noise.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.connect(this.analyserNode);
  }

  play() {
    this.noise.loop = true;
    this.noise.start(0);
  }

  stop() {
    this.noise.stop();
    this.audioContext.close();
  }

  set amplitude(value) {
    this.gainNode.gain.value = Number(value);
  }

  makeWhiteNoise() {
    const sampleRate = this.audioContext.sampleRate * 8.0;
    const buffer =
    this.audioContext.createBuffer(2, sampleRate, this.audioContext.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const buffering = buffer.getChannelData(channel);
      for (let index = 0; index < sampleRate; index++) {
        buffering[index] = Math.random() * 2 - 1;
      }
    }
    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = buffer;
    return whiteNoise;
  }

  makePinkNoise() {
    const sampleRate = this.audioContext.sampleRate * 8.0;
    const buffer =
    this.audioContext.createBuffer(2, sampleRate, this.audioContext.sampleRate);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let channel = 0; channel < 2; channel++) {
      const buffering = buffer.getChannelData(channel);
      for (let index = 0; index < sampleRate; index++) {
        const whiteNoise = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + whiteNoise * 0.0555179;
        b1 = 0.99332 * b1 + whiteNoise * 0.0750759;
        b2 = 0.96900 * b2 + whiteNoise * 0.1538520;
        b3 = 0.86650 * b3 + whiteNoise * 0.3104856;
        b4 = 0.55000 * b4 + whiteNoise * 0.5329522;
        b5 = -0.7616 * b5 - whiteNoise * 0.0168980;
        buffering[index] =
          b0 + b1 + b2 + b3 + b4 + b5 + b6 + whiteNoise * 0.5362;
        buffering[index] *= 0.16; // gain compensation 0.11
        b6 = whiteNoise * 0.115926;
      }
    }
    const pinkNoise = this.audioContext.createBufferSource();
    pinkNoise.buffer = buffer;
    return pinkNoise;
  }

  makeBrownianNoise() {
    const sampleRate = this.audioContext.sampleRate * 8.0;
    const buffer =
    this.audioContext.createBuffer(2, sampleRate, this.audioContext.sampleRate);
    let lastOut = 0.0;
    for (let channel = 0; channel < 2; channel++) {
      const buffering = buffer.getChannelData(channel);
      for (let index = 0; index < sampleRate; index++) {
        const whiteNoise = Math.random() * 2 - 1;
        buffering[index] = (lastOut + (0.02 * whiteNoise)) / 1.02;
        lastOut = buffering[index];
        buffering[index] *= 4.5; // gain compensation
      }
    }
    const brownianNoise = this.audioContext.createBufferSource();
    brownianNoise.buffer = buffer;
    return brownianNoise;
  }
}
