var canvas, ctx, a, b, c, d;
var matrix = {a: 1, b: 0, c: 0, d: 1, det: 1, tr: 2};
var eigenValue = [1, 1];
var eigenVector = [[0, 0], [0, 0]];
var shapeType = 0;

window.onload = function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  a = document.getElementById('matrix_a');
  b = document.getElementById('matrix_b');
  c = document.getElementById('matrix_c');
  d = document.getElementById('matrix_d');

  resize();
  calc();

  canvas.addEventListener('click', function() {
    shapeType++;
    if (shapeType === 2) {
      shapeType = 0;
    }
    draw();
  });
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.setTransform(matrix.a, -matrix.c, matrix.b, -matrix.d, canvas.width * 0.5, canvas.height * 0.5);

  if (matrix.det > 0) {
    ctx.fillStyle = 'rgba(64, 255, 64, 0.7)';
  } else {
    ctx.fillStyle = 'rgba(255, 64, 64, 0.7)';
  }

  switch (shapeType) {
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

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawGrid();

  ctx.setTransform(1, 0, 0, 1, canvas.width * 0.5, canvas.height * 0.5);
  ctx.strokeStyle = 'rgba(64, 64, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-50 * eigenValue[0] * eigenVector[0][0], 50 * eigenValue[0] * eigenVector[0][1]);
  ctx.lineTo(50 * eigenValue[0] * eigenVector[0][0], -50 * eigenValue[0] * eigenVector[0][1]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-50 * eigenValue[1] * eigenVector[1][0], 50 * eigenValue[1] * eigenVector[1][1]);
  ctx.lineTo(50 * eigenValue[1] * eigenVector[1][0], -50 * eigenValue[1] * eigenVector[1][1]);
  ctx.stroke();
}

function resize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.5, 0);
  ctx.lineTo(canvas.width * 0.5, canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.5);
  ctx.lineTo(canvas.width, canvas.height * 0.5);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  for (var i = 1; i < canvas.width / 100; i++) {
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.5 + 50 * i, 0);
    ctx.lineTo(canvas.width * 0.5 + 50 * i, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.5 - 50 * i, 0);
    ctx.lineTo(canvas.width * 0.5 - 50 * i, canvas.height);
    ctx.stroke();
  }

  for (var i = 1; i < canvas.height / 100; i++) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5 + 50 * i);
    ctx.lineTo(canvas.width, canvas.height * 0.5 + 50 * i);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5 - 50 * i);
    ctx.lineTo(canvas.width, canvas.height * 0.5 - 50 * i);
    ctx.closePath();
    ctx.stroke();
  }
}

window.onresize = function() {
  resize();
  draw();
}

