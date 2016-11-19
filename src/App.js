import Matrix from './Matrix';

export default class App {
  constructor(subscriber) {
    this.matrix = new Matrix(1, 0, 0, 1);
    this.subscriber = subscriber;
  }

  fire() {
    this.subscriber(this.matrix);
  }

  set state({ a, b, c, d }) {
    Object.assign(this.matrix, { a, b, c, d });
    this.fire();
  }
}
