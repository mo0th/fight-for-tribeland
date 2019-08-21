class RectButton {
  constructor(options) {
    this.position = {
      x: 0,
      y: 0
    }
    this.fillColour = color('white');
    this.hitColour = color('gray');
    this.stroke = true;
    this.strokeColour = color('black');
    this.strokeWeight = 1;
    this.text = 'NO TEXT';
    this.textColour = color('black');
    this.textSize = 24;
    this.onClick = [];
    this.sizeMode = "auto";
    this.sizeMultiplyer = 1;
    this.w = 50;
    this.h = 50;
    this.activated = true;
    this.selected = false;
    this.selectedColour = color('blue');
    for (let option in options) {
      this[option] = options[option];
    }
  }

  config(options) {
    for (let option in options) {
      this[option] = options[option];
    }
  }

  toggle(bool) {
    this.activated = (typeof bool === 'boolean') ? bool : !this.activated;
  }

  show() {
    push();
    translate(this.position.x, this.position.y)
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    if (this.font) textFont(this.font);
    if (this.sizeMode === "auto") {
      this.w = (textWidth(this.text) + this.textSize/2) * this.sizeMultiplyer;
      this.h = (textAscent(this.text) + textDescent(this.text) + this.textSize/4) * this.sizeMultiplyer;
    }
    if (this.stroke) {
      stroke(this.strokeColour);
      strokeWeight(this.strokeWeight);
    } else {
      noStroke();
    }
    if (!this.activated) {
      fill(darken(this.fillColour));
    } else if (this.hit()) {
      fill(255,127,0);
      scale(1.05);
    } else if (this.selected) {
      fill(this.selectedColour);
    } else {
      if (this.fillColour) fill(this.fillColour);
      else fill(0)
    }
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 5);
    if (!this.activated) fill(darken(this.textColour));
    else fill(this.textColour);
    noStroke();
    text(this.text, 0, -1 * this.textSize / 10);
    pop();
  }

  hit() {
    if (this.activated) {
      return mouseX > this.position.x - this.w / 2 &&
             mouseX < this.position.x + this.w / 2 &&
             mouseY > this.position.y - this.h / 2 &&
             mouseY < this.position.y + this.h / 2;
    }
    return false;
  }

  clicked() {
    if (this.hit() && this.activated) {
      for (let func of this.onClick) {
        if (typeof func === "function") func();
      }
    }

  }

}

class imgButton {
  constructor(options) {
    this.w = 50;
    this.h = 50;
    this.position = {
      x: 0,
      y: 0
    };
    this.img = createImage(this.w,this.h);
    this.imgBaseTint = 'white';
    this.imgHitTint = 'grey';
    this.sizeMode = 'fixed';
    this.label = null;
    this.labelFont = null;
    this.labelFontSize = 24;
    this.labelFontColour = color('white');
    this.activated = true;
    this.selected = false;
    this.onClick = [];

    for (let id in options) {
      this[id] = options[id];
    }
  }

  config(options) {
    for (let id in options) {
      this[id] = options[id];
    }
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    if (this.activated) {
      if (this.hit()) {
        tint('orange');
      } else {
        tint('blue');
      }
    } else {
      tint(darken(this.imgBaseTint));
    }
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    if (this.label) {
      if (this.labelFont) {
        textFont(this.labelFont);
      }
      textSize(this.labelFontSize);
      textAlign(CENTER, TOP);
      fill(this.labelFontColour);
      text(this.label, 0, this.h / 2)
    }
    pop();
  }

  toggle(bool) {
    this.activated = (typeof bool === 'boolean') ? bool : !this.activated;
  }

  hit() {
    if (this.activated) {
      return mouseX > this.position.x - this.w / 2 &&
             mouseX < this.position.x + this.w / 2 &&
             mouseY > this.position.y - this.h / 2 &&
             mouseY < this.position.y + this.h / 2;
    }
    return false;
  }

  clicked() {
    if (this.hit() && this.activated) {
      for (let func of this.onClick) {
        if (typeof func === "function") func();
      }
    }
  }

}