function calc() {
  if (isNumeric(a.value) && isNumeric(b.value) && isNumeric(c.value) && isNumeric(d.value)) {
    matrix.a = parseFloat(a.value);
    matrix.b = parseFloat(b.value);
    matrix.c = parseFloat(c.value);
    matrix.d = parseFloat(d.value);
    matrix.det = matrix.a * matrix.d - matrix.b * matrix.c;
    matrix.tr = matrix.a + matrix.d;
    document.getElementById('det').textContent = 'determinant: ' + Math.round(matrix.det * 1000) / 1000;
    document.getElementById('tr').textContent = 'trace: ' + Math.round(matrix.tr * 1000) / 1000;

    var discriminant = matrix.tr * matrix.tr - 4 * matrix.det;

    if (discriminant >= 0) {
      var rootd = Math.sqrt(discriminant);
      if (matrix.b === 0 && matrix.c === 0) {
        eigenValue[0] = matrix.d;
        eigenValue[1] = matrix.a;
        eigenVector[0][0] = 0;
        eigenVector[0][1] = 1;
        eigenVector[1][0] = 1;
        eigenVector[1][1] = 0;
      } else {
        eigenValue[0] = (matrix.tr + rootd) * 0.5;
        eigenValue[1] = (matrix.tr - rootd) * 0.5;
        eigenVector[0][0] = matrix.b / Math.sqrt(matrix.b * matrix.b + (matrix.d - eigenValue[1]) * (matrix.d - eigenValue[1]));
        eigenVector[0][1] = (matrix.d - eigenValue[1]) / Math.sqrt(matrix.b * matrix.b + (matrix.d - eigenValue[1]) * (matrix.d - eigenValue[1]));
        eigenVector[1][0] = (matrix.a - eigenValue[0]) / Math.sqrt(matrix.c * matrix.c + (matrix.a - eigenValue[0]) * (matrix.a - eigenValue[0]));
        eigenVector[1][1] = matrix.c / Math.sqrt(matrix.c * matrix.c + (matrix.a - eigenValue[0]) * (matrix.a - eigenValue[0]));
      }

      document.getElementById('eigenvalues').textContent = 'eigenvalue' + (eigenValue[0] == eigenValue[1] ? ': ' + Math.round(eigenValue[0] * 1000) / 1000 : 's: ' + Math.round(eigenValue[0] * 1000) / 1000 + ', ' + Math.round(eigenValue[1] * 1000) / 1000);
      if (matrix.det === 0) {
        if (!isNumeric(eigenVector[0][0]) && isNumeric(eigenVector[1][0])) {
          eigenVector[0][0] = eigenVector[1][0];
          eigenVector[0][1] = eigenVector[1][1];
        }
        if (isNumeric(eigenVector[0][0]) && !(matrix.a === 0 && matrix.b === 0 && matrix.c === 0 && matrix.d === 0)) {
          document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(eigenVector[0][1] * 1000) / 1000 + ')';
        } else {
          document.getElementById('eigenvectors').textContent = '';
        }
      } else if (eigenValue[0] == eigenValue[1]) {
        if (matrix.a !== 0 && matrix.a === matrix.d && matrix.b === 0 && matrix.c === 0) {
          document.getElementById('eigenvectors').textContent = 'eigenvectors: any vectors';
        } else {
          if (!isNumeric(eigenVector[0][0]) && isNumeric(eigenVector[1][0])) {
            eigenVector[0][0] = eigenVector[1][0];
            eigenVector[0][1] = eigenVector[1][1];
          }
          if (isNumeric(eigenVector[0][0])) {
            document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(eigenVector[0][1] * 1000) / 1000 + ')';
          }
         }
      } else {
        if (isNumeric(eigenVector[0][0]) && isNumeric(eigenVector[1][0])) {
          document.getElementById('eigenvectors').textContent = 'eigenvectors: (' + Math.round(eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(eigenVector[0][1] * 1000) / 1000 + '), (' + Math.round(eigenVector[1][0] * 1000) / 1000 + ', ' + Math.round(eigenVector[1][1] * 1000) / 1000 + ')';
        } else {
          if (!isNumeric(eigenVector[0][0]) && isNumeric(eigenVector[1][0])) {
            eigenVector[0][0] = eigenVector[1][0];
            eigenVector[0][1] = eigenVector[1][1];
          }
          if (isNumeric(eigenVector[0][0])) {
            document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(eigenVector[0][1] * 1000) / 1000 + ')';
          } else {
            document.getElementById('eigenvectors').textContent = '';
          }
        }
      }
    } else {
      var rootd = Math.sqrt(-discriminant);
      document.getElementById('eigenvalues').textContent = 'eigenvalues: ' + Math.round(matrix.tr * 500) / 1000 + ' ±' + Math.round(matrix.tr * 500) / 1000 + 'i';
      document.getElementById('eigenvectors').textContent = '';
      eigenValue = [0, 0];
      eigenVector = [[0, 0], [0, 0]];
    }

    draw();
  }
}

function isNumeric(x){
  if (typeof x !== 'number' && typeof x !== 'string') {
    return false;
  } else {
    return (x == parseFloat(x) && isFinite(x));
  }
}

window.onkeypress = function() {
  calc();
}

