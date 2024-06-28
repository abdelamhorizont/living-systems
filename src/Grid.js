class Grid {
  constructor(rows, cols, len, color, img, imgIndex) {
    this.rows = rows;
    this.cols = cols;
    this.len = len;
    this.color = color;
    this.img = img;
    this.imgIndex = imgIndex;
    
    this.grid = Tools.create2DArray(this.rows, this.cols);
    this.imgGrid = Tools.create2DArray(this.rows, this.cols);

  }
  
  genorate(prob) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {

        let rand = random(1);
        let state = rand < prob ? 1 : 0;
        this.grid[y][x] = state;
        this.imgGrid[y][x] = int(random(img.length));

      }
    }
  }
  
  countNeighbor(x, y, grid) {
    let neighborCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        let row = (y + dy + this.rows) % this.rows;
        let col = (x + dx + this.cols) % this.cols;
        
        neighborCount += grid[row][col];
      }
    }
    
    neighborCount -= this.grid[y][x];
    return neighborCount;
  }
  
  update() {
    let next = Tools.create2DArray(this.rows, this.cols);

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let state = this.grid[y][x];
        let neighborCount = this.countNeighbor(x, y, this.grid);
        
        if (state) {
          let condition = neighborCount === 2 || neighborCount === 3;
          next[y][x] = condition ? 1 : 0;
        } else {
          next[y][x] = neighborCount === 3 ? 1 : 0;
        }
      }
    }
    
    this.grid = next;
  }
  
  show() {
    noStroke();
    
    let offset = 2;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let state = this.grid[y][x];
        
        fill(this.color[state]);
        imgIndex = this.imgGrid[y][x]
        
        if(state == 0){
          rect(x * len + offset, y * len + offset, len - offset * 2, len - offset * 2);
        } else {
          image(img[imgIndex],x * len + offset, y * len + offset, len - offset * 2, len - offset * 2);
        }

      }
    }
  }
}