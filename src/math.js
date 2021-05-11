function addVector(a, b) {
  return a.map((e, i) => e + b[i])
}

function vectorMulScalar(a, b) {
  return a.map((e, i) => e * b)
}

export { addVector, vectorMulScalar }
