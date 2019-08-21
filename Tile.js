class Tile {
  constructor(map, mapX, mapY) {
    this.reset(map, mapX, mapY);
  }

  // Display the Tile in the canvas
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
    strokeWeight(1);
    fill(this.col);
    rect(0, 0, this.SIZE, this.SIZE);
    if (this.village) {
      tint(this.village.owner.colour);
      image(img.village, 0, 0, this.SIZE, this.SIZE)
    };
    pop();
    if (this.hit()) {
      this.highlight(this.hitCol);
    } else if (this.hasFocus) {
      this.highlight(darken(this.hitCol));
    }
  }

  // Update the position of the Tile
  update(x, y) {
    this.pos.set(x, y);
    if (this.unit) this.unit.update();
  }

  // Checks whether the mouse is within the Tile
  hit() {
    return (mouseX > this.pos.x - this.SIZE / 2 &&
            mouseX < this.pos.x + this.SIZE / 2 &&
            mouseY > this.pos.y - this.SIZE / 2 &&
            mouseY < this.pos.y + this.SIZE / 2);
  }

  // Highlight the Tile with a certain colour
  highlight(highlightColor, iw) {
    emptySquare(this.pos.x, this.pos.y,
                this.SIZE, iw || this.SIZE * 0.75,
                highlightColor);
  }

  // Reset the Tile
  reset(map, mapX, mapY) {
    this.pos = createVector(0, 0);
    this.map = map;
    this.SIZE = this.map.TILE_SIZE;
    this.hasFocus = false;
    this.col = null;
    this.hitCol = color(0, 0, 255);
    this.unit = null;
    this.mapX = mapX;
    this.mapY = mapY;
    this.village = null;
  }

  // Set the Unit in this Tile
  setUnit(unit) {
    this.unit = unit;
  }

  // Set the focus of the Tile
  setFocussed(bool) {
    this.hasFocus = bool;
    if (this.unit) {
      this.unit.setFocussed(true);
    }
  }

}
