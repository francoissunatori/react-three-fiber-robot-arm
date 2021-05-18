function getJsArrayFromStdVector(pStdVector) {
  let lArray = [];

  for (let i = 0; i < pStdVector.size(); i++) {
    lArray.push(pStdVector.get(i));
  }

  return lArray;
}

export {
  getJsArrayFromStdVector
}
