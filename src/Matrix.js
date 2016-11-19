import Complex from './Complex';

export default class Matrix {
  constructor(a, b, c, d) {
    Object.assign(this, { a, b, c, d });
  }

  get determinant() {
    return this.a * this.d - this.b * this.c;
  }

  get trace() {
    return this.a + this.d;
  }

  get eigenvalues() {
    const { determinant, trace } = this;
    const discriminant = (trace ** 2 - 4 * determinant) / 4;
    const rootD = Math.sqrt(Math.abs(discriminant));

    return [1, -1].map(sig => discriminant >= 0 ?
      new Complex(trace / 2 + sig * rootD, 0) :
      new Complex(trace / 2, sig * rootD)
    );
  }

  get eigenvectors() {
    const { determinant, trace } = this;
    const discriminant = (trace ** 2 - 4 * determinant) / 4;

    if (discriminant < 0) return [];

    const [l0, l1] = this.eigenvalues.map(x => x.re);
    const { a, b, c, d } = this;
    const [[s, t], [u, v]] = [[a - l1, c], [b, d - l0]];
    const [n0, n1] = [s * s + t * t, u * u + v * v].map(Math.sqrt);
    const [x, y] = [[s / n0, t / n0], [u / n1, v / n1]]

    if (l0 === 0) return [y];
    if (l1 === 0) return [x];

    return [x, y];
  }
}
