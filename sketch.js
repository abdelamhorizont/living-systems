const DEFAULT_RES = 20;
let res = DEFAULT_RES;
let speed = 20;
const speedSteps = 2;

// 'add' or 'remove' elements from grid when moving mouse
// default 'null'
let editMode = null;

let FontSize;

let len;
let rows, cols;

let deadColor;
let aliveColor;
let gridColor;

let img = [];
const imgSrc = [
  "assets/virus.png",
  "assets/fire.png",
  "assets/earth.png",
  "assets/frog.png",
  "assets/car.png",
  "assets/cursor.png",
  "assets/drop.png",
  "assets/error.png",
  "assets/flower.png",
  "assets/ant.png",
  "assets/mushroom.png",
  "assets/planet.png",
  "assets/book.png",
  "assets/tornado.png",
  "assets/sun.png",
  "assets/tree.png",
  "assets/cloud.png",
  "assets/butterfly.png",
  "assets/house.png",
  "assets/walle.png",
  "assets/law.png",
  "assets/crown.png",
  "assets/euro.png",
  "assets/human.png",
];
let activeImgIndex;
let prevImgIndex;
let activeImg;
let imgIndex;

let grid;
const ALIVE_PROB = 0.2;
let prob = ALIVE_PROB;

let redrawGrid = true;
let showGrid = false;
let showHelp = false;

const instructions = [
  "Wer stört das Ökosystem?",
  "Welche politischen Systeme sind stabil?",
  "Wann versagen Finanzsysteme?",
  "Wie funktionieren Wirtschaftssysteme?",
  "Was soll dieses Verkehrssystem?",
  "Wo interagierst du mit dem Ökosystem?",
  "Was fehlt im Bildungssystem?",
  "Wen stört das Betriebssystem?",
  "Für wen ist das Sozialsystem?",
  "Für wen ist das Wirtschaftssystem?",
  "Welche politischen Systeme sind instabil?",
  "Wer entscheidet über das Wirtschaftssystem?",
  "Was versprechen politische Systeme?",
  "Wer stört das Sozialsystem?",
  "Wann versagen Finanzsysteme?",
  "Wer gehört zum Gesellschaftssystem?",
  "Wo versagen Finanzsysteme?",
  "Wie verändert sich das System?",
  "Wer verdient Wohnraum?",
  "Wohin entwickelt sich das Betriebssystem?",
  "Was sind die Grenzen des Rechtssystems?",
  "Wer entscheidet über das politische System?",
  "Was hält das Sonnensystem zusammen?",
  "Von welchen Systemen bist du ein Teil?",
];

let instCount;
let timer = 0;
let instructionsP;

let infoButton;
let playButton;
let infoVisible = false;
let infoContainer;
let reload;

let zoomSlider;
let sliderValue;
let zoominButton;
let zoomoutButton;
let fasterButton;
let slowerButton;

let handCursor;
// let Cascadia;
let CascadiaItalic;
let speedSlider;

