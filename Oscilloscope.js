export default 

class Oscilloscope {
  constructor(analyserNode) {
    this.canvas = document.getElementById("oscilloscope");
    this.canvasContext = this.canvas.getContext("2d");

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvasContext.fillStyle = "rgb(0, 7, 7)";
    this.canvasContext.strokeStyle = "rgb(187, 230, 230)";
    this.canvasContext.lineWidth = 1.9;

    this.suspended = true;

    this.analyserNode = analyserNode;
    this.numberOfValues = this.analyserNode.frequencyBinCount;
    this.waveformData = new Uint8Array(this.numberOfValues);
  }

  idle() {
    this.suspended = true;
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(0, this.canvas.height / 2);
    this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
    this.canvasContext.stroke();
  }

  start() {
    this.suspended = false;
    this.draw()
  }

  draw() {
    if (this.suspended) {
      window.cancelAnimationFrame(this.draw.bind(this));
      return;
    }
    window.requestAnimationFrame(this.draw.bind(this));

    this.analyserNode.getByteTimeDomainData(this.waveformData);
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);  
    this.canvasContext.beginPath();

    let x = 0;
    for (let i = 0; i < this.numberOfValues; i++) {
      const y = ((this.waveformData[i] / 128.0) * this.canvas.height) / 2;
      switch (i) {
        case 0:
          this.canvasContext.moveTo(x, y);
          break;
        default:
          this.canvasContext.lineTo(x, y);
          break;
      }
      x += (this.canvas.width * 1.0) / this.numberOfValues;
    }

    this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
    this.canvasContext.stroke();
  }
}
