class Tools {
  static create2DArray(rows, cols) {
    let array = new Array(rows);
    for (let i = 0; i < rows; i++) {
      array[i] = new Array(cols);
    }
    
    return array;
  }
}