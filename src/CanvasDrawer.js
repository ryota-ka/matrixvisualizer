import range from './range';

export default class CanvasDrawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.shapeType = 0;
  }

  changeShapeType() {
    this.shapeType = (this.shapeType + 1) % 2;
  }

  render(matrix) {
    this.drawGrid();
    this.drawShape(matrix);
    this.drawEigenVectors(matrix);
  }

  drawShape(matrix) {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const { a, b, c, d, determinant } = matrix;

    ctx.setTransform(a, -c, b, -d, width / 2, height / 2);
    ctx.fillStyle = determinant > 0 ? 'rgba(64, 255, 64, 0.9)' : 'rgba(255, 64, 64, 0.9)';

    switch (this.shapeType) {
      case 0:
        ctx.beginPath();
        ctx.fillRect(-100, -100, 200, 200);
        break;
      case 1:
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }
  }

  drawEigenVectors(matrix) {
    if (matrix.eigenvectors.length === 0) return;

    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const l = matrix.eigenvalues.map(x => x.re);

    ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);
    ctx.strokeStyle = 'rgba(64, 64, 255, 0.9)';

    matrix.eigenvectors.map(([a, b]) => [a * 50, b * 50]).forEach(([x, y], i) => {
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(-x, y);
      ctx.lineTo(x, -y);
      ctx.stroke();

      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-x * l[i], y * l[i]);
      ctx.lineTo(x * l[i], -y * l[i]);
      ctx.stroke();
    });
  }

  drawGrid() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    for (let i of range(Math.ceil(canvas.width / 100))) {
      const [a, b] = [1, -1].map(sig => width / 2 + 50 * i * sig);

      ctx.beginPath();
      ctx.moveTo(a, 0);
      ctx.lineTo(a, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(b, 0);
      ctx.lineTo(b, height);
      ctx.stroke();
    }

    for (let i of range(Math.ceil(canvas.height / 100))) {
      const [a, b] = [1, -1].map(sig => height / 2 + 50 * i * sig);

      ctx.beginPath();
      ctx.moveTo(0, a);
      ctx.lineTo(width, a);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, b);
      ctx.lineTo(width, b);
      ctx.stroke();
    }
  }
}
