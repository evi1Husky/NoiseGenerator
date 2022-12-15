export default

class StaticNoise {
  constructor(analyserNode) {
    this.canvas = document.getElementById("oscilloscope");
    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.willReadFrequently = true;

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

  draw() {
    if (this.suspended) {
      window.cancelAnimationFrame(this.draw.bind(this))
      return;
    }
    window.requestAnimationFrame(this.draw.bind(this));

    this.analyserNode.getByteFrequencyData(this.waveformData);
    const minimumValue = Math.min(...this.waveformData);
  
    let random = null;
    for (let i = 3; i < this.imageDataLength; i += 4) {
      random = (Math.random() * 3) | 0;
      switch (random) {
        case 0:
          this.imageData.data[i] = 0;
          break;
        default:
          this.imageData.data[i] =
          this.waveformData[(Math.random() * this.numberOfValues) | 0];
          this.imageData.data[i] += (this.imageData.data[i] - minimumValue) * 3;
          break;
      }
    }

    this.canvasContext.putImageData(this.imageData, 0, 0);
  }
}
