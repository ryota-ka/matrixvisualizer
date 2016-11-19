function round(x) {
  return Math.round(x * 1000) / 1000;
}

export default class Info {
  constructor() {
    this.elems = {
      trace: document.getElementById('trace'),
      determinant: document.getElementById('determinant'),
      eigenvalues: document.getElementById('eigenvalues'),
      eigenvectors: document.getElementById('eigenvectors'),
    }
  }

  determinant(matrix) {
    return `determinant: ${round(matrix.determinant)}`;
  }

  eigenvalues(matrix) {
    const [x, y] = matrix.eigenvalues;

    switch (true) {
      case (x.equals(y)):
        return `eigenvalue: ${round(x)}`;

      case x.isReal && y.isReal:
        return `eigenvalues: ${round(x.re)}, ${round(y.re)}`;

      default:
        return `eigenvalues: ${round(x.re)} ± ${round(x.im)}i`;
    }
  }

  eigenvectors(matrix) {
    const { a, b, c, d } = matrix;
    if (a === d && b === 0 && c === 0) return 'eigenvectors: any vector';

    switch (matrix.eigenvectors.length) {
      case 0: {
        return '';
      }

      case 1: {
        const [[s, t]] = matrix.eigenvectors;
        return `eigenvector: (${round(s)}, ${round(t)})`;
      }

      case 2: {
        const [[s, t], [u, v]] = matrix.eigenvectors;
        return s === u && t === v ?
          `eigenvector: (${round(s)}, ${round(t)})`:
          `eigenvectors: (${round(s)}, ${round(t)}), (${round(u)}, ${round(v)})`
        ;
      }
    }
  }

  trace(matrix) {
    return `trace: ${round(matrix.trace)}`;
  }

  render(matrix) {
    Object.keys(this.elems).forEach(key => this.elems[key].textContent = this[key](matrix));
  }
}
