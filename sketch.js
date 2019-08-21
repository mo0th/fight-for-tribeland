// Map variable
let m;

// variable is true when the mouse is being dragged
let dragging = false;

// JavaScript object containing all fonts, images and sounds used
let fonts = {
  aquatico: {
    regular: null,
  }
};
let img = {
  logo: null,
  bg: null,
  menuBtn: null,
  warrior: null,
  horseman: null,
  village: null
}
let sounds = {
  bgMusic: null
}

// The number of players in the game
let numPlayers = 4;

// the winner of the game
let winner = null;

// Called once before the canvas loads
function preload() {
  // loads all assets
  for (let font in fonts) {
    for (let style in fonts[font]) {
      fonts[font][style] = loadFont(`Fonts/${font}-${style}.otf`)
    }
  }
  for (let image in img) {
    img[image] = loadImage(`Images/${image}.png`);
  }
  for (let sound in sounds) {
    sounds[sound] = loadSound(`sounds/${sound}.mp3`);
  }
}

// Called once after the page is loaded
function setup() {
  // Create the canvas to fill the window
  cnv = createCanvas(windowWidth, windowHeight);
  // Set maximum framerate to 120 fps
  frameRate(120);
  // Set the current screen to the main menu
  screens.current = 'MainMenu';

  // Start playing the background music
  sounds.bgMusic.loop();
}

// Continous loop
function draw() {
  background(0);
  screens.showCurrent();
}

// Function called when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  screens.currentScreen.resizeElt();
}

// Function called when the mouse is pressed
function mousePressed() {
  // Only pan the map if it exists
  if (m) {
    m.mouse = createVector(mouseX, mouseY);
    m.pOffset.set(m.offset);
  }
}

// Function called if the mouse is pressed and is moving
function mouseDragged() {
  dragging = true;
  if (m) m.pan();
}

// Function called if the mouse is released after being pressed
function mouseClicked() {
  screens.onClick();
  if (!dragging) {
    if (m) m.checkFocus();
  }
  dragging = false;
}

// FOR DEBUGGING PURPOSES
function keyPressed() {
  if (keyCode === ESCAPE) noLoop();
  if (keyCode === ENTER) loop();
}
