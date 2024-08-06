const DEFAULT_RES = 20;
let res = DEFAULT_RES;
let framerate = 3;
let FontSize;

let len;
let rows, cols;

let deadColor;
let aliveColor;
let gridColor;

let img = [];
let imgSrc = [
  'assets/virus.png',
  'assets/fire.png',
  'assets/earth.png',
  'assets/frog.png',
  'assets/car.png',
  'assets/cursor.png',
  'assets/drop.png',
  'assets/error.png',
  'assets/flower.png',
  'assets/ant.png',
  'assets/mushroom.png',
  'assets/planet.png',
  'assets/book.png',
  'assets/tornado.png',
  'assets/sun.png',
  'assets/tree.png',
  'assets/cloud.png',
  'assets/butterfly.png',
  'assets/house.png',
  'assets/walle.png',
  'assets/law.png',
  'assets/crown.png',
  'assets/euro.png',
  'assets/human.png',
];
let activeImgIndex;
let activeImg;
let imgIndex;

let grid;
const ALIVE_PROB = 0.2;
let prob = ALIVE_PROB;

let redrawGrid = true;
let showGrid = false;
let showHelp = false;

let instructions = [
  "wer stört Ökosysteme?",
  "welche politischen Systeme sind stabil?",
  "wann versagen Finanzsysteme?",
  "Wo funktionieren Wirtschaftssysteme?",
  "Was soll dieses Verkehrssystem?",
  "Wo liegt das Ökosystem?",
  "Was fehlt im Bildungssystem?",
  "Wer repariert das Betriebssystem?",
  "Was machst du im Sozialsystem?",
  "Für wen ist das Wirtschaftssystem?",
  "welche politischen Systeme sind instabil?",
  "Wie funktionieren Wirtschaftssysteme?",
  "Was versprechen politische Systeme?",
  "wer stört das Sozialsystem?",
  "wann versagen Finanzsysteme?",
  "Wer gehört zum Gesellschaftssystem?",
  "wo versagen Finanzsysteme?",
  "Was erzählt das System?",
  "Was erzählt das System?",
  "Was erzählt das System?",
  "Was erzählt das System?",
  "Was erzählt das System?",
  "Was erzählt das System?",
  "Was erzählt das System?",
]

let instCount;
let timer = 0;
let p;

let button;
let playButton;
let infoVisible = false;
let infoContainer;
let reload

let slider;
let handCursor;

function preload() {
  Cascadia = loadFont("assets/CascadiaCode.ttf");
  CascadiaItalic = loadFont("assets/CascadiaCodeItalic.ttf");

  // img.apply(null, Array(10)).map((i) => loadImage(imgSrc[i])
  for (let i = 0; i < imgSrc.length; i++) {
    img[i] = loadImage(imgSrc[i]);    
  }

}


function setup() {
  createCanvas(windowWidth, windowHeight);
  p = select('.instructions')
  p.html(instructions[activeImgIndex])

  //info-button
  button = select('.info-button');
  button.mouseClicked(() => { 
    infoVisible = !infoVisible;
    redrawGrid = !redrawGrid   
  });
  
  reload = select(".reload-button")
  reload.mouseClicked(() => { 
    resetSketch();
  });

  infoContainer = select('.info-container')
  
  playButton = select('.play-button')
  playButton.mouseClicked(() => { 
    redrawGrid = !redrawGrid  
    redrawGrid ? playButton.html('⏸') : playButton.html('▶')
  });

  slider = select('#zoom') // min, max, 
  framerateSlider = select('#framerate') // min, max, 
  frameRate(framerateSlider.value());

  slider.changed(() => {
    res = slider.value();
    removeElements();
    resetSketch()
  });

  resetSketch();

}

function resetSketch() {
  res = slider.value();

  let temp = height > width ? width : height;
  len = temp / res;

  rows = ceil(height / len);
  cols = ceil(width / len);

  deadColor = color(255);
  aliveColor = color(0,0);
  activeImg = select('.active-img');

  gridColor = color(0, 0, 255);
  FontSize = temp / DEFAULT_RES;

  grid = new Grid(rows, cols, len, [deadColor, aliveColor], img);
  grid.genorate(prob);
  activeImgIndex = int(random(img.length));

}

function draw() {
  background(deadColor);
  // background(0,0,255);
  frameRate(framerateSlider.value());

  if (showGrid) {
    push();
    stroke(gridColor);
    strokeWeight(1);
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
    grid.update(activeImgIndex);
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
      let clicked = true;

      if(grid.grid[y][x] == 1){
        grid.grid[y][x] = 0; //remove clicked img
        activeImgIndex = grid.imgGrid[y][x] //take on clicked img
      } else {
        grid.grid[y][x] = 1; // place active Img
        grid.imgGrid[y][x] = activeImgIndex; //display active img
        grid.update(activeImgIndex, clicked);
      }

    } else if (mouseButton === RIGHT) {
      grid.grid[y][x] = 0;
    }
  }

  //info
  if (infoVisible) {
    // showInfo();
    infoContainer.style('transform', 'scale(1)')
    button.html('&times;')
    // redrawGrid = false
  } else {
    infoContainer.style('transform', 'scale(0)')
    button.html('i')
    // redrawGrid = true

  }


  p.html(instructions[activeImgIndex])

  //activeImgIndex display
  image(img[activeImgIndex], mouseX - 50, mouseY - 50, img[activeImgIndex].width/3, img[activeImgIndex].height/3)
  activeImg.attribute('src', imgSrc[activeImgIndex])

  // if(activeImgIndex == 14){
  //   deadColor = color(0);
  // } else if(activeImgIndex == 6){
  //   deadColor = color(0, 0, 255);
  // } else{
  //   deadColor = color(255);
  // }
}


function showInfo() {
  push();
  let fontSize = FontSize / 1.5;
  let x = width / 2;
  let y = height / 2 - fontSize * 8;

  // rectMode(CENTER);
  // stroke(255);
  // strokeWeight(5);
  fill(0, 0, 255);
  rect(10, 10, fontSize * 25, fontSize * 18);

  // strokeWeight(3);
  // textFont(Cascadia);
  textSize(fontSize);
  // textAlign(CENTER);
  fill(255);

  textStyle(BOLD);
  text(`Conway's Game of Life by S.Y. Kim.`, 15, 80);

  // textStyle(NORMAL);
  // text(`Press 'R' to reset grid.`, x, y + fontSize * 3);
  // text(`Press 'T' to reset grid with no cells.`, x, y + fontSize * 4);
  // text(`Press 'N' to advance a single step.`, x, y + fontSize * 5);
  // text(`Press 'G' to toggle grid lines.`, x, y + fontSize * 6);

  // text(`Press '[[]' to decrease cell resolution.`, x, y + fontSize * 8);
  // text(`Press ']' to increase cell resolution.`, x, y + fontSize * 9);
  // text(`Press '\\' to reset cell resolution.`, x, y + fontSize * 10);

  // text(`Press Mouse Left to set cell to alive.`, x, y + fontSize * 12);
  // text(`Press Mouse Right to set cell to dead.`, x, y + fontSize * 13);
  // text(`Press Mouse Center or 'P' to pause/play.`, x, y + fontSize * 14);

  // text(`Hold 'H' to show help message box.`, x, y + fontSize * 16);
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
    grid.update(activeImgIndex);
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