function preload() {
  // Cascadia = loadFont("assets/CascadiaCode.ttf");
  CascadiaItalic = loadFont("assets/CascadiaCodeItalic.ttf");
  handCursor = loadImage("assets/hand.png");

  for (let i = 0; i < imgSrc.length; i++) {
    img[i] = loadImage(imgSrc[i]);
  }
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  instructionsP = select(".instructions");
  instructionsP.html(instructions[activeImgIndex]);

  infoButton = select("#info-button");
  infoButton.mouseClicked(() => {
    infoVisible = !infoVisible;
    infoButton.html(infoVisible ? "&times;" : "i");
    infoContainer.style("transform", infoVisible ? "scale(1)" : "scale(0)");
  });

  reload = select("#reload-button");
  reload.mouseClicked(() => {
    resetSketch();
  });

  infoContainer = select(".info-container");

  playButton = select("#play-button");
  playIcon = select("#play-icon");

  playButton.mouseClicked(() => {
    redrawGrid = !redrawGrid;
    redrawGrid
      ? playIcon.attribute("src", "assets/pause.png")
      : playIcon.attribute("src", "assets/play.png");
  });

  zoomSlider = select("#zoom-slider");
  speedSlider = select("#speed-slider");
  zoominButton = select("#zoomin-btn");
  zoomoutButton = select("#zoomout-btn");
  fasterButton = select("#faster-btn");
  slowerButton = select("#slower-btn");

  zoominButton.mouseClicked(() => {
    let sliderValue = zoomSlider.value();
    sliderValue--;
    zoomSlider.value(sliderValue);
    res = zoomSlider.value();
    removeElements();
    resetSketch();
  });

  zoomoutButton.mouseClicked(() => {
    let sliderValue = zoomSlider.value();
    sliderValue++;
    zoomSlider.value(sliderValue);
    res = zoomSlider.value();
    removeElements();
    resetSketch();
  });

  fasterButton.mouseClicked(() => {
    let speedValue = speedSlider.value();
    speedSlider.value(speedValue - speedSteps);
  });

  slowerButton.mouseClicked(() => {
    let speedValue = speedSlider.value();
    speedSlider.value(speedValue + speedSteps);
  });

  speed = speedSlider.value();

  zoomSlider.changed(() => {
    res = zoomSlider.value();
    removeElements();
    resetSketch();
  });

  resetSketch();
}

function resetSketch() {
  res = zoomSlider.value();

  let temp = height > width ? width : height;
  len = temp / res;

  rows = ceil(height / len);
  cols = ceil(width / len);

  deadColor = color(255);
  aliveColor = color(0, 0);
  activeImg = select(".active-img");

  gridColor = color(0, 0, 255);
  FontSize = temp / DEFAULT_RES;

  grid = new Grid(rows, cols, len, [deadColor, aliveColor], img);
  grid.genorate(prob);
  activeImgIndex = int(random(img.length));
}

function draw() {
  background(deadColor);
  // background(0,0,255);
  speed = speedSlider.value();

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

  if (redrawGrid && frameCount % speed === 0 && !infoVisible) {
    grid.update(activeImgIndex);
  }

  //activeImgIndex display
  image(
    handCursor,
    mouseX,
    mouseY,
    handCursor.width * 2,
    handCursor.height * 2
  );

  if (prevImgIndex !== activeImgIndex) {
    prevImgIndex = activeImgIndex;
    activeImg.attribute("src", imgSrc[activeImgIndex]);
    instructionsP.html(instructions[activeImgIndex]);
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

function mousePressed() {
  if (mouseButton === CENTER) {
    redrawGrid = !redrawGrid;
  }

  const [x, y] = getGridFromMouse();
  if (x === null || y === null) {
    return;
  }

  if (grid.grid[y][x] === 1) {
    editMode = "remove";
  } else {
    editMode = "add";
  }

  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (editMode === "remove") {
    grid.grid[y][x] = 0; //remove clicked img
    activeImgIndex = grid.imgGrid[y][x]; //take on clicked img
  } else if (editMode === "add") {
    grid.grid[y][x] = 1; // place active Img
    grid.imgGrid[y][x] = activeImgIndex; //display active img
  }
}

function touchStarted() {
  const [x, y] = getGridFromMouse();
  if (x === null || y === null) {
    return;
  }

  if (grid.grid[y][x] === 1) {
    editMode = "remove";
  } else {
    editMode = "add";
  }
}

function mouseReleased() {
  editMode = null;
}

function mouseDragged(event) {
  const [x, y] = getGridFromMouse();
  if (x === null || y === null) {
    return;
  }

  toggleCell(x, y);

  // return false;
}

function getGridFromMouse() {
  const gridX = floor(mouseX / grid.len);
  const gridY = floor(mouseY / grid.len);
  const xBound = 0 <= gridX && gridX < grid.cols;
  const yBound = 0 <= gridY && gridY < grid.rows;
  if (!xBound || !yBound) {
    return [null, null];
  }
  return [gridX, gridY];
}
