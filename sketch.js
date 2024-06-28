const DEFAULT_RES = 15;
let res = DEFAULT_RES;
let FontSize;

let len;
let rows, cols;

let deadColor;
let aliveColor;
let gridColor;

let img = [];
let activeImg;
let imgIndex;

let grid;
const ALIVE_PROB = 0.2;
let prob = ALIVE_PROB;

let redrawGrid = true;
let showGrid = false;
let showHelp = false;

function preload() {
  Cascadia = loadFont("assets/CascadiaCode.ttf");
  CascadiaItalic = loadFont("assets/CascadiaCodeItalic.ttf");
  img[0] = loadImage('assets/virus.png');
  img[1] = loadImage('assets/fire.png');
  img[2] = loadImage('assets/earth.png');
  img[3] = loadImage('assets/frog.png');
  img[4] = loadImage('assets/boat.png');
  img[5] = loadImage('assets/cursor.png');
  img[6] = loadImage('assets/drop.png');
  img[7] = loadImage('assets/error.png');
  img[8] = loadImage('assets/euro.png');
  img[9] = loadImage('assets/flower.png');
  img[10] = loadImage('assets/fly.png');
  img[11] = loadImage('assets/human.png');
  img[12] = loadImage('assets/mushroom.png');
  img[13] = loadImage('assets/planet.png');
  img[14] = loadImage('assets/right.png');
  img[15] = loadImage('assets/tornado.png');
  img[16] = loadImage('assets/sun.png');
  img[17] = loadImage('assets/tree.png');
  img[18] = loadImage('assets/cloud.png');


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(400, 400);
  frameRate(7);

  let temp = height > width ? width : height;
  len = temp / res;

  rows = ceil(height / len);
  cols = ceil(width / len);

  deadColor = 255;
  aliveColor = 0;
  activeImg = img[0];
  
  gridColor = color(220, 220, 80);

  FontSize = temp / DEFAULT_RES;
  //index = int(random(0, 2));
  // imgIndex = 0;

  grid = new Grid(rows, cols, len, [deadColor, aliveColor], img);
  grid.genorate(prob);
  
}

function draw() {
  background(deadColor);

  if (showGrid) {
    push();
    stroke(gridColor);
    strokeWeight(5);
    for (let x = 0; x < cols; x++) {
      line(x * len, 0, x * len, height);
    }
    for (let y = 0; y < rows; y++) {
      line(0, y * len, width, y * len);
    }
    pop();
  }

  grid.show();

  if (redrawGrid) {
    grid.update();
  } else {
    push();
    textFont(CascadiaItalic);
    textSize(FontSize);
    textStyle(ITALIC);
    stroke(255);
    strokeWeight(5);
    fill(0, 255, 0);
    text("PAUSED", 10, FontSize);
    pop();
  }

  // User Interrupt.
  if (mouseIsPressed) {
    let x = floor(mouseX / grid.len);
    let y = floor(mouseY / grid.len);

    let xBound = 0 <= x && x < grid.cols;
    let yBound = 0 <= y && y < grid.rows;
    if (!xBound || !yBound) {
      return;
    }

    if (mouseButton === LEFT) {
      grid.grid[y][x] = 1;
    } else if (mouseButton === RIGHT) {
      grid.grid[y][x] = 0;
    }
  }
}

function showInfo() {
  push();
  let fontSize = FontSize / 1.5;
  let x = width / 2;
  let y = height / 2 - fontSize * 8;

  rectMode(CENTER);
  stroke(255);
  strokeWeight(5);
  fill(255, 200);
  rect(width / 2, height / 2, fontSize * 25, fontSize * 18);

  strokeWeight(3);
  textFont(Cascadia);
  textSize(fontSize);
  textAlign(CENTER);
  fill(0);

  textStyle(BOLD);
  text(`Conway's Game of Life by S.Y. Kim.`, x, y + fontSize);

  textStyle(NORMAL);
  text(`Press 'R' to reset grid.`, x, y + fontSize * 3);
  text(`Press 'T' to reset grid with no cells.`, x, y + fontSize * 4);
  text(`Press 'N' to advance a single step.`, x, y + fontSize * 5);
  text(`Press 'G' to toggle grid lines.`, x, y + fontSize * 6);

  text(`Press '[[]' to decrease cell resolution.`, x, y + fontSize * 8);
  text(`Press ']' to increase cell resolution.`, x, y + fontSize * 9);
  text(`Press '\\' to reset cell resolution.`, x, y + fontSize * 10);

  text(`Press Mouse Left to set cell to alive.`, x, y + fontSize * 12);
  text(`Press Mouse Right to set cell to dead.`, x, y + fontSize * 13);
  text(`Press Mouse Center or 'P' to pause/play.`, x, y + fontSize * 14);

  text(`Hold 'H' to show help message box.`, x, y + fontSize * 16);
  pop();
}

function mousePressed() {
  if (mouseButton === CENTER) {
    redrawGrid = !redrawGrid;
  }
}

function keyPressed() {
  if (keyCode === "R".charCodeAt(0)) {
    prob = ALIVE_PROB;
    setup();
  } else if (keyCode === "T".charCodeAt(0)) {
    prob = 0;
    setup();
  } else if (keyCode === "N".charCodeAt(0)) {
    grid.update();
  } else if (keyCode === "G".charCodeAt(0)) {
    showGrid = !showGrid;
  } else if (keyCode === "S".charCodeAt(0)) {
    // '[' key
    res--;
    setup();
  } else if (keyCode === "W".charCodeAt(0)) {
    // ']' key
    res++;
    setup();
  } else if (keyCode === 220) {
    // '\' key
    res = DEFAULT_RES;
    setup();
  } else if (keyCode === "P".charCodeAt(0)) {
    redrawGrid = !redrawGrid;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
