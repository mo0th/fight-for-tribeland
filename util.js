// Creates a new array of length rows then returns a new array
// where each item is an array of length cols
function make2DArray(rows, cols = rows) {
  return new Array(rows).fill().map(e => new Array(cols));
}

// Draws the outline of a square to the canvas with a given inner width and
// outer width
function emptySquare(x, y, outsideWidth, insideWidth, color) {
  push();
  w = (outsideWidth + insideWidth) / 2;
  noFill();
  stroke(color);
  rectMode(CENTER);
  strokeWeight((outsideWidth - insideWidth) / 2);
  rect(x, y, w, w);
  pop();
}


// Checks whether text is wider than a specified width
// and returns either the height of the text or the
// given width
function textWider(text, font, fontSize, w) {
  let rtn;
  push();
  textFont(font);
  textSize(fontSize);
  if (w < textWidth(text) + fontSize / 2) {
    rtn = textWidth(text) + fontSize / 2;
  } else {
    rtn = w;
  }
  pop();
  return rtn;
}

// Checks whether text is taller than a specified height
// and returns either the height of the text or the
// given height
function textTaller(text, font, fontSize, h) {
  let rtn;
  push();
  textFont(font);
  textSize(fontSize);
  let textHeight = textAscent(text) + textDescent(text)
  if (h < textHeight) {
    rtn = textHeight;
  } else {
    rtn = h;
  }
  pop();
  return rtn;
}

// Accepts a p5.Color object and return a new p5.Color
// with halved red, green and blue values
function darken(col) {
  col = color(col);
  return color(red(col) / 2, green(col) / 2, blue(col) / 2);
}
