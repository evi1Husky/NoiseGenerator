export default

class StaticNoise {
  constructor(analyserNode) {
    this.canvas = document.getElementById("oscilloscope");
    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.willReadFrequently = true
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.canvasContext.fillStyle = "rgb(212, 245, 255)"
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.imageData =
      this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.imageDataLength = this.imageData.data.length;

    this.analyserNode = analyserNode;
    this.numberOfValues = analyserNode.frequencyBinCount;
    this.waveformData = new Uint8Array(this.numberOfValues);
  
    this.suspended = true;
  }

  start() {
    this.canvasContext.fillStyle = "rgb(212, 245, 255)";
    this.suspended = false;
    this.draw();
  }

  idle() {
    this.canvasContext.fillStyle = "rgb(0, 7, 7)";
    this.suspended = true;
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  findMinimumValue() {
    let value = 0, min = this.waveformData[0];
    for (let i = 1; i < this.numberOfValues; i++) {
      value = this.waveformData[i];
      if (value < min) {
        min = value;
      }
    }
    return min;
  }

  draw() {
    if (this.suspended) {
      window.cancelAnimationFrame(this.draw.bind(this))
      return;
    }
    window.requestAnimationFrame(this.draw.bind(this));

    this.analyserNode.getByteFrequencyData(this.waveformData);
    let min = this.findMinimumValue();

    let rnd = null;
    for (let i = 3; i < this.imageDataLength; i += 4) {
      rnd = (Math.random() * 3) | 0;
      if ((rnd === 0) || (rnd === 1)) {
        this.imageData.data[i] =
          this.waveformData[(Math.random() * this.numberOfValues) | 0];
        this.imageData.data[i] += (this.imageData.data[i] - min) * 3;
      } else {
        this.imageData.data[i] = 0;
      }
    }
    this.canvasContext.putImageData(this.imageData, 0, 0);
  }
}
