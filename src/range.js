export default function* range(n) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}
