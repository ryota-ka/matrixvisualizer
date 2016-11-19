import 'babel-polyfill';

import App from './App';
import CanvasDrawer from './CanvasDrawer';
import Info from './Info';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const canvasDrawer = new CanvasDrawer(canvas);
  const info = new Info();

  const app = new App(matrix => {
    canvasDrawer.render(matrix);
    info.render(matrix);
  });

  const fields = {
    a: document.getElementById('matrix_a'),
    b: document.getElementById('matrix_b'),
    c: document.getElementById('matrix_c'),
    d: document.getElementById('matrix_d'),
  };

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = document.documentElement;
    Object.assign(canvas, { width, height });

    app.fire();
  };

  const update = () => {
    const a = Number(fields.a.value) || 0;
    const b = Number(fields.b.value) || 0;
    const c = Number(fields.c.value) || 0;
    const d = Number(fields.d.value) || 0;

    app.state = { a, b, c, d };
  };

  window.addEventListener('resize', resize);
  window.addEventListener('keyup', update);
  canvas.addEventListener('click', () => {
    canvasDrawer.changeShapeType();
    app.fire();
  });

  resize();
  update();
});
