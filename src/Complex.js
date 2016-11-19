export default class Complex {
  constructor(re, im) {
    Object.assign(this, { re, im });
  }

  equals(other) {
    return [
      other instanceof Complex,
      Math.abs(this.re - other.re) < Number.EPSILON,
      Math.abs(this.im - other.im) < Number.EPSILON,
    ].every(x => x);
  }

  get isImaginary() {
    return this.im !== 0;
  }

  get isReal() {
    return this.im === 0;
  }

  toString() {
    return this.im === 0 ? this.re.toString() : `${this.re}+${this.im}i`;
  }
}
